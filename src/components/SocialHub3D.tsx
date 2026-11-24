import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { SocialIcon } from './SocialIcons';
import { TiltCard } from './MagneticWrapper';
import { extractSocialHandle, isSafeHttpUrl } from '../utils/validators';
import type { SocialLinkItem, SocialPlatform } from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';

interface SocialHub3DProps {
  t: TranslationDictionary;
  socialLinks: SocialLinkItem[];
}

interface PlatformVisualTheme {
  glowRgba: string;
  ringGradient: string;
  accentText: string;
  ambientGlow: string;
}

const PLATFORM_THEMES: Record<SocialPlatform, PlatformVisualTheme> = {
  facebook: {
    glowRgba: 'rgba(24, 119, 242, 0.30)',
    ringGradient: 'from-[#2AA4FF] via-[#C8C8D8]/70 to-[#1877F2]',
    accentText: 'text-[#60B3FF]',
    ambientGlow: 'bg-[#1877F2]/25',
  },
  instagram: {
    glowRgba: 'rgba(221, 42, 123, 0.30)',
    ringGradient: 'from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
    accentText: 'text-[#FF8EC4]',
    ambientGlow: 'bg-[#DD2A7B]/25',
  },
  tiktok: {
    glowRgba: 'rgba(37, 244, 238, 0.26)',
    ringGradient: 'from-[#25F4EE] via-[#C8C8D8]/70 to-[#FE2C55]',
    accentText: 'text-[#5CF7F2]',
    ambientGlow: 'bg-[#25F4EE]/20',
  },
  telegram: {
    glowRgba: 'rgba(38, 165, 228, 0.30)',
    ringGradient: 'from-[#37AEE2] via-[#C8C8D8]/70 to-[#00D9FF]',
    accentText: 'text-[#5FD4FF]',
    ambientGlow: 'bg-[#26A5E4]/25',
  },
  github: {
    glowRgba: 'rgba(200, 200, 216, 0.25)',
    ringGradient: 'from-[#FFFFFF] via-[#C8C8D8] to-[#741BFF]',
    accentText: 'text-[#C8C8D8]',
    ambientGlow: 'bg-[#C8C8D8]/15',
  },
  linkedin: {
    glowRgba: 'rgba(10, 102, 194, 0.28)',
    ringGradient: 'from-[#38BDF8] via-[#C8C8D8]/60 to-[#0A66C2]',
    accentText: 'text-sky-300',
    ambientGlow: 'bg-sky-500/20',
  },
  youtube: {
    glowRgba: 'rgba(255, 0, 51, 0.28)',
    ringGradient: 'from-[#FF4D6D] via-[#C8C8D8]/60 to-[#FF0033]',
    accentText: 'text-rose-300',
    ambientGlow: 'bg-rose-500/20',
  },
  x: {
    glowRgba: 'rgba(200, 200, 216, 0.24)',
    ringGradient: 'from-[#FFFFFF] via-[#C8C8D8] to-[#741BFF]',
    accentText: 'text-[#C8C8D8]',
    ambientGlow: 'bg-white/15',
  },
  custom: {
    glowRgba: 'rgba(116, 27, 255, 0.28)',
    ringGradient: 'from-[#741BFF] via-[#C8C8D8]/70 to-[#00D9FF]',
    accentText: 'text-[#00D9FF]',
    ambientGlow: 'bg-[#741BFF]/25',
  },
};

export function SocialHub3D({ t, socialLinks }: SocialHub3DProps) {
  const visibleSocials = [...socialLinks]
    .filter((s) => s.visible && isSafeHttpUrl(s.url))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  if (visibleSocials.length === 0) return null;

  return (
    <section
      id="social-hub"
      data-testid="social-3d-hub"
      className="relative scroll-mt-16 py-20 sm:py-28 overflow-hidden"
    >
      <div aria-hidden="true" className="chrome-divider h-px w-full absolute top-0 inset-x-0" />

      {/* Subtle Nebula Glow Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_25%,rgba(116,27,255,0.16),transparent_52%),radial-gradient(ellipse_at_80%_75%,rgba(0,217,255,0.13),transparent_50%)]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12 sm:mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#00D9FF] mb-2.5">
            {t.socialHub.sectionLabel}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-chrome tracking-tight">
            {t.socialHub.heading}
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[#C8C8D8] leading-relaxed">
            {t.socialHub.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleSocials.map((social, idx) => {
            const theme = PLATFORM_THEMES[social.platform] || PLATFORM_THEMES.custom;
            const handle = extractSocialHandle(social.url, social.label);
            const note = t.socialHub.platformNotes[social.platform] || t.socialHub.openProfile;

            return (
              <motion.div
                key={social.id}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltCard glowColor={theme.glowRgba} maxTilt={9} className="rounded-3xl h-full">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${social.label} — ${handle}`}
                    className="group relative flex flex-col items-center text-center h-full glass-chrome rounded-3xl p-7 sm:p-8 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] transition-colors hover:border-[#00D9FF]/45"
                  >
                    {/* Soft Platform Neon Under-Glow */}
                    <div
                      aria-hidden="true"
                      className={`pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-36 h-36 rounded-full blur-3xl opacity-55 group-hover:opacity-95 transition-opacity duration-300 ${theme.ambientGlow}`}
                    />

                    {/* Floating 3D Glass & Metallic Medallion */}
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{
                        duration: 4.2 + idx * 0.45,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      style={{ transform: 'translateZ(26px)' }}
                      className="relative mb-6"
                    >
                      <div
                        className={`w-24 h-24 rounded-[26px] p-[1.5px] bg-gradient-to-br ${theme.ringGradient} shadow-[0_18px_38px_-12px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300`}
                      >
                        <div className="relative w-full h-full rounded-[24.5px] bg-gradient-to-b from-[#17172C] to-[#0B0B17] flex items-center justify-center overflow-hidden">
                          {/* Specular Top Glass Reflection */}
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-x-2 top-1 h-8 rounded-full bg-gradient-to-b from-white/22 to-transparent"
                          />
                          <SocialIcon
                            platform={social.platform}
                            brandColored
                            className="w-12 h-12 drop-shadow-[0_6px_14px_rgba(0,0,0,0.55)] relative z-10"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Platform Title & Handle */}
                    <h3
                      style={{ transform: 'translateZ(18px)' }}
                      className="font-display text-xl font-bold text-white tracking-tight"
                    >
                      {social.label}
                    </h3>

                    <p
                      style={{ transform: 'translateZ(14px)' }}
                      className={`mt-1 text-xs font-mono-tabular font-medium ${theme.accentText}`}
                    >
                      {handle}
                    </p>

                    <p className="mt-3 text-xs text-[#C8C8D8]/80 leading-relaxed flex-1">
                      {note}
                    </p>

                    <div className="mt-6 pt-4 w-full border-t border-white/10 flex items-center justify-center gap-1.5 text-xs font-semibold text-white/90 group-hover:text-[#00D9FF] transition-colors">
                      <span>{t.socialHub.openProfile}</span>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </div>
                  </a>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
