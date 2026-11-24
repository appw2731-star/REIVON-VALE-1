import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Github, ArrowUpRight, X } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { TiltCard } from './MagneticWrapper';
import { TechStackBadges } from './TechStackBadges';
import { ProjectActivityWidget } from './ProjectActivityWidget';
import { filterProjectsByCategory, isSafeHttpUrl } from '../utils/validators';
import { resolveProjectTechStack } from '../utils/techStack';
import type {
  Language,
  ProfileData,
  ProjectCategory,
  ProjectItem,
  SkillItem,
  SocialLinkItem,
} from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';

interface ProjectsSectionProps {
  lang: Language;
  t: TranslationDictionary;
  projects: ProjectItem[];
  skills: SkillItem[];
  socialLinks: SocialLinkItem[];
  profile: ProfileData;
}

const CATEGORIES: Array<ProjectCategory | 'all'> = [
  'all',
  'websites',
  'ai',
  'android',
  'uiux',
  'other',
];

export function ProjectsSection({
  lang,
  t,
  projects,
  skills,
  socialLinks,
  profile,
}: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const publishedProjects = projects.filter((project) => !project.isPlaceholder);
  const visibleProjects = filterProjectsByCategory(publishedProjects, selectedCategory);

  useEffect(() => {
    if (!activeProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProject]);

  return (
    <section id="projects" className="relative scroll-mt-16 py-20 sm:py-28">
      <div aria-hidden="true" className="chrome-divider h-px w-full absolute top-0 inset-x-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-7 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#00D9FF] mb-2.5">
              {t.projects.sectionLabel}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-chrome tracking-tight">
              {t.projects.heading}
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-[#C8C8D8] leading-relaxed">
              {t.projects.subtitle}
            </p>
          </div>

          {/* Single-row Interactive Category Filter */}
          <div className="overflow-x-auto pb-1 -mx-1 px-1">
            <div
              role="tablist"
              aria-label={t.projects.heading}
              className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#101020] border border-[#C8C8D8]/16"
            >
              {CATEGORIES.map((cat) => {
                const label = cat === 'all' ? t.projects.allCategories : t.projects.categories[cat];
                const active = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] ${
                      active
                        ? 'bg-gradient-to-r from-[#741BFF] to-[#267BFF] text-white shadow-[0_6px_20px_-6px_rgba(116,27,255,0.85)]'
                        : 'text-[#C8C8D8]/80 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {visibleProjects.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-sm text-[#C8C8D8]">
            {t.projects.emptyCategory}
          </div>
        ) : (
          <div
            data-testid="projects-grid"
            className={
              visibleProjects.length === 1
                ? 'grid grid-cols-1 gap-7'
                : visibleProjects.length === 2
                  ? 'grid grid-cols-1 md:grid-cols-2 gap-7'
                  : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7'
            }
          >
            {visibleProjects.map((project, idx) => {
              const title = lang === 'bn' ? project.titleBn : project.titleEn;
              const desc = lang === 'bn' ? project.descriptionBn : project.descriptionEn;
              const hasLive = Boolean(project.liveDemoUrl.trim() && isSafeHttpUrl(project.liveDemoUrl));
              const hasGithub = Boolean(project.githubUrl.trim() && isSafeHttpUrl(project.githubUrl));
              const isSpotlight = visibleProjects.length === 1;

              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltCard
                    glowColor="rgba(0, 217, 255, 0.22)"
                    maxTilt={isSpotlight ? 3.5 : 6}
                    className="rounded-3xl h-full"
                  >
                    <article
                      className={`group glass-chrome rounded-3xl overflow-hidden h-full ${
                        isSpotlight ? 'grid grid-cols-1 lg:grid-cols-12' : 'flex flex-col'
                      }`}
                    >
                      <div
                        className={`relative bg-[#0B0B17] overflow-hidden ${
                          isSpotlight
                            ? 'lg:col-span-7 aspect-[16/10] lg:aspect-auto lg:min-h-[380px] border-b lg:border-b-0 lg:border-r border-[#C8C8D8]/12'
                            : 'aspect-[16/11] border-b border-[#C8C8D8]/12'
                        }`}
                      >
                        <SafeImage
                          src={project.thumbnailUrl}
                          alt={title}
                          fallbackTitle={title}
                          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        />
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0B0B17]/80 to-transparent"
                        />
                      </div>

                      <div
                        className={`p-6 sm:p-8 flex flex-col flex-1 ${
                          isSpotlight ? 'lg:col-span-5 justify-center' : ''
                        }`}
                      >
                        {/* Unboxed clean metadata row */}
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
                          className={`font-display font-bold text-white leading-snug ${
                            isSpotlight ? 'text-2xl sm:text-3xl text-chrome' : 'text-xl'
                          }`}
                        >
                          {title}
                        </h3>

                        <p
                          className={`mt-3 text-sm sm:text-base text-[#C8C8D8] leading-relaxed ${
                            isSpotlight ? '' : 'line-clamp-3 flex-1'
                          }`}
                        >
                          {desc}
                        </p>

                        <TechStackBadges
                          badges={resolveProjectTechStack(project)}
                          heading={t.projects.techStackLabel}
                          lang={lang}
                          variant="card"
                        />

                        <div className="mt-6 flex flex-wrap items-center gap-3">
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
                            onClick={() => setActiveProject(project)}
                            className={`${
                              hasLive ? 'btn-chrome text-[#C8C8D8] hover:text-white' : 'btn-electric text-white'
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
            })}
          </div>
        )}

        <ProjectActivityWidget
          lang={lang}
          t={t}
          projects={projects}
          skills={skills}
          socialLinks={socialLinks}
          profile={profile}
        />
      </div>

      {/* Accessible Project Detail Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/82"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="max-w-2xl w-full max-h-[90vh] overflow-y-auto glass-chrome rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] bg-[#0B0B17] border-b border-[#C8C8D8]/16">
              <SafeImage
                src={activeProject.thumbnailUrl}
                alt={lang === 'bn' ? activeProject.titleBn : activeProject.titleEn}
                fallbackTitle={activeProject.titleEn}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setActiveProject(null)}
                aria-label={t.projects.closeDetails}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#080810]/90 border border-[#C8C8D8]/30 text-white hover:border-[#00D9FF] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#C8C8D8]/80 mb-2">
                <span className="text-[#00D9FF] font-semibold">
                  {t.projects.categories[activeProject.category]}
                </span>
                <span aria-hidden="true">·</span>
                <span>{t.projects.statuses[activeProject.status]}</span>
                {activeProject.featured && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-[#B68DFF]">{t.projects.featuredLabel}</span>
                  </>
                )}
              </div>

              <h3 id="project-modal-title" className="font-display text-2xl font-extrabold text-chrome">
                {lang === 'bn' ? activeProject.titleBn : activeProject.titleEn}
              </h3>

              <p className="mt-4 text-sm sm:text-base text-[#C8C8D8] leading-relaxed whitespace-pre-line">
                {lang === 'bn' ? activeProject.descriptionBn : activeProject.descriptionEn}
              </p>

              <TechStackBadges
                badges={resolveProjectTechStack(activeProject)}
                heading={t.projects.techStackLabel}
                lang={lang}
                variant="modal"
              />

              <div className="mt-6 flex flex-wrap items-center gap-3">
                {activeProject.liveDemoUrl.trim() && isSafeHttpUrl(activeProject.liveDemoUrl) && (
                  <a
                    href={activeProject.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-electric inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  >
                    <ExternalLink className="w-4 h-4" aria-hidden="true" />
                    <span>{t.projects.liveDemo}</span>
                  </a>
                )}
                {activeProject.githubUrl.trim() && isSafeHttpUrl(activeProject.githubUrl) && (
                  <a
                    href={activeProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-chrome inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  >
                    <Github className="w-4 h-4 text-[#00D9FF]" aria-hidden="true" />
                    <span>{t.projects.github}</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
