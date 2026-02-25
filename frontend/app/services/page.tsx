'use client';

import { useState, useEffect } from 'react';
import { servicesAPI, Service } from '@/lib/api';
import ServiceCard from '@/components/ServiceCard';
import Link from 'next/link';
import { LayoutGrid, ArrowRight } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    servicesAPI.getAll()
      .then(setServices)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-secondary-700 to-primary-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <LayoutGrid className="h-6 w-6 opacity-80" />
            <span className="text-secondary-200 font-medium">Ce que nous faisons</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Services</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            LumièreAvenir propose une gamme complète de services éducatifs pour accompagner chaque enfant depuis la scolarité primaire jusqu'à l'insertion professionnelle.
          </p>
        </div>
      </section>

      {/* Liste des services */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse space-y-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl" />
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-5/6" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Un service vous intéresse ?
          </h2>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">
            N'hésitez pas à nous contacter pour plus d'informations ou pour rejoindre l'un de nos programmes.
          </p>
          <Link href="/contact" className="btn-primary">
            Nous contacter <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
