'use client';

import { useState, useEffect } from 'react';
import { servicesAPI, Service } from '@/lib/api';
import { Plus, Pencil, Trash2, X, CheckCircle, AlertCircle } from 'lucide-react';

type FormState = Omit<Service, 'id'>;
const emptyForm: FormState = { titre: '', description: '', icone: '', ordre: 0, published: true };

const ICONES = ['BookOpen', 'Award', 'School', 'Briefcase', 'Users', 'Package', 'Star', 'Heart', 'Globe', 'Shield', 'Zap', 'Leaf'];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const fetchData = () => {
    setLoading(true);
    servicesAPI.getAllAdmin()
      .then(setServices)
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
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ titre: s.titre, description: s.description, icone: s.icone || '', ordre: s.ordre, published: s.published });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await servicesAPI.update(editing.id, form);
        showAlert('success', 'Service modifié');
      } else {
        await servicesAPI.create(form);
        showAlert('success', 'Service créé');
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
    if (!confirm('Supprimer ce service ?')) return;
    try {
      await servicesAPI.delete(id);
      showAlert('success', 'Service supprimé');
      fetchData();
    } catch {
      showAlert('error', 'Erreur lors de la suppression');
    }
  };

  return (
    <div>
      {alert && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          alert.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {alert.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services</h1>
          <p className="text-gray-500 text-sm mt-1">{services.length} service(s)</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Ajouter
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-400">Chargement...</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-gray-400">Aucun service</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-3 sm:px-6 py-4 text-gray-500 font-semibold">Titre</th>
                  <th className="text-left px-3 sm:px-6 py-4 text-gray-500 font-semibold hidden md:table-cell">Icône</th>
                  <th className="text-left px-3 sm:px-6 py-4 text-gray-500 font-semibold hidden md:table-cell">Ordre</th>
                  <th className="text-left px-3 sm:px-6 py-4 text-gray-500 font-semibold hidden sm:table-cell">Statut</th>
                  <th className="text-right px-3 sm:px-6 py-4 text-gray-500 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 sm:px-6 py-4 font-medium text-gray-800 max-w-[140px] sm:max-w-none truncate">{s.titre}</td>
                    <td className="px-3 sm:px-6 py-4 text-gray-500 hidden md:table-cell">{s.icone || '—'}</td>
                    <td className="px-3 sm:px-6 py-4 text-gray-500 hidden md:table-cell">{s.ordre}</td>
                    <td className="px-3 sm:px-6 py-4 hidden sm:table-cell">
                      <span className={`badge ${s.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.published ? 'Publié' : 'Masqué'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        <button onClick={() => openEdit(s)} className="p-2 rounded-lg text-blue-600 hover:bg-blue-50">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="p-2 rounded-lg text-red-600 hover:bg-red-50">
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
              <h2 className="text-lg font-bold">{editing ? 'Modifier le service' : 'Nouveau service'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-lg text-gray-400 hover:bg-gray-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="label">Titre *</label>
                <input required type="text" value={form.titre} onChange={(e) => setForm((p) => ({ ...p, titre: e.target.value }))} className="input-field" />
              </div>

              <div>
                <label className="label">Description *</label>
                <textarea required rows={4} value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} className="input-field resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Icône</label>
                  <select value={form.icone || ''} onChange={(e) => setForm((p) => ({ ...p, icone: e.target.value }))} className="input-field">
                    <option value="">Aucune</option>
                    {ICONES.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Ordre</label>
                  <input type="number" min={0} value={form.ordre} onChange={(e) => setForm((p) => ({ ...p, ordre: Number(e.target.value) }))} className="input-field" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="pub" checked={form.published} onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))} className="w-4 h-4 rounded text-primary-600" />
                <label htmlFor="pub" className="text-sm font-medium text-gray-700">Publier ce service</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1 justify-center">Annuler</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center disabled:opacity-60">
                  {saving ? 'Enregistrement...' : editing ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
