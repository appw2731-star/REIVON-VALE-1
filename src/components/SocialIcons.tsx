import { Globe, Github, Linkedin, Youtube } from 'lucide-react';
import type { SocialPlatform } from '../types/portfolio';

interface SocialIconProps {
  platform: SocialPlatform;
  className?: string;
  brandColored?: boolean;
}

export function SocialIcon({
  platform,
  className = 'w-5 h-5',
  brandColored = false,
}: SocialIconProps) {
  switch (platform) {
    case 'facebook':
      if (brandColored) {
        return (
          <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
            <defs>
              <linearGradient id="fbOfficialGrad" x1="10" y1="6" x2="38" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2AA4FF" />
                <stop offset="1" stopColor="#1877F2" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="22" fill="url(#fbOfficialGrad)" />
            <path
              d="M29.4 25.5l.8-5.2h-5v-3.4c0-1.4.7-2.8 2.9-2.8h2.3V9.6s-2.1-.4-4-.4c-4.1 0-6.8 2.5-6.8 7v4.1h-4.6v5.2h4.6V39a18.5 18.5 0 0 0 5.6 0V25.5h4.2z"
              fill="#FFFFFF"
            />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M13.5 21v-8.2h2.76l.41-3.2H13.5V7.56c0-.93.26-1.56 1.59-1.56h1.7V3.14A22.8 22.8 0 0 0 14.3 3c-2.46 0-4.14 1.5-4.14 4.26V9.6H7.4v3.2h2.76V21h3.34Z" />
        </svg>
      );

    case 'instagram':
      if (brandColored) {
        return (
          <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
            <defs>
              <radialGradient id="igOfficialGrad" cx="28%" cy="105%" r="120%">
                <stop offset="0%" stopColor="#FDDF68" />
                <stop offset="28%" stopColor="#F58529" />
                <stop offset="56%" stopColor="#DD2A7B" />
                <stop offset="82%" stopColor="#8134AF" />
                <stop offset="100%" stopColor="#515BD4" />
              </radialGradient>
            </defs>
            <rect x="4" y="4" width="40" height="40" rx="12" fill="url(#igOfficialGrad)" />
            <rect x="12.5" y="12.5" width="23" height="23" rx="6.5" fill="none" stroke="#FFFFFF" strokeWidth="2.8" />
            <circle cx="24" cy="24" r="5.6" fill="none" stroke="#FFFFFF" strokeWidth="2.8" />
            <circle cx="31.2" cy="16.8" r="1.7" fill="#FFFFFF" />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" className={className} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
        </svg>
      );

    case 'tiktok':
      if (brandColored) {
        return (
          <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
            <rect x="4" y="4" width="40" height="40" rx="12" fill="#0B0B14" stroke="#2A2A40" strokeWidth="1.5" />
            {/* Cyan offset silhouette */}
            <path
              d="M32.4 17.5a7.1 7.1 0 0 1-5.5-6.2V10.5h-4.7v19.8a4.2 4.2 0 1 1-3-4v-4.9a9.1 9.1 0 1 0 7.7 9V20.2a11.7 11.7 0 0 0 6.8 2.2v-4.8a7.4 7.4 0 0 1-1.3-.1Z"
              fill="#25F4EE"
              transform="translate(-1.4, -1.2)"
            />
            {/* Crimson offset silhouette */}
            <path
              d="M32.4 17.5a7.1 7.1 0 0 1-5.5-6.2V10.5h-4.7v19.8a4.2 4.2 0 1 1-3-4v-4.9a9.1 9.1 0 1 0 7.7 9V20.2a11.7 11.7 0 0 0 6.8 2.2v-4.8a7.4 7.4 0 0 1-1.3-.1Z"
              fill="#FE2C55"
              transform="translate(1.4, 1.2)"
            />
            {/* Crisp pure white foreground glyph */}
            <path
              d="M32.4 17.5a7.1 7.1 0 0 1-5.5-6.2V10.5h-4.7v19.8a4.2 4.2 0 1 1-3-4v-4.9a9.1 9.1 0 1 0 7.7 9V20.2a11.7 11.7 0 0 0 6.8 2.2v-4.8a7.4 7.4 0 0 1-1.3-.1Z"
              fill="#FFFFFF"
            />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1Z" />
        </svg>
      );

    case 'telegram':
      if (brandColored) {
        return (
          <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
            <defs>
              <linearGradient id="tgOfficialGrad" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
                <stop stopColor="#37AEE2" />
                <stop offset="1" stopColor="#1E96C8" />
              </linearGradient>
            </defs>
            <circle cx="24" cy="24" r="22" fill="url(#tgOfficialGrad)" />
            <path
              d="M34.6 14.3L11.7 23.1c-1.5.6-1.5 1.5-.3 1.9l5.9 1.8 2.3 7.1c.3.8.5 1.1 1.1 1.1.6 0 .9-.3 1.3-.7l3.2-3.1 6.5 4.8c1.2.7 2 .3 2.3-1.1l4.1-19.3c.4-1.7-.6-2.4-2.5-1.3Z"
              fill="#FFFFFF"
            />
            <path
              d="M19.8 26.5l11.2-7c.5-.3.9-.1.5.2l-9.2 8.3-.4 4.1-2.1-5.6Z"
              fill="#C8E6F5"
            />
          </svg>
        );
      }
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M21.2 4.3a1.2 1.2 0 0 0-1.26-.17L3.1 10.8a1.15 1.15 0 0 0 .08 2.16l4.02 1.26 1.55 4.92a1 1 0 0 0 1.67.4l2.24-2.2 4.35 3.18a1.2 1.2 0 0 0 1.88-.72l2.68-14.2a1.2 1.2 0 0 0-.37-1.3ZM9.42 13.7l8.2-5.15-6.4 6.45-.28 2.84-1.06-3.4-.46-.74Z" />
        </svg>
      );

    case 'github':
      return <Github className={className} aria-hidden="true" />;
    case 'linkedin':
      return <Linkedin className={className} aria-hidden="true" />;
    case 'youtube':
      return <Youtube className={className} aria-hidden="true" />;
    case 'x':
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      );
    default:
      return <Globe className={className} aria-hidden="true" />;
  }
}
