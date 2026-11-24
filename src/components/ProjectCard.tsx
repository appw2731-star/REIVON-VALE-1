import { Fragment, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, ArrowUpRight, Eye, X } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { TiltCard } from './MagneticWrapper';
import { TechStackIcon } from './TechStackIcon';
import { isSafeHttpUrl } from '../utils/validators';
import { buildBriefProjectDescription, resolveProjectTechStack } from '../utils/techStack';
import type { Language, ProjectItem } from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';

interface ProjectCardProps {
  project: ProjectItem;
  index: number;
  isSpotlight: boolean;
  lang: Language;
  t: TranslationDictionary;
  onSelectProject: (project: ProjectItem) => void;
}

export function ProjectCard({
  project,
  index,
  isSpotlight,
  lang,
  t,
  onSelectProject,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSummaryPinned, setIsSummaryPinned] = useState(false);
  const [activeTechKey, setActiveTechKey] = useState<string | null>(null);

  const title = lang === 'bn' ? project.titleBn : project.titleEn;
  const fullDescription = lang === 'bn' ? project.descriptionBn : project.descriptionEn;
  const briefDescription = buildBriefProjectDescription(
    fullDescription,
    isSpotlight ? 175 : 145
  );
  const hasLive = Boolean(project.liveDemoUrl.trim() && isSafeHttpUrl(project.liveDemoUrl));
  const hasGithub = Boolean(project.githubUrl.trim() && isSafeHttpUrl(project.githubUrl));
  const techBadges = resolveProjectTechStack(project);

  const isBriefRevealed = isHovered || isSummaryPinned;
  const activeTech = techBadges.find((badge) => badge.normalizedKey === activeTechKey) ?? null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
    >
      <TiltCard
        glowColor="rgba(0, 217, 255, 0.22)"
        maxTilt={isSpotlight ? 3.5 : 6}
        className="rounded-3xl h-full"
      >
        <article
          data-testid="project-card"
          data-project-id={project.id}
          data-hovered={isBriefRevealed ? 'true' : 'false'}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setActiveTechKey(null);
          }}
          className={`group glass-chrome rounded-3xl overflow-hidden h-full transition-colors duration-300 ${
            isBriefRevealed ? 'border-[#00D9FF]/40' : ''
          } ${isSpotlight ? 'grid grid-cols-1 lg:grid-cols-12' : 'flex flex-col'}`}
        >
          {/* Media Preview Stage with Animated Hover Brief Description Reveal */}
          <div
            className={`relative bg-[#0B0B17] overflow-hidden ${
              isSpotlight
                ? 'lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[370px] border-b lg:border-b-0 lg:border-r border-[#C8C8D8]/12'
                : 'aspect-[16/11] border-b border-[#C8C8D8]/12'
            }`}
          >
            <SafeImage
              src={project.thumbnailUrl}
              alt={title}
              fallbackTitle={title}
              className={`w-full h-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                isBriefRevealed ? 'scale-[1.045]' : 'scale-100'
              }`}
            />

            {/* Subtle resting vignette */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#080812]/85 via-[#080812]/30 to-transparent"
            />

            {/* Touch & keyboard accessible brief-overview toggle / resting hover cue */}
            {briefDescription && (
              <button
                type="button"
                data-testid="project-card-brief-toggle"
                aria-expanded={isBriefRevealed}
                aria-label={t.projects.toggleSummary}
                onClick={() => setIsSummaryPinned((prev) => !prev)}
                className={`absolute top-3.5 right-3.5 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold backdrop-blur-md border transition-all duration-200 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] ${
                  isSummaryPinned
                    ? 'bg-[#080814]/92 border-[#00D9FF]/60 text-[#00D9FF] opacity-100'
                    : isHovered
                      ? 'bg-[#080814]/75 border-[#C8C8D8]/24 text-[#E6E8F5] opacity-0 pointer-events-none'
                      : 'bg-[#080814]/75 border-[#C8C8D8]/24 text-[#E6E8F5] hover:border-[#00D9FF]/50 hover:text-white opacity-100'
                }`}
              >
                {isSummaryPinned ? (
                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-[#00D9FF]" aria-hidden="true" />
                )}
                <span>
                  {isSummaryPinned ? t.projects.briefSummaryLabel : t.projects.hoverHint}
                </span>
              </button>
            )}

            {/* Animated Hover Brief Description Drawer (compositor-only opacity + transform) */}
            {briefDescription && (
              <div
                data-testid="project-card-hover-brief"
                data-revealed={isBriefRevealed ? 'true' : 'false'}
                className={`pointer-events-none absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 bg-gradient-to-t from-[#06060F]/96 via-[#090917]/92 to-[#090917]/75 backdrop-blur-md border-t border-[#00D9FF]/30 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                  isBriefRevealed
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-5'
                }`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#00D9FF]/80 via-[#741BFF]/70 to-transparent"
                />
                <p className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#00D9FF] mb-1.5">
                  {t.projects.briefSummaryLabel}
                </p>
                <p className="text-xs sm:text-sm text-[#F2F4FA] leading-relaxed">
                  {briefDescription}
                </p>
              </div>
            )}
          </div>

          {/* Card Content Column */}
          <div
            className={`p-6 sm:p-8 flex flex-col flex-1 justify-between ${
              isSpotlight ? 'lg:col-span-5' : ''
            }`}
          >
            <div>
              {/* Clean Unboxed Metadata Row */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#C8C8D8]/75 mb-3">
                <span className="text-[#00D9FF] font-semibold">
                  {t.projects.categories[project.category]}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t.projects.statuses[project.status]}</span>
                {project.featured && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#B68DFF] font-semibold">
                      {t.projects.featuredLabel}
                    </span>
                  </>
                )}
                {project.isPlaceholder && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#C8C8D8]/55">
                      {t.projects.placeholderLabel}
                    </span>
                  </>
                )}
              </div>

              <h3
                className={`font-display font-bold text-white leading-snug text-balance ${
                  isSpotlight ? 'text-2xl sm:text-3xl text-chrome' : 'text-xl'
                }`}
              >
                {title}
              </h3>

              {/* Dynamic SVG Tech Stack Icons Section */}
              {techBadges.length > 0 && (
                <div
                  data-testid="project-card-tech-icons"
                  className="mt-5 pt-4 border-t border-[#C8C8D8]/12"
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-[#00D9FF]">
                      {t.projects.techStackLabel}
                    </span>
                    <span
                      data-testid="project-card-tech-readout"
                      style={activeTech ? { color: activeTech.accentHex } : undefined}
                      className={`text-xs font-mono-tabular truncate max-w-[68%] transition-colors duration-150 ${
                        activeTech ? 'font-semibold' : 'text-[#C8C8D8]/80'
                      }`}
                    >
                      {activeTech
                        ? `${activeTech.label} · ${
                            lang === 'bn'
                              ? activeTech.categoryLabelBn
                              : activeTech.categoryLabelEn
                          }`
                        : `${techBadges.length} ${t.projects.technologiesLabel}`}
                    </span>
                  </div>

                  <ul
                    role="list"
                    aria-label={t.projects.techStackLabel}
                    className="flex flex-wrap items-center gap-2.5"
                  >
                    {techBadges.map((badge) => {
                      const categoryLabel =
                        lang === 'bn' ? badge.categoryLabelBn : badge.categoryLabelEn;
                      const isSelected = activeTechKey === badge.normalizedKey;

                      return (
                        <li key={badge.normalizedKey} className="relative">
                          <button
                            type="button"
                            aria-label={`${badge.label} — ${categoryLabel}`}
                            title={`${badge.label} (${categoryLabel})`}
                            onMouseEnter={() => setActiveTechKey(badge.normalizedKey)}
                            onFocus={() => setActiveTechKey(badge.normalizedKey)}
                            onBlur={() =>
                              setActiveTechKey((prev) =>
                                prev === badge.normalizedKey ? null : prev
                              )
                            }
                            onClick={() =>
                              setActiveTechKey((prev) =>
                                prev === badge.normalizedKey ? null : badge.normalizedKey
                              )
                            }
                            style={{
                              color: badge.accentHex,
                              borderColor: isSelected
                                ? badge.accentHex
                                : `${badge.accentHex}44`,
                              boxShadow: isSelected
                                ? `0 8px 20px -8px ${badge.accentHex}99`
                                : undefined,
                            }}
                            className={`w-10 h-10 rounded-xl bg-[#0F1020]/90 border flex items-center justify-center transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] ${
                              isSelected ? '-translate-y-0.5 scale-105' : 'hover:-translate-y-0.5'
                            }`}
                          >
                            <TechStackIcon
                              iconId={badge.iconId}
                              className="w-[19px] h-[19px] shrink-0"
                            />
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {/* Quiet unboxed technology list synchronized with hovered SVG icon */}
                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#C8C8D8]/70">
                    {techBadges.map((badge, badgeIdx) => {
                      const isHighlighted = activeTechKey === badge.normalizedKey;
                      return (
                        <Fragment key={badge.normalizedKey}>
                          {badgeIdx > 0 && (
                            <span aria-hidden="true" className="text-[#C8C8D8]/35">
                              ·
                            </span>
                          )}
                          <span
                            style={isHighlighted ? { color: badge.accentHex } : undefined}
                            className={`transition-colors duration-150 ${
                              isHighlighted ? 'font-semibold' : ''
                            }`}
                          >
                            {badge.label}
                          </span>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Row */}
            <div className="mt-6 pt-5 border-t border-[#C8C8D8]/10 flex flex-wrap items-center gap-3">
              {hasLive && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-electric inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white whitespace-nowrap shrink-0"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.projects.liveDemo}</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => onSelectProject(project)}
                className={`${
                  hasLive
                    ? 'btn-chrome text-[#C8C8D8] hover:text-white'
                    : 'btn-electric text-white'
                } inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]`}
              >
                <span>{t.projects.viewDetails}</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>

              {hasGithub && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-chrome inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-[#C8C8D8] hover:text-white whitespace-nowrap shrink-0"
                >
                  <Github className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t.projects.github}</span>
                </a>
              )}
            </div>
          </div>
        </article>
      </TiltCard>
    </motion.div>
  );
}
