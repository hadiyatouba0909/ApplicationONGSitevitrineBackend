import type { Metadata } from 'next';
import './globals.css';
import PublicLayout from '@/components/PublicLayout';

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3001'),
  title: {
    template: '%s | LumièreAvenir',
    default: 'LumièreAvenir – ONG pour l\'éducation',
  },
  description:
    'LumièreAvenir est une ONG dédiée à l\'éducation et à l\'autonomisation des jeunes issus de milieux défavorisés.',
  keywords: ['ONG', 'éducation', 'enfants', 'bourse scolaire', 'solidarité', 'LumièreAvenir'],
  openGraph: {
    title: 'LumièreAvenir – ONG pour l\'éducation',
    description: 'Ensemble, éclairons l\'avenir de chaque enfant.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex flex-col">
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
