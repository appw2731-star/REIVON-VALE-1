import { useState, type MouseEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Mail, ArrowDown, GraduationCap } from 'lucide-react';
import { HeroCanvas3D } from './HeroCanvas3D';
import { SafeImage } from './SafeImage';
import { Magnetic } from './MagneticWrapper';
import { SocialIcon } from './SocialIcons';
import type { Language, ProfileData, SiteSettingsData, SocialLinkItem } from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';
import { isSafeHttpUrl } from '../utils/validators';
import { formatHeroAcademicSummary } from '../utils/profileIdentity';

interface HeroSectionProps {
  lang: Language;
  t: TranslationDictionary;
  profile: ProfileData;
  siteSettings: SiteSettingsData;
  socialLinks: SocialLinkItem[];
}

export function HeroSection({ lang, t, profile, siteSettings, socialLinks }: HeroSectionProps) {
  const [titleTilt, setTitleTilt] = useState({ rx: 0, ry: 0 });

  const intro = lang === 'bn' ? profile.introBn : profile.introEn;
  const tagline = lang === 'bn' ? profile.taglineBn : profile.taglineEn;
  const displayName = lang === 'bn' ? profile.fullNameBn : profile.fullName;
  const academicSummary = formatHeroAcademicSummary(profile, lang, t.about.departmentLabel);
  const visibleSocials = socialLinks.filter((s) => s.visible && isSafeHttpUrl(s.url));

  const handleHeroPointerMove = (e: MouseEvent<HTMLElement>) => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / Math.max(1, rect.width) - 0.5;
    const ny = (e.clientY - rect.top) / Math.max(1, rect.height) - 0.5;
    setTitleTilt({ rx: -ny * 7, ry: nx * 9 });
  };

  const handleHeroPointerLeave = () => {
    if (titleTilt.rx !== 0 || titleTilt.ry !== 0) {
      setTitleTilt({ rx: 0, ry: 0 });
    }
  };

  return (
    <section
      id="top"
      onMouseMove={handleHeroPointerMove}
      onMouseLeave={handleHeroPointerLeave}
      className="relative min-h-[90vh] pt-28 pb-16 sm:pt-32 sm:pb-24 overflow-hidden flex items-center bg-[#080810]"
    >
      {/* Cinematic Electric Purple + Neon Blue Atmospheric Field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_72%_38%,rgba(116,27,255,0.28),transparent_56%),radial-gradient(ellipse_at_24%_78%,rgba(0,217,255,0.16),transparent_52%),radial-gradient(ellipse_at_50%_0%,rgba(200,200,216,0.08),transparent_42%)]"
      />

      {/* Interactive Three.js 3D Digital Universe */}
      <HeroCanvas3D className="absolute inset-0 w-full h-full opacity-90 lg:opacity-100" />

      {/* Measured contrast scrim (ensures crisp WCAG AA legibility over 3D geometry on mobile & desktop) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#080810]/62 lg:bg-transparent lg:bg-gradient-to-r lg:from-[#080810]/94 lg:via-[#080810]/68 lg:to-transparent"
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Typographic Identity Column */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl p-[1px] bg-gradient-to-br from-[#00D9FF] via-[#C8C8D8]/80 to-[#741BFF] shadow-[0_0_32px_-6px_rgba(116,27,255,0.75)] shrink-0">
                <div className="w-full h-full rounded-[15px] overflow-hidden bg-[#0B0B17]">
                  <SafeImage
                    src={profile.profileImageUrl}
                    alt={displayName}
                    fallbackTitle={siteSettings.brandName}
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold tracking-[0.22em] text-[#00D9FF]">
                  {tagline}
                </p>
                <p className="text-xs sm:text-sm text-[#C8C8D8]/85 mt-0.5">
                  {t.hero.interactiveScene}
                </p>
              </div>
            </motion.div>

            {/* Large Animated 3D Metallic Typography */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
              style={{
                transform: `perspective(1000px) rotateX(${titleTilt.rx.toFixed(2)}deg) rotateY(${titleTilt.ry.toFixed(2)}deg)`,
                transition: 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="will-change-transform"
            >
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5rem] font-extrabold tracking-[0.06em] hero-3d-title leading-[1.02]">
                {siteSettings.brandName}
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="mt-5 font-display text-base sm:text-lg lg:text-xl font-semibold text-white tracking-wide max-w-2xl"
            >
              {t.hero.subtitle}
            </motion.p>

            {academicSummary && (
              <motion.div
                data-testid="hero-academic-identity"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.17, ease: [0.16, 1, 0.3, 1] }}
                className="mt-3.5 inline-flex items-start sm:items-center gap-2.5 px-3.5 py-2 rounded-xl bg-[#0E0E1D]/85 border border-[#00D9FF]/24 text-xs sm:text-sm font-medium text-[#E5E8F5] max-w-2xl"
              >
                <GraduationCap
                  className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5 sm:mt-0"
                  aria-hidden="true"
                />
                <span className="leading-snug">{academicSummary}</span>
              </motion.div>
            )}

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-sm sm:text-base text-[#C8C8D8] leading-relaxed max-w-xl"
            >
              {intro}
            </motion.p>

            {/* Magnetic Primary & Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Magnetic>
                <a
                  href="#projects"
                  className="btn-electric inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                >
                  <span>{t.hero.exploreWork}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </a>
              </Magnetic>

              <Magnetic>
                <a
                  href="#contact"
                  className="btn-chrome inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                >
                  <Mail className="w-4 h-4 text-[#00D9FF]" aria-hidden="true" />
                  <span>{t.hero.contactMe}</span>
                </a>
              </Magnetic>
            </motion.div>

            {/* Quick Official Social Icons Row */}
            {visibleSocials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                {visibleSocials.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#101020]/90 hover:bg-[#171730] border border-[#C8C8D8]/16 hover:border-[#00D9FF]/45 text-[#C8C8D8] hover:text-white text-xs font-medium transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                  >
                    <SocialIcon platform={social.platform} brandColored className="w-4 h-4" />
                    <span>{social.label}</span>
                  </a>
                ))}
              </motion.div>
            )}
          </div>

          {/* Right Spatial Breathing Column letting the 3D Devices shine unobstructed */}
          <div className="lg:col-span-5 hidden lg:block min-h-[400px]" aria-hidden="true" />
        </div>
      </div>

      {/* Bottom-center scroll cue clear of 3D devices */}
      <a
        href="#social-hub"
        className="hidden lg:inline-flex items-center gap-2 absolute bottom-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-[#0B0B17]/80 border border-[#C8C8D8]/16 text-xs font-semibold tracking-wider text-[#C8C8D8] hover:text-[#00D9FF] hover:border-[#00D9FF]/45 transition-colors"
      >
        <span>{t.hero.scrollCue}</span>
        <ArrowDown className="w-3.5 h-3.5 text-[#00D9FF]" aria-hidden="true" />
      </a>
    </section>
  );
}
