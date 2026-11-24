import { ArrowUp, Lock } from 'lucide-react';
import type { Language, SiteSettingsData } from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';

interface FooterProps {
  lang: Language;
  t: TranslationDictionary;
  siteSettings: SiteSettingsData;
  onOpenAdmin: () => void;
}

export function Footer({ lang, t, siteSettings, onOpenAdmin }: FooterProps) {
  const year = new Date().getFullYear();
  const note = lang === 'bn' ? siteSettings.footerNoteBn : siteSettings.footerNoteEn;

  return (
    <footer className="relative bg-[#06060D] py-10">
      <div aria-hidden="true" className="chrome-divider h-px w-full absolute top-0 inset-x-0" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <svg viewBox="0 0 64 64" fill="none" className="w-7 h-7 shrink-0" aria-hidden="true">
            <rect width="64" height="64" rx="16" fill="#0B0B17" />
            <rect x="2" y="2" width="60" height="60" rx="14" stroke="url(#footerChromeRim)" strokeWidth="2.5" />
            <path d="M15 45V19H29.2C34.5 19 37.8 22.1 37.8 26.8C37.8 30.6 35.6 33.4 31.8 34.3L39.2 45H32.8L26.2 35.1H20.8V45H15ZM20.8 30.4H28.4C30.9 30.4 32.3 29.1 32.3 26.9C32.3 24.7 30.9 23.5 28.4 23.5H20.8V30.4Z" fill="#FFFFFF" />
            <path d="M39.8 19H46.2L50.8 35.4L47.5 45H42.9L39.8 19Z" fill="url(#footerElectricBeam)" />
            <defs>
              <linearGradient id="footerChromeRim" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00D9FF" />
                <stop offset="0.5" stopColor="#C8C8D8" />
                <stop offset="1" stopColor="#741BFF" />
              </linearGradient>
              <linearGradient id="footerElectricBeam" x1="40" y1="19" x2="51" y2="45" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00D9FF" />
                <stop offset="1" stopColor="#741BFF" />
              </linearGradient>
            </defs>
          </svg>
          <p className="text-xs sm:text-sm text-[#C8C8D8]/80">
            © {year} {note}
          </p>
        </div>

        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C8C8D8]/80 hover:text-[#00D9FF] transition-colors whitespace-nowrap shrink-0"
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t.footer.adminPortal}</span>
          </button>

          <a
            href="#top"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C8C8D8]/80 hover:text-[#00D9FF] transition-colors whitespace-nowrap shrink-0"
          >
            <span>{t.footer.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
