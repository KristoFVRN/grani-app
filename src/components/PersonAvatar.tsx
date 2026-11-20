import React, { useState } from 'react';
import { resolveUploadUrl } from '../api/syncApi';

interface PersonAvatarProps {
  src?: string;
  name: string;
  className?: string;
  textClassName?: string;
}

const AVATAR_GRADIENTS = [
  'from-[#4e1984] to-[#7c3aed]',
  'from-amber-500 to-orange-500',
  'from-emerald-600 to-teal-500',
  'from-sky-600 to-blue-500',
  'from-rose-500 to-pink-600',
  'from-indigo-600 to-purple-600'
];

function getInitials(name: string): string {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

function getGradientClass(name: string): string {
  const clean = (name || '').trim();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash * 31 + clean.charCodeAt(i)) >>> 0;
  }
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

/**
 * Reusable avatar component with instant deterministic initials and graceful photo fade-in.
 */
export const PersonAvatar: React.FC<PersonAvatarProps> = ({
  src,
  name,
  className = 'w-10 h-10 rounded-full',
  textClassName = 'text-xs'
}) => {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const resolvedSrc = resolveUploadUrl(src || '');
  const initials = getInitials(name);
  const gradient = getGradientClass(name);
  const showImage = Boolean(resolvedSrc) && failedSrc !== resolvedSrc;
  const isLoaded = showImage && loadedSrc === resolvedSrc;

  return (
    <div
      className={`relative overflow-hidden select-none flex items-center justify-center shrink-0 bg-gradient-to-br ${gradient} text-white font-extrabold ${className}`}
    >
      <span className={`leading-none tracking-tight ${textClassName}`}>{initials}</span>
      {showImage && (
        <img
          key={resolvedSrc}
          src={resolvedSrc}
          alt={name || 'Фото'}
          onLoad={() => setLoadedSrc(resolvedSrc)}
          onError={() => setFailedSrc(resolvedSrc)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};
