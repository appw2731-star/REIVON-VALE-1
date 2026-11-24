import { useState } from 'react';
import { Layers } from 'lucide-react';
import { isSafeImageSrc } from '../utils/validators';

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
  loading?: 'lazy' | 'eager';
}

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackTitle = 'REIVON VALE',
  loading = 'lazy',
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);
  const validSrc = !failed && isSafeImageSrc(src);

  if (!validSrc) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#0b132b] via-[#081024] to-[#040711] text-slate-400 border border-sky-400/15 ${className}`}
      >
        <Layers className="w-7 h-7 text-sky-400/60 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-slate-400 px-4 text-center truncate max-w-full">
          {fallbackTitle}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
