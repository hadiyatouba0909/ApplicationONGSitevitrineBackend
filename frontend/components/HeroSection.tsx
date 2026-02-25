import Link from 'next/link';
import { ArrowRight, PlayCircle } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 via-white to-primary-50 pt-16">
      {/* Décoration arrière-plan */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200 rounded-full opacity-20 blur-3xl" />
        <div className="absolute bottom-0 -left-24 w-80 h-80 bg-secondary-200 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Texte */}
          <div className="animate-slide-up">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
              🌟 ONG pour l&apos;Éducation
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Ensemble,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                illuminons
              </span>{' '}
              l&apos;avenir
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-lg">
              LumièreAvenir œuvre chaque jour pour offrir à chaque enfant défavorisé l&apos;accès à une éducation de qualité et un avenir meilleur.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/activites" className="btn-primary">
                Nos activités <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/services" className="btn-secondary">
                <PlayCircle className="h-4 w-4" />
                Nos services
              </Link>
            </div>

            {/* Mini stats */}
            <div className="mt-12 flex gap-8">
              <div>
                <div className="text-2xl font-bold text-gray-900">2 500+</div>
                <div className="text-sm text-gray-500">Enfants aidés</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="text-2xl font-bold text-gray-900">10 ans</div>
                <div className="text-sm text-gray-500">D&apos;expérience</div>
              </div>
              <div className="w-px bg-gray-200" />
              <div>
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-sm text-gray-500">Centres actifs</div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="relative animate-fade-in hidden md:block">
            <div className="relative bg-gradient-to-br from-primary-500 to-secondary-600 rounded-3xl p-1 shadow-2xl">
              <div className="bg-white rounded-[22px] overflow-hidden">
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 h-80 flex flex-col items-center justify-center p-8 text-center">
                  <div className="text-8xl mb-4">📖</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    L&apos;éducation, une lumière pour chaque enfant
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Chaque enfant mérite de pouvoir apprendre, grandir et réaliser ses rêves.
                  </p>
                </div>
              </div>
            </div>

            {/* Badge flottant */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <span className="text-green-600 font-bold text-lg">✓</span>
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">Mission accomplie</div>
                <div className="text-xs text-gray-500">850+ bourses accordées</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
