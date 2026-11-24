import { useState } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import type { Language, SiteSettingsData } from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';
import { isSafeImageSrc } from '../utils/validators';

interface NavbarProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  t: TranslationDictionary;
  siteSettings: SiteSettingsData;
  onOpenAdmin: () => void;
}

export function Navbar({ lang, onChangeLang, t, siteSettings, onOpenAdmin }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: '#social-hub', label: t.nav.social },
    { href: '#about', label: t.nav.about },
    { href: '#projects', label: t.nav.projects },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#contact', label: t.nav.contact },
  ];

  const hasCustomLogo = Boolean(siteSettings.logoImageUrl && isSafeImageSrc(siteSettings.logoImageUrl));

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-16 bg-[#080810]/92 border-b border-[#C8C8D8]/12">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand mark */}
        <a
          href="#top"
          className="flex items-center gap-2.5 text-white font-display font-bold tracking-[0.16em] text-base sm:text-lg whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] rounded-md"
        >
          {hasCustomLogo ? (
            <img
              src={siteSettings.logoImageUrl}
              alt={siteSettings.brandName}
              referrerPolicy="no-referrer"
              className="w-7 h-7 rounded-lg object-cover border border-[#C8C8D8]/25"
            />
          ) : (
            <svg viewBox="0 0 64 64" fill="none" className="w-8 h-8 shrink-0" aria-hidden="true">
              <rect width="64" height="64" rx="16" fill="#0B0B17" />
              <rect x="2" y="2" width="60" height="60" rx="14" stroke="url(#navChromeRim)" strokeWidth="2.5" />
              <path d="M15 45V19H29.2C34.5 19 37.8 22.1 37.8 26.8C37.8 30.6 35.6 33.4 31.8 34.3L39.2 45H32.8L26.2 35.1H20.8V45H15ZM20.8 30.4H28.4C30.9 30.4 32.3 29.1 32.3 26.9C32.3 24.7 30.9 23.5 28.4 23.5H20.8V30.4Z" fill="#FFFFFF" />
              <path d="M39.8 19H46.2L50.8 35.4L47.5 45H42.9L39.8 19Z" fill="url(#navElectricBeam)" />
              <defs>
                <linearGradient id="navChromeRim" x1="4" y1="4" x2="60" y2="60" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00D9FF" />
                  <stop offset="0.5" stopColor="#C8C8D8" />
                  <stop offset="1" stopColor="#741BFF" />
                </linearGradient>
                <linearGradient id="navElectricBeam" x1="40" y1="19" x2="51" y2="45" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#00D9FF" />
                  <stop offset="1" stopColor="#741BFF" />
                </linearGradient>
              </defs>
            </svg>
          )}
          <span className="text-chrome">{siteSettings.logoText || siteSettings.brandName}</span>
        </a>

        {/* Zone 2: Five concise single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-7">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-[#C8C8D8] hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 hover:after:w-full after:bg-gradient-to-r after:from-[#741BFF] after:to-[#00D9FF] after:transition-all after:duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] rounded"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Language Switcher + Admin Portal Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div
            role="group"
            aria-label="Language switcher"
            className="inline-flex items-center p-0.5 rounded-lg bg-[#111120] border border-[#C8C8D8]/16"
          >
            <button
              type="button"
              onClick={() => onChangeLang('en')}
              aria-pressed={lang === 'en'}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                lang === 'en'
                  ? 'bg-gradient-to-r from-[#741BFF] to-[#3B5BFF] text-white'
                  : 'text-[#C8C8D8]/75 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => onChangeLang('bn')}
              aria-pressed={lang === 'bn'}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                lang === 'bn'
                  ? 'bg-gradient-to-r from-[#741BFF] to-[#3B5BFF] text-white'
                  : 'text-[#C8C8D8]/75 hover:text-white'
              }`}
            >
              বাংলা
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAdmin}
            aria-label={t.nav.admin}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white btn-chrome rounded-lg whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            <Lock className="w-3.5 h-3.5 text-[#00D9FF]" aria-hidden="true" />
            <span>{t.nav.admin}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? t.nav.menuClose : t.nav.menuOpen}
            aria-expanded={mobileOpen}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg bg-[#111122] border border-[#C8C8D8]/20 text-white hover:border-[#00D9FF]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0A0A15] border-b border-[#C8C8D8]/16 px-4 py-4 shadow-2xl">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="px-3.5 py-3.5 rounded-xl text-base font-medium text-[#C8C8D8] hover:bg-[#741BFF]/15 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenAdmin();
              }}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-sm font-semibold text-white btn-electric"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
              <span>{t.nav.admin}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
