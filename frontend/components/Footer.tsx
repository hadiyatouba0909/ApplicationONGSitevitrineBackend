import Link from 'next/link';
import { Sun, Mail, Phone, MapPin, Heart } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Accueil' },
  { href: '/activites', label: 'Activités' },
  { href: '/services', label: 'Services' },
  { href: '/contact', label: 'Contact' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo + description */}
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-white mb-4">
              <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
                <Sun className="h-5 w-5 text-white" />
              </div>
              <span>
                <span className="text-primary-400">Lumière</span>Avenir
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              ONG dédiée à l&apos;éducation et à l&apos;autonomisation des jeunes issus de milieux défavorisés. Ensemble, éclairons l&apos;avenir de chaque enfant.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary-400 flex-shrink-0" />
                123 Rue de l&apos;Espoir, Bamako
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-400 flex-shrink-0" />
                +223 70 00 00 00
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-400 flex-shrink-0" />
                contact@lumiereavenir.org
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} LumièreAvenir. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Fait avec <Heart className="h-3 w-3 text-red-500" /> pour les enfants
          </p>
          <Link href="/admin" className="hover:text-gray-400 transition-colors">
            Administration
          </Link>
        </div>
      </div>
    </footer>
  );
}
