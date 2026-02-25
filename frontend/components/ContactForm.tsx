'use client';

import { useState } from 'react';
import { contactAPI } from '@/lib/api';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [form, setForm] = useState({ nom: '', email: '', sujet: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    try {
      await contactAPI.send(form);
      setStatus('success');
      setForm({ nom: '', email: '', sujet: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Une erreur est survenue.');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-green-800 mb-2">Message envoyé !</h3>
        <p className="text-green-600 text-sm mb-4">
          Merci pour votre message. Notre équipe vous répondra dans les plus brefs délais.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-green-700 font-semibold underline text-sm"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nom" className="label">Nom complet *</label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            value={form.nom}
            onChange={handleChange}
            className="input-field"
            placeholder="Jean Dupont"
          />
        </div>
        <div>
          <label htmlFor="email" className="label">Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="input-field"
            placeholder="jean@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="sujet" className="label">Sujet *</label>
        <select
          id="sujet"
          name="sujet"
          required
          value={form.sujet}
          onChange={handleChange}
          className="input-field"
        >
          <option value="">Choisir un sujet...</option>
          <option value="Don / Partenariat">🤝 Don / Partenariat</option>
          <option value="Bourse scolaire">🎓 Bourse scolaire</option>
          <option value="Bénévolat">💪 Bénévolat</option>
          <option value="Information générale">ℹ️ Information générale</option>
          <option value="Autre">✉️ Autre</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="label">Message *</label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="input-field resize-none"
          placeholder="Écrivez votre message ici..."
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Envoyer le message
          </>
        )}
      </button>
    </form>
  );
}
