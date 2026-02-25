'use client';

import { useState, useEffect } from 'react';
import { contactAPI, ContactMessage } from '@/lib/api';
import { Mail, MailOpen, Trash2, CheckCircle, AlertCircle, Filter } from 'lucide-react';
import clsx from 'clsx';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const fetchData = () => {
    setLoading(true);
    contactAPI.getMessages()
      .then(setMessages)
      .catch(() => showAlert('error', 'Erreur lors du chargement'))
      .finally(() => setLoading(false));
  };

  useEffect(fetchData, []);

  const showAlert = (type: 'success' | 'error', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleRead = async (id: number) => {
    try {
      await contactAPI.markAsRead(id);
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, lu: true } : m));
      if (selected?.id === id) setSelected((prev) => prev ? { ...prev, lu: true } : null);
    } catch {
      showAlert('error', 'Erreur');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer ce message ?')) return;
    try {
      await contactAPI.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      showAlert('success', 'Message supprimé');
    } catch {
      showAlert('error', 'Erreur lors de la suppression');
    }
  };

  const openMessage = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.lu) await handleRead(msg.id);
  };

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.lu;
    if (filter === 'read') return m.lu;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.lu).length;

  return (
    <div>
      {alert && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${
          alert.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {alert.type === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {alert.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500 text-sm mt-1">
            {messages.length} message(s) · {unreadCount} non lu(s)
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={clsx(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                filter === f ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              )}
            >
              {f === 'all' ? 'Tous' : f === 'unread' ? 'Non lus' : 'Lus'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste */}
        <div className={clsx(
          'bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden',
          selected && 'hidden lg:block'
        )}>
          {loading ? (
            <div className="p-12 text-center text-gray-400">Chargement...</div>
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Mail className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p>Aucun message</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => openMessage(msg)}
                  className={clsx(
                    'flex items-start gap-3 px-5 py-4 cursor-pointer transition-colors',
                    selected?.id === msg.id ? 'bg-primary-50' : 'hover:bg-gray-50',
                    !msg.lu && 'border-l-2 border-primary-500'
                  )}
                >
                  <div className={`mt-1 flex-shrink-0 ${msg.lu ? 'text-gray-300' : 'text-primary-500'}`}>
                    {msg.lu ? <MailOpen className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm font-semibold truncate ${!msg.lu ? 'text-gray-900' : 'text-gray-600'}`}>
                        {msg.nom}
                      </span>
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 truncate">{msg.sujet}</div>
                    <div className="text-xs text-gray-500 truncate mt-0.5">{msg.message}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Détail */}
        <div className={clsx(
          'bg-white rounded-2xl shadow-sm border border-gray-100',
          !selected && 'hidden lg:block'
        )}>
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-300 gap-3">
              <MailOpen className="h-12 w-12" />
              <p className="text-sm">Sélectionnez un message</p>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-6">
                <button
                  onClick={() => setSelected(null)}
                  className="lg:hidden mr-3 p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 flex-shrink-0"
                >
                  ← Retour
                </button>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{selected.sujet}</h3>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {new Date(selected.created_at).toLocaleDateString('fr-FR', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(selected.id)}
                  className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-gray-400 text-xs block mb-0.5">De</span>
                  <span className="font-semibold text-gray-800">{selected.nom}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <span className="text-gray-400 text-xs block mb-0.5">Email</span>
                  <a href={`mailto:${selected.email}`} className="font-semibold text-primary-600 hover:underline truncate block">
                    {selected.email}
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {selected.message}
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: ${selected.sujet}`}
                  className="btn-primary text-sm flex-1 justify-center"
                >
                  Répondre par email
                </a>
                {!selected.lu && (
                  <button onClick={() => handleRead(selected.id)} className="btn-outline text-sm">
                    Marquer lu
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
