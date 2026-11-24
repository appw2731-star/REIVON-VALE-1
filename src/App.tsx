import { useCallback, useEffect, useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { InteractiveCursor } from './components/InteractiveCursor';
import { Preloader } from './components/Preloader';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SocialHub3D } from './components/SocialHub3D';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { GallerySection } from './components/GallerySection';
import { QrCodeSection } from './components/QrCodeSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DEFAULT_PORTFOLIO_DATA } from './data/defaults';
import { TRANSLATIONS } from './data/translations';
import { fetchPortfolioSnapshot } from './lib/portfolioService';
import type { Language, PortfolioSnapshot } from './types/portfolio';

const LANG_STORAGE_KEY = 'reivon_vale_language';

function readInitialLanguage(): Language {
  try {
    const saved = window.localStorage.getItem(LANG_STORAGE_KEY);
    if (saved === 'bn' || saved === 'en') return saved;
  } catch {
    // Storage unavailable
  }
  return 'en';
}

function readIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.pathname === '/admin' || window.location.hash === '#/admin';
}

export default function App() {
  const [lang, setLang] = useState<Language>(readInitialLanguage);
  const [isAdminView, setIsAdminView] = useState<boolean>(readIsAdminRoute);
  const [data, setData] = useState<PortfolioSnapshot>(DEFAULT_PORTFOLIO_DATA);

  const refreshPortfolio = useCallback(async () => {
    const snapshot = await fetchPortfolioSnapshot();
    setData(snapshot);
  }, []);

  useEffect(() => {
    void refreshPortfolio();
  }, [refreshPortfolio]);

  useEffect(() => {
    try {
      window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // Storage unavailable
    }
    document.documentElement.lang = lang === 'bn' ? 'bn' : 'en';
  }, [lang]);

  // Sync dynamic SEO title and meta tags with SiteSettings
  useEffect(() => {
    const { seoTitle, seoDescription } = data.siteSettings;
    if (seoTitle) {
      document.title = seoTitle;
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', seoTitle);
    }
    if (seoDescription) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', seoDescription);
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', seoDescription);
    }
  }, [data.siteSettings]);

  useEffect(() => {
    const onPopState = () => setIsAdminView(readIsAdminRoute());
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onPopState);
    };
  }, []);

  const openAdmin = () => {
    window.history.pushState({}, '', '/admin');
    setIsAdminView(true);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const closeAdmin = () => {
    window.history.pushState({}, '', '/');
    setIsAdminView(false);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const t = TRANSLATIONS[lang];

  return (
    <ErrorBoundary>
      <InteractiveCursor />
      {isAdminView ? (
        <AdminDashboard
          t={t}
          data={data}
          onRefreshData={refreshPortfolio}
          onBackToSite={closeAdmin}
        />
      ) : (
        <div className="min-h-screen bg-[#080810] text-white">
          <Preloader
            brandName={data.siteSettings.brandName}
            skipLabel={t.preloader.skipIntro}
            subtitle={t.preloader.subtitle}
          />
          <Navbar
            lang={lang}
            onChangeLang={setLang}
            t={t}
            siteSettings={data.siteSettings}
            onOpenAdmin={openAdmin}
          />
          <main>
            <HeroSection
              lang={lang}
              t={t}
              profile={data.profile}
              siteSettings={data.siteSettings}
              socialLinks={data.socialLinks}
            />
            <SocialHub3D t={t} socialLinks={data.socialLinks} />
            <AboutSection
              lang={lang}
              t={t}
              profile={data.profile}
              skills={data.skills}
              projects={data.projects}
              gallery={data.gallery}
            />
            <SkillsSection lang={lang} t={t} skills={data.skills} />
            <ProjectsSection
              lang={lang}
              t={t}
              projects={data.projects}
              skills={data.skills}
              socialLinks={data.socialLinks}
              profile={data.profile}
            />
            <GallerySection lang={lang} t={t} items={data.gallery} />
            <QrCodeSection t={t} siteSettings={data.siteSettings} />
            <ContactSection t={t} socialLinks={data.socialLinks} />
          </main>
          <Footer
            lang={lang}
            t={t}
            siteSettings={data.siteSettings}
            onOpenAdmin={openAdmin}
          />
        </div>
      )}
    </ErrorBoundary>
  );
}
