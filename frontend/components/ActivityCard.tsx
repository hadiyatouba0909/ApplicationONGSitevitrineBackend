'use client';

import { Activite } from '@/lib/api';
import Image from 'next/image';
import { Calendar, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';

interface Props {
  activite: Activite;
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default function ActivityCard({ activite }: Props) {
  const [imgError, setImgError] = useState(false);

  const imageUrl = activite.image_url
    ? activite.image_url.startsWith('http')
      ? activite.image_url
      : `${API_URL}${activite.image_url}`
    : null;

  const showImage = imageUrl && !imgError;

  return (
    <article className="card group">
      {/* Image */}
      <div className="relative h-52 bg-gradient-to-br from-primary-100 to-secondary-100 overflow-hidden">
        {showImage ? (
          <Image
            src={imageUrl}
            alt={activite.titre}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-gray-300" />
          </div>
        )}
      </div>

      {/* Contenu */}
      <div className="p-5">
        {activite.date_activite && (
          <div className="flex items-center gap-1.5 text-xs text-primary-600 font-semibold mb-2">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(activite.date_activite)}
          </div>
        )}
        <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {activite.titre}
        </h3>
        {activite.description && (
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
            {activite.description}
          </p>
        )}
      </div>
    </article>
  );
}
