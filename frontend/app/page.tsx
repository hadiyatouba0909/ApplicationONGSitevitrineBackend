import HeroSection from '@/components/HeroSection';
import ServiceCard from '@/components/ServiceCard';
import ActivityCard from '@/components/ActivityCard';
import Link from 'next/link';
import { ArrowRight, Heart, Users, TrendingUp } from 'lucide-react';
import { activitesAPI, servicesAPI, type Activite, type Service } from '@/lib/api';

const stats = [
  { label: 'Enfants aidés', value: '2 500+', icon: Users },
  { label: 'Bourses accordées', value: '850+', icon: Heart },
  { label: 'Centres actifs', value: '12', icon: TrendingUp },
];

async function getData(): Promise<{ services: Service[]; activites: Activite[] }> {
  try {
    const [services, activites] = await Promise.all([
      servicesAPI.getAll(),
      activitesAPI.getAll(),
    ]);
    return { services: services.slice(0, 3), activites: activites.slice(0, 3) };
  } catch {
    return { services: [], activites: [] };
  }
}

export default async function HomePage() {
  const { services, activites } = await getData();
  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Stats */}
      <section className="py-16 bg-primary-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center text-white">
                <stat.icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
                <div className="text-4xl font-bold mb-1">{stat.value}</div>
                <div className="text-primary-100 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* À propos */}
      <section id="a-propos" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-semibold rounded-full mb-4">
                Notre Mission
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                Illuminer l'avenir de chaque enfant
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                LumièreAvenir est une organisation non gouvernementale fondée en 2015, dédiée à l'éducation et à l'autonomisation des jeunes issus de milieux défavorisés.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Nous croyons fermement que l'éducation est le levier le plus puissant pour briser le cycle de la pauvreté et offrir à chaque enfant la chance de réaliser son plein potentiel.
              </p>
              <Link href="/services" className="btn-primary">
                Découvrir nos services <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8 text-center">
                <div className="text-6xl mb-4">📚</div>
                <blockquote className="text-gray-700 italic text-lg font-medium leading-relaxed">
                  "L'éducation est l'arme la plus puissante qu'on puisse utiliser pour changer le monde."
                </blockquote>
                <cite className="block mt-4 text-sm text-gray-500 font-semibold">— Nelson Mandela</cite>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services (aperçu) */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Nos Services</h2>
          <p className="section-subtitle">
            Découvrez comment nous agissons concrètement pour transformer des vies chaque jour.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {services.length > 0 ? services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            )) : (
              <p className="col-span-3 text-center text-gray-400 py-8">Aucun service disponible pour le moment.</p>
            )}
          </div>
          <div className="text-center">
            <Link href="/services" className="btn-secondary">
              Voir tous nos services <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Activités récentes (aperçu) */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Nos Activités Récentes</h2>
          <p className="section-subtitle">
            Retrouvez les actions et événements organisés par LumièreAvenir sur le terrain.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {activites.length > 0 ? activites.map((act) => (
              <ActivityCard key={act.id} activite={act} />
            )) : (
              <p className="col-span-3 text-center text-gray-400 py-8">Aucune activité disponible pour le moment.</p>
            )}
          </div>
          <div className="text-center">
            <Link href="/activites" className="btn-secondary">
              Voir toutes les activités <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Rejoignez notre cause
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Ensemble, nous pouvons offrir un avenir meilleur à des milliers d'enfants. Contactez-nous pour savoir comment contribuer.
          </p>
          <Link href="/contact" className="btn-secondary">
            Nous contacter <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
