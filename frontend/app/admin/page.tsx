'use client';

import { useState, useEffect } from 'react';
import { activitesAPI, servicesAPI, contactAPI } from '@/lib/api';
import Link from 'next/link';
import { Image, Grid, MessageSquare, ArrowRight, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ activites: 0, services: 0, messages: 0, nonLus: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      activitesAPI.getAllAdmin().catch(() => []),
      servicesAPI.getAllAdmin().catch(() => []),
      contactAPI.getMessages().catch(() => []),
    ]).then(([activites, services, messages]) => {
      const nonLus = messages.filter((m) => !m.lu).length;
      setStats({
        activites: activites.length,
        services: services.length,
        messages: messages.length,
        nonLus,
      });
    }).finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      label: 'Activités',
      value: stats.activites,
      icon: Image,
      href: '/admin/activites',
      color: 'bg-primary-500',
      lightColor: 'bg-primary-50',
      textColor: 'text-primary-600',
    },
    {
      label: 'Services',
      value: stats.services,
      icon: Grid,
      href: '/admin/services',
      color: 'bg-secondary-500',
      lightColor: 'bg-secondary-50',
      textColor: 'text-secondary-600',
    },
    {
      label: 'Messages reçus',
      value: stats.messages,
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      badge: stats.nonLus > 0 ? stats.nonLus : undefined,
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-500 mt-1">Bienvenue dans l&apos;espace administration de LumièreAvenir</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.lightColor} rounded-xl flex items-center justify-center`}>
                <card.icon className={`h-6 w-6 ${card.textColor}`} />
              </div>
              {card.badge !== undefined && (
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {card.badge} non lu{card.badge > 1 ? 's' : ''}
                </span>
              )}
            </div>
            <div className={`text-3xl font-bold ${card.textColor} mb-1`}>
              {loading ? '—' : card.value}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">{card.label}</span>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-bold text-gray-800">Actions rapides</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/admin/activites" className="btn-primary text-sm py-2.5 justify-center">
            + Ajouter une activité
          </Link>
          <Link href="/admin/services" className="btn-secondary text-sm py-2.5 justify-center">
            + Ajouter un service
          </Link>
          <Link href="/admin/messages" className="btn-outline text-sm py-2.5 justify-center">
            Voir les messages
          </Link>
        </div>
      </div>

      {/* Lien site public */}
      <div className="mt-6 text-center text-sm text-gray-400">
        <Link href="/" target="_blank" className="hover:text-primary-600 transition-colors">
          → Voir le site public
        </Link>
      </div>
    </div>
  );
}
