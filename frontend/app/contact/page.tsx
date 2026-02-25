import ContactForm from '@/components/ContactForm';
import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez l\'ONG LumièreAvenir pour toute question ou collaboration.',
};

const contactInfo = [
  {
    icon: MapPin,
    label: 'Adresse',
    value: '123 Rue de l\'Espoir, Bamako, Mali',
  },
  {
    icon: Phone,
    label: 'Téléphone',
    value: '+223 70 00 00 00',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contact@lumiereavenir.org',
  },
  {
    icon: Clock,
    label: 'Horaires',
    value: 'Lun – Ven : 8h00 – 17h00',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-gradient-to-br from-gray-800 to-gray-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-3 py-1 bg-white/10 text-white/80 text-sm font-semibold rounded-full mb-4">
            Contactez-nous
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nous Sommes Là Pour Vous</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Vous souhaitez en savoir plus, faire un don ou rejoindre notre équipe ? Envoyez-nous un message, nous vous répondrons rapidement.
          </p>
        </div>
      </section>

      {/* Contenu */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Informations de contact */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Informations de Contact</h2>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-500 mb-1">{item.label}</div>
                      <div className="text-gray-800 font-medium">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Carte / Map placeholder */}
              <div className="mt-8 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50 h-56 flex items-center justify-center border border-gray-200">
                <div className="text-center text-gray-400">
                  <MapPin className="h-10 w-10 mx-auto mb-2 opacity-40" />
                  <span className="text-sm">Carte interactive</span>
                </div>
              </div>
            </div>

            {/* Formulaire */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Envoyez un Message</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
