import type { TechIconId } from '../utils/techStack';

interface TechStackIconProps {
  iconId: TechIconId;
  className?: string;
}

/**
 * Lightweight, hand-crafted geometric SVG icons for project tech stacks.
 * Renders crisp 24x24 marks using currentColor so each icon inherits its semantic technology accent.
 */
export function TechStackIcon({ iconId, className = 'w-4 h-4 shrink-0' }: TechStackIconProps) {
  switch (iconId) {
    case 'react':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="2.1" fill="currentColor" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.8" stroke="currentColor" strokeWidth="1.5" />
          <ellipse
            cx="12"
            cy="12"
            rx="9.5"
            ry="3.8"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9.5"
            ry="3.8"
            stroke="currentColor"
            strokeWidth="1.5"
            transform="rotate(120 12 12)"
          />
        </svg>
      );

    case 'nextjs':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8.5 16V8.5L16.8 18.2M15.5 8.5V13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'typescript':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M6.8 10.2H11.8M9.3 10.2V17M17.2 11.4C16.8 10.6 16 10.2 15.1 10.2C13.9 10.2 13.1 10.9 13.1 11.9C13.1 13 14 13.4 15.2 13.7C16.4 14 17.3 14.5 17.3 15.5C17.3 16.5 16.4 17.2 15.1 17.2C14 17.2 13.1 16.7 12.7 15.9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'javascript':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M10.4 10.2V15.3C10.4 16.4 9.7 17.1 8.6 17.1C7.8 17.1 7.2 16.7 6.9 16.1M17.2 11.4C16.8 10.6 16 10.2 15.1 10.2C13.9 10.2 13.1 10.9 13.1 11.9C13.1 13 14 13.4 15.2 13.7C16.4 14 17.3 14.5 17.3 15.5C17.3 16.5 16.4 17.2 15.1 17.2C14 17.2 13.1 16.7 12.7 15.9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'tailwind':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M6.2 10.2C7 7.6 8.8 6.4 11.4 6.4C14.8 6.4 15.3 9 17.1 9.5C18.3 9.8 19.3 9.3 20.2 8.2C19.4 10.8 17.6 12 15 12C11.6 12 11.1 9.4 9.3 8.9C8.1 8.6 7.1 9.1 6.2 10.2Z"
            fill="currentColor"
          />
          <path
            d="M3.8 15.8C4.6 13.2 6.4 12 9 12C12.4 12 12.9 14.6 14.7 15.1C15.9 15.4 16.9 14.9 17.8 13.8C17 16.4 15.2 17.6 12.6 17.6C9.2 17.6 8.7 15 6.9 14.5C5.7 14.2 4.7 14.7 3.8 15.8Z"
            fill="currentColor"
            fillOpacity="0.82"
          />
        </svg>
      );

    case 'firebase':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M5.5 17.8L8.2 4.2C8.3 3.7 9 3.6 9.3 4.1L12.1 9.4L15.6 6.2C16 5.8 16.7 6 16.8 6.6L18.5 17.8L12 21.3L5.5 17.8Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M5.7 17.6L12.1 9.5L16.3 13.6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'vercel':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path d="M12 4.5L21 19.5H3L12 4.5Z" fill="currentColor" />
        </svg>
      );

    case 'pwa':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="6" y="2.8" width="12" height="18.4" rx="2.6" stroke="currentColor" strokeWidth="1.65" />
          <path
            d="M12.6 7.8L9.6 12.4H12.2L11.4 16.2L14.4 11.6H11.8L12.6 7.8Z"
            fill="currentColor"
          />
        </svg>
      );

    case 'ai':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3L14.3 9.7L21 12L14.3 14.3L12 21L9.7 14.3L3 12L9.7 9.7L12 3Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
          <circle cx="18.2" cy="5.8" r="1.4" fill="currentColor" />
        </svg>
      );

    case 'formula':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M17.5 5.5H7.2L13.4 12L7.2 18.5H17.5"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17.5 5.5V7.8M17.5 16.2V18.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'bilingual':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M4.5 16.5L7.6 7.5L10.7 16.5M5.5 13.7H9.7"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 8.5H19.5M16.2 6.8V8.5M18.4 8.5C17.8 11.8 15.8 14.5 13 16.2M14.2 11.2C15.2 13 16.9 14.8 19.3 16.2"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'nodejs':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3L19.8 7.5V16.5L12 21L4.2 16.5V7.5L12 3Z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 14.5V9.5L14.5 14.5V9.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'python':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 4.2C8.8 4.2 8.8 6.1 8.8 6.1V8.4H12.2V9.2H7.4C7.4 9.2 4.5 8.9 4.5 12.1C4.5 15.3 7 15.2 7 15.2H8.4V13.4C8.4 13.4 8.3 11.3 10.5 11.3H14C14 11.3 15.8 11.3 15.8 9.5V6.3C15.8 6.3 16.1 4.2 12 4.2Z"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinejoin="round"
          />
          <path
            d="M12 19.8C15.2 19.8 15.2 17.9 15.2 17.9V15.6H11.8V14.8H16.6C16.6 14.8 19.5 15.1 19.5 11.9C19.5 8.7 17 8.8 17 8.8H15.6V10.6C15.6 10.6 15.7 12.7 13.5 12.7H10C10 12.7 8.2 12.7 8.2 14.5V17.7C8.2 17.7 7.9 19.8 12 19.8Z"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinejoin="round"
          />
          <circle cx="10.4" cy="6.4" r="0.8" fill="currentColor" />
          <circle cx="13.6" cy="17.6" r="0.8" fill="currentColor" />
        </svg>
      );

    case 'threejs':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M5 4.8L19.5 9.2L8.8 19.5L5 4.8Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
          <path
            d="M12.2 7L14.2 14.3L6.9 12.1L12.2 7Z"
            stroke="currentColor"
            strokeWidth="1.45"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'database':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <ellipse cx="12" cy="6.2" rx="7.2" ry="2.8" stroke="currentColor" strokeWidth="1.65" />
          <path
            d="M4.8 6.2V17.8C4.8 19.3 8 20.5 12 20.5C16 20.5 19.2 19.3 19.2 17.8V6.2"
            stroke="currentColor"
            strokeWidth="1.65"
          />
          <path
            d="M4.8 12C4.8 13.5 8 14.7 12 14.7C16 14.7 19.2 13.5 19.2 12"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      );

    case 'server':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="3.5" y="4.5" width="17" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.65" />
          <rect x="3.5" y="13.5" width="17" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.65" />
          <circle cx="7" cy="7.5" r="1" fill="currentColor" />
          <circle cx="7" cy="16.5" r="1" fill="currentColor" />
        </svg>
      );

    case 'mobile':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <rect x="6.5" y="3" width="11" height="18" rx="2.4" stroke="currentColor" strokeWidth="1.65" />
          <line x1="10.2" y1="17.8" x2="13.8" y2="17.8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      );

    case 'code':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M8.5 7.5L4 12L8.5 16.5M15.5 7.5L20 12L15.5 16.5M13.5 5.5L10.5 18.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'cube':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 3.2L19.6 7.6V16.4L12 20.8L4.4 16.4V7.6L12 3.2Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
          <path
            d="M4.6 7.7L12 12L19.4 7.7M12 12V20.6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'cloud':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M7.5 18H17.2C19.3 18 21 16.4 21 14.3C21 12.4 19.6 10.9 17.7 10.7C17.1 7.8 14.5 5.8 11.5 5.8C8.1 5.8 5.4 8.4 5.2 11.7C3.8 12.2 3 13.4 3 14.9C3 16.6 4.5 18 6.4 18H7.5Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'globe':
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="8.8" stroke="currentColor" strokeWidth="1.65" />
          <ellipse cx="12" cy="12" rx="4.2" ry="8.8" stroke="currentColor" strokeWidth="1.45" />
          <path d="M3.6 9.2H20.4M3.6 14.8H20.4" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
          <path
            d="M12 4L20 8.5L12 13L4 8.5L12 4Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
          <path
            d="M4 12.5L12 17L20 12.5M4 16.5L12 21L20 16.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
}
