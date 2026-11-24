import { motion } from 'motion/react';
import {
  Code2,
  Smartphone,
  Layout,
  Cpu,
  Palette,
  Globe,
  Layers,
  ShieldCheck,
} from 'lucide-react';
import { TiltCard } from './MagneticWrapper';
import type { Language, SkillIconKey, SkillItem } from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';

interface SkillsSectionProps {
  lang: Language;
  t: TranslationDictionary;
  skills: SkillItem[];
}

function SkillIcon({ iconKey }: { iconKey: SkillIconKey }) {
  const cls = 'w-5 h-5 text-[#00D9FF]';
  switch (iconKey) {
    case 'code':
      return <Code2 className={cls} aria-hidden="true" />;
    case 'smartphone':
      return <Smartphone className={cls} aria-hidden="true" />;
    case 'layout':
      return <Layout className={cls} aria-hidden="true" />;
    case 'cpu':
      return <Cpu className={cls} aria-hidden="true" />;
    case 'palette':
      return <Palette className={cls} aria-hidden="true" />;
    case 'globe':
      return <Globe className={cls} aria-hidden="true" />;
    case 'shield':
      return <ShieldCheck className={cls} aria-hidden="true" />;
    default:
      return <Layers className={cls} aria-hidden="true" />;
  }
}

export function SkillsSection({ lang, t, skills }: SkillsSectionProps) {
  const ordered = [...skills].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="skills" className="relative scroll-mt-16 py-20 sm:py-28 bg-[#0A0A16]/70">
      <div aria-hidden="true" className="chrome-divider h-px w-full absolute top-0 inset-x-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#00D9FF] mb-2.5">
            {t.skills.sectionLabel}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-chrome tracking-tight">
            {t.skills.heading}
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[#C8C8D8] leading-relaxed">
            {t.skills.subtitle}
          </p>
        </div>

        {ordered.length === 0 ? (
          <div className="glass-panel rounded-3xl p-10 text-center text-sm text-[#C8C8D8]">
            {t.skills.emptyState}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ordered.map((skill, idx) => {
              const title = lang === 'bn' ? skill.titleBn : skill.titleEn;
              const description = lang === 'bn' ? skill.descriptionBn : skill.descriptionEn;
              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.42, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard
                    glowColor={idx % 2 === 0 ? 'rgba(116, 27, 255, 0.24)' : 'rgba(0, 217, 255, 0.22)'}
                    maxTilt={6}
                    className="rounded-3xl h-full"
                  >
                    <article className="glass-chrome rounded-3xl p-6 sm:p-7 h-full flex flex-col">
                      <div className="w-12 h-12 rounded-2xl p-[1px] bg-gradient-to-br from-[#00D9FF]/60 via-[#C8C8D8]/30 to-[#741BFF]/70 mb-5">
                        <div className="w-full h-full rounded-[15px] bg-[#0B0B17] flex items-center justify-center">
                          <SkillIcon iconKey={skill.iconKey} />
                        </div>
                      </div>

                      <h3 className="font-display text-lg font-bold text-white tracking-tight">
                        {title}
                      </h3>

                      <p className="mt-3 text-sm text-[#C8C8D8] leading-relaxed flex-1">
                        {description}
                      </p>

                      {skill.focusAreasEn.length > 0 && (
                        <div className="mt-5 pt-4 border-t border-[#C8C8D8]/12 text-xs text-[#C8C8D8]/80 font-mono-tabular">
                          {skill.focusAreasEn.map((area, areaIdx) => (
                            <span key={`${area}-${areaIdx}`}>
                              <span>{area}</span>
                              {areaIdx < skill.focusAreasEn.length - 1 && (
                                <span className="mx-2 text-[#741BFF]" aria-hidden="true">
                                  ·
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  </TiltCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
