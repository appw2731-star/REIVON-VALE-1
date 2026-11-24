import {
  Atom,
  Flame,
  Wind,
  Code2,
  Database,
  Server,
  Smartphone,
  Sparkles,
  Box,
  Cloud,
  Globe,
  Layers,
  Cpu,
} from 'lucide-react';
import type { Language } from '../types/portfolio';
import type { TechBadgeDescriptor, TechIconId } from '../utils/techStack';

interface TechStackBadgesProps {
  badges: TechBadgeDescriptor[];
  heading: string;
  lang?: Language;
  variant?: 'card' | 'modal' | 'preview';
}

function TechMicroIcon({ iconId, className }: { iconId: TechIconId; className?: string }) {
  const cls = className || 'w-3.5 h-3.5 shrink-0';
  switch (iconId) {
    case 'react':
      return <Atom className={cls} aria-hidden="true" />;
    case 'firebase':
      return <Flame className={cls} aria-hidden="true" />;
    case 'tailwind':
      return <Wind className={cls} aria-hidden="true" />;
    case 'code':
      return <Code2 className={cls} aria-hidden="true" />;
    case 'database':
      return <Database className={cls} aria-hidden="true" />;
    case 'server':
      return <Server className={cls} aria-hidden="true" />;
    case 'mobile':
      return <Smartphone className={cls} aria-hidden="true" />;
    case 'ai':
      return <Sparkles className={cls} aria-hidden="true" />;
    case 'cube':
      return <Box className={cls} aria-hidden="true" />;
    case 'cloud':
      return <Cloud className={cls} aria-hidden="true" />;
    case 'globe':
      return <Globe className={cls} aria-hidden="true" />;
    default:
      return <Layers className={cls} aria-hidden="true" />;
  }
}

export function TechStackBadges({
  badges,
  heading,
  lang = 'en',
  variant = 'card',
}: TechStackBadgesProps) {
  if (badges.length === 0) return null;

  const isModal = variant === 'modal';
  const isPreview = variant === 'preview';

  return (
    <div
      data-testid={isModal ? 'project-modal-tech-stack' : 'project-tech-stack'}
      className={
        isPreview
          ? 'pt-2'
          : isModal
            ? 'mt-6 pt-5 border-t border-[#C8C8D8]/14'
            : 'mt-5 pt-4 border-t border-[#C8C8D8]/12'
      }
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-[#00D9FF]">
          <Cpu className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{heading}</span>
        </div>
        <span className="text-[11px] font-mono-tabular text-[#C8C8D8]/65">
          {badges.length}
        </span>
      </div>

      <ul
        role="list"
        aria-label={heading}
        className="flex flex-wrap items-center gap-2"
      >
        {badges.map((badge) => {
          const categoryLabel = lang === 'bn' ? badge.categoryLabelBn : badge.categoryLabelEn;
          return (
            <li
              key={badge.normalizedKey}
              title={`${badge.label} — ${categoryLabel}`}
              className={`inline-flex items-center gap-1.5 rounded-lg border transition-all duration-200 ${badge.bgClass} ${badge.borderClass} ${badge.textClass} ${
                isModal ? 'px-3 py-1.5 text-xs' : 'px-2.5 py-1 text-[11px] sm:text-xs'
              }`}
            >
              <TechMicroIcon
                iconId={badge.iconId}
                className={isModal ? 'w-3.5 h-3.5 shrink-0 opacity-95' : 'w-3 h-3 shrink-0 opacity-95'}
              />
              <span className="font-medium font-mono-tabular leading-none">{badge.label}</span>
              {isModal && badge.isRecognized && (
                <span className="ml-1 pl-1.5 border-l border-current/20 text-[10px] opacity-75 font-sans leading-none">
                  {categoryLabel}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
