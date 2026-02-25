'use client';

import { useState, useEffect, useRef } from 'react';
import { activitesAPI, Activite } from '@/lib/api';
import Image from 'next/image';
import { Plus, Pencil, Trash2, X, CheckCircle, AlertCircle, UploadCloud } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

type FormState = {
  titre: string;
  description: string;
  date_activite: string;
  published: boolean;
  image?: File | null;
};

const emptyForm: FormState = { titre: '', description: '', date_activite: '', published: true, image: null };

export default function AdminActivitesPage() {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Activite | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [preview, setPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchData = () => {
    setLoading(true);
    activitesAPI.getAllAdmin()
      .then(setActivites)
      .catch(() => showAlert('error', 'Erreur lors du chargement'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, []);

  const showAlert = (type: 'success' | 'error', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 4000);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setPreview(null);
    setShowModal(true);
  };

  const openEdit = (a: Activite) => {
    setEditing(a);
    setForm({
      titre: a.titre,
      description: a.description || '',
      date_activite: a.date_activite ? a.date_activite.split('T')[0] : '',
      published: a.published,
      image: null,
    });
    const imgUrl = a.image_url
      ? a.image_url.startsWith('http') ? a.image_url : `${API_URL}${a.image_url}`
      : null;
    setPreview(imgUrl);
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((p) => ({ ...p, image: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const fd = new FormData();
    fd.append('titre', form.titre);
    fd.append('description', form.description);
    if (form.date_activite) fd.append('date_activite', form.date_activite);
    fd.append('published', String(form.published));
    if (form.image) fd.append('image', form.image);

    try {
      if (editing) {
        await activitesAPI.update(editing.id, fd);
        showAlert('success', 'Activité modifiée avec succès');
      } else {
        await activitesAPI.create(fd);
        showAlert('success', 'Activité créée avec succès');
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      showAlert('error', err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cette activité ?')) return;
    try {
      await activitesAPI.delete(id);
      showAlert('success', 'Activité supprimée');
      fetchData();
    } catch {
      showAlert('error', 'Erreur lors de la suppression');
    }
  };

  return (
    <div>
      {/* Alert */}
      {alert && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          alert.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {alert.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activités</h1>
          <p className="text-gray-500 text-sm mt-1">{activites.length} activité(s) au total</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Chargement...</div>
        ) : activites.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Aucune activité — cliquez sur &quot;Ajouter&quot;</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-3 sm:px-6 py-4 text-gray-500 font-semibold">Image</th>
                  <th className="text-left px-3 sm:px-6 py-4 text-gray-500 font-semibold">Titre</th>
                  <th className="text-left px-3 sm:px-6 py-4 text-gray-500 font-semibold hidden md:table-cell">Date</th>
                  <th className="text-left px-3 sm:px-6 py-4 text-gray-500 font-semibold hidden sm:table-cell">Statut</th>
                  <th className="text-right px-3 sm:px-6 py-4 text-gray-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activites.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4">
                      <div className="relative w-10 sm:w-14 h-10 rounded-lg overflow-hidden bg-gray-100">
                        {a.image_url ? (
                          <Image
                            src={a.image_url.startsWith('http') ? a.image_url : `${API_URL}${a.image_url}`}
                            alt={a.titre}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-300 text-xs">img</div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 sm:px-6 py-4 font-medium text-gray-800 max-w-[120px] sm:max-w-xs truncate">{a.titre}</td>
                    <td className="px-3 sm:px-6 py-4 text-gray-500 hidden md:table-cell">
                      {a.date_activite ? new Date(a.date_activite).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                      <span className={`badge ${a.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {a.published ? 'Publié' : 'Masqué'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button onClick={() => openEdit(a)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">
                {editing ? 'Modifier l\'activité' : 'Nouvelle activité'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Titre *</label>
                <input
                  required
                  type="text"
                  value={form.titre}
                  onChange={(e) => setForm((p) => ({ ...p, titre: e.target.value }))}
                  className="input-field"
                  placeholder="Titre de l'activité"
                />
              </div>

              <div>
                <label className="label">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  className="input-field resize-none"
                  placeholder="Description de l'activité..."
                />
              </div>

              <div>
                <label className="label">Date de l'activité</label>
                <input
                  type="date"
                  value={form.date_activite}
                  onChange={(e) => setForm((p) => ({ ...p, date_activite: e.target.value }))}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label">Image {editing ? '(laisser vide pour conserver)' : '*'}</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="mt-1 border-2 border-dashed border-gray-200 rounded-xl p-4 cursor-pointer hover:border-primary-400 transition-colors text-center"
                >
                  {preview ? (
                    <div className="relative h-32 rounded-lg overflow-hidden">
                      <Image src={preview} alt="Aperçu" fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 py-4">
                      <UploadCloud className="h-8 w-8" />
                      <span className="text-sm">Cliquez pour sélectionner une image</span>
                      <span className="text-xs">JPEG, PNG, WEBP – max 5Mo</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.published}
                  onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
                  className="w-4 h-4 rounded text-primary-600"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">Publier cette activité</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {saving ? 'Enregistrement...' : (editing ? 'Modifier' : 'Créer')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
