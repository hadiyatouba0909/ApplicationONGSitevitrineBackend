'use client';

import { useState, useEffect } from 'react';
import { activitesAPI, Activite } from '@/lib/api';
import ActivityCard from '@/components/ActivityCard';
import { Search, Calendar } from 'lucide-react';

export default function ActivitesPage() {
  const [activites, setActivites] = useState<Activite[]>([]);
  const [filtered, setFiltered] = useState<Activite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    activitesAPI.getAll()
      .then((data) => {
        setActivites(data);
        setFiltered(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      activites.filter(
        (a) =>
          a.titre.toLowerCase().includes(q) ||
          (a.description || '').toLowerCase().includes(q)
      )
    );
  }, [search, activites]);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-600 to-secondary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="h-6 w-6 opacity-80" />
            <span className="text-primary-200 font-medium">Nos activités</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Nos Actions sur le Terrain
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Découvrez toutes les activités, événements et actions menées par LumièreAvenir pour les enfants et les communautés.
          </p>
        </div>
      </section>

      {/* Barre de recherche */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher une activité..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12"
            />
          </div>
        </div>
      </section>

      {/* Liste */}
      <section className="py-16 bg-gray-50 min-h-[400px]">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-52 bg-gray-200 rounded-t-2xl" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">Aucune activité trouvée</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((activite) => (
                <ActivityCard key={activite.id} activite={activite} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
