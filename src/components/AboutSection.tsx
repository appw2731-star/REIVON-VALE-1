import { motion } from 'motion/react';
import { MapPin, Compass, Target, GraduationCap, BookOpen, Zap } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { computeRealPortfolioStats } from '../utils/validators';
import { buildAcademicIdentityItems, resolveCurrentSemester } from '../utils/profileIdentity';
import type { GalleryItem, Language, ProfileData, ProjectItem, SkillItem } from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';

interface AboutSectionProps {
  lang: Language;
  t: TranslationDictionary;
  profile: ProfileData;
  skills: SkillItem[];
  projects: ProjectItem[];
  gallery: GalleryItem[];
}

export function AboutSection({
  lang,
  t,
  profile,
  skills,
  projects,
  gallery,
}: AboutSectionProps) {
  const fullName = lang === 'bn' ? profile.fullNameBn : profile.fullName;
  const intro = lang === 'bn' ? profile.introBn : profile.introEn;
  const bio = lang === 'bn' ? profile.bioBn : profile.bioEn;
  const location = lang === 'bn' ? profile.locationBn : profile.locationEn;
  const interests = lang === 'bn' ? profile.interestsBn : profile.interestsEn;
  const goals = lang === 'bn' ? profile.goalsBn : profile.goalsEn;

  const academicItems = buildAcademicIdentityItems(profile, lang, {
    institutionLabel: t.about.institutionLabel,
    academicYearLabel: t.about.academicYearLabel,
    departmentLabel: t.about.departmentLabel,
  });

  const currentSemester = resolveCurrentSemester(profile, lang);

  // Strictly real statistics — only displayed once the owner publishes real non-placeholder work
  const realStats = computeRealPortfolioStats({
    projects,
    gallery,
    skillsCount: skills.length,
  });

  return (
    <section id="about" className="relative scroll-mt-16 py-20 sm:py-28">
      <div aria-hidden="true" className="chrome-divider h-px w-full absolute top-0 inset-x-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <p className="text-xs font-semibold tracking-[0.2em] text-[#00D9FF] mb-2.5">
            {t.about.sectionLabel}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-chrome tracking-tight">
            {t.about.heading}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Portrait Frame Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col"
          >
            <div className="glass-chrome rounded-3xl overflow-hidden flex-1 flex flex-col">
              <div className="aspect-[4/4] sm:aspect-[4/3] lg:aspect-auto lg:flex-1 relative bg-[#0B0B17]">
                <SafeImage
                  src={profile.profileImageUrl}
                  alt={fullName}
                  fallbackTitle={fullName}
                  className="w-full h-full object-cover"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0A0A14] via-[#0A0A14]/65 to-transparent"
                />
              </div>

              <div className="p-6 sm:p-7 border-t border-[#C8C8D8]/14">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium tracking-wider text-[#00D9FF] mb-1">
                      {t.about.fullNameLabel}
                    </p>
                    <h3 className="font-display text-2xl font-extrabold tracking-[0.06em] text-chrome">
                      {fullName}
                    </h3>
                  </div>

                  {currentSemester && (
                    <div
                      data-testid="current-semester-badge"
                      role="status"
                      aria-label={`${t.about.currentSemesterLabel}: ${currentSemester} — ${t.about.activeLearningLabel}`}
                      className="relative shrink-0"
                    >
                      <div
                        aria-hidden="true"
                        className="semester-glow-aura pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#00D9FF]/45 via-[#741BFF]/45 to-[#00D9FF]/35 blur-md"
                      />
                      <div className="semester-glow-badge relative rounded-2xl px-3.5 py-2 flex items-center gap-2.5">
                        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00D9FF] opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]" />
                        </span>
                        <div className="leading-tight">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9AF0FF]/90">
                            {t.about.currentSemesterLabel}
                          </p>
                          <p className="mt-0.5 font-display text-xs sm:text-sm font-extrabold text-white whitespace-nowrap">
                            {currentSemester}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {academicItems.length > 0 && (
                  <div
                    data-testid="portrait-academic-summary"
                    className="mt-3.5 pt-3.5 border-t border-[#C8C8D8]/12 space-y-1.5"
                  >
                    {academicItems.find((i) => i.key === 'institution') && (
                      <p className="inline-flex items-start gap-2 text-xs sm:text-sm font-semibold text-white leading-snug">
                        <GraduationCap className="w-4 h-4 text-[#00D9FF] shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{academicItems.find((i) => i.key === 'institution')?.value}</span>
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[#C8C8D8]">
                      {academicItems.find((i) => i.key === 'academicYear') && (
                        <span className="font-medium text-[#00D9FF]">
                          {academicItems.find((i) => i.key === 'academicYear')?.value}
                        </span>
                      )}
                      {academicItems.find((i) => i.key === 'academicYear') &&
                        academicItems.find((i) => i.key === 'department') && (
                          <span aria-hidden="true" className="text-[#C8C8D8]/40">
                            ·
                          </span>
                        )}
                      {academicItems.find((i) => i.key === 'department') && (
                        <span className="inline-flex items-center gap-1 font-medium text-[#C5A3FF]">
                          <Zap className="w-3.5 h-3.5 text-[#A87BFF] shrink-0" aria-hidden="true" />
                          <span>{academicItems.find((i) => i.key === 'department')?.value}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {location.trim() && (
                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#C8C8D8]/90">
                    <MapPin className="w-4 h-4 text-[#741BFF] shrink-0" aria-hidden="true" />
                    <span>{location}</span>
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Editorial Bio, Interests & Vision Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            {/* Visually Distinct Key Profile Detail: Academic Status & Major */}
            {academicItems.length > 0 && (
              <div
                data-testid="about-academic-identity"
                className="relative overflow-hidden rounded-3xl border border-[#00D9FF]/32 bg-gradient-to-br from-[#0F132B]/95 via-[#0C0D1E]/95 to-[#160E2A]/95 p-6 sm:p-7 shadow-[0_18px_48px_-20px_rgba(0,217,255,0.28)]"
              >
                {/* Luminous top accent rule */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#00D9FF] via-[#741BFF] to-[#00D9FF]/20"
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full bg-[#741BFF]/16 blur-3xl"
                />

                <div className="relative flex flex-wrap items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#00D9FF]/12 border border-[#00D9FF]/30 text-[#00D9FF]">
                      <GraduationCap className="w-4 h-4" aria-hidden="true" />
                    </span>
                    <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#00D9FF]">
                      {t.about.academicHeading}
                    </h3>
                  </div>

                  {academicItems.find((i) => i.key === 'academicYear') && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00D9FF]/10 border border-[#00D9FF]/30 text-[11px] font-semibold tracking-wide text-[#9AF0FF]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00D9FF]" aria-hidden="true" />
                      {academicItems.find((i) => i.key === 'academicYear')?.value}
                    </span>
                  )}
                </div>

                <dl className="relative grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {academicItems.map((item) => {
                    const isInstitution = item.key === 'institution';
                    const isDepartment = item.key === 'department';
                    const IconComponent = isInstitution
                      ? GraduationCap
                      : item.key === 'academicYear'
                        ? BookOpen
                        : Zap;

                    const cardStyle = isInstitution
                      ? 'sm:col-span-2 bg-[#080B18]/90 border-[#00D9FF]/24'
                      : isDepartment
                        ? 'bg-[#140E29]/85 border-[#741BFF]/35'
                        : 'bg-[#091224]/85 border-[#00D9FF]/20';

                    const iconWrapStyle = isDepartment
                      ? 'bg-[#741BFF]/18 border-[#741BFF]/38 text-[#C5A3FF]'
                      : 'bg-[#00D9FF]/12 border-[#00D9FF]/28 text-[#00D9FF]';

                    return (
                      <div
                        key={item.key}
                        className={`rounded-2xl border px-4 py-4 flex items-start gap-3.5 ${cardStyle}`}
                      >
                        <span
                          aria-hidden="true"
                          className={`inline-flex items-center justify-center w-9 h-9 rounded-xl border shrink-0 mt-0.5 ${iconWrapStyle}`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </span>
                        <div className="min-w-0">
                          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#C8C8D8]/75">
                            {item.label}
                          </dt>
                          <dd
                            className={`mt-1 font-display font-extrabold text-white leading-snug ${
                              isInstitution ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                            }`}
                          >
                            {item.value}
                          </dd>
                        </div>
                      </div>
                    );
                  })}
                </dl>
              </div>
            )}

            <div className="glass-chrome rounded-3xl p-6 sm:p-8">
              <p className="text-base sm:text-lg text-white leading-relaxed font-medium">
                {intro}
              </p>

              <div className="mt-6 pt-6 border-t border-[#C8C8D8]/12">
                <h3 className="text-xs font-semibold tracking-[0.18em] text-[#00D9FF] mb-3">
                  {t.about.biographyLabel}
                </h3>
                <p className="text-sm sm:text-base text-[#C8C8D8] leading-relaxed whitespace-pre-line">
                  {bio}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="glass-panel rounded-3xl p-6 sm:p-7">
                <div className="flex items-center gap-2.5 text-[#00D9FF] mb-3.5">
                  <Compass className="w-4 h-4" aria-hidden="true" />
                  <h3 className="font-display text-base font-bold text-white">
                    {t.about.interestsLabel}
                  </h3>
                </div>
                {interests.length > 0 ? (
                  <p className="text-sm text-[#C8C8D8] leading-7">
                    {interests.map((item, idx) => (
                      <span key={`${item}-${idx}`}>
                        <span>{item}</span>
                        {idx < interests.length - 1 && (
                          <span className="mx-2 text-[#741BFF]" aria-hidden="true">
                            ·
                          </span>
                        )}
                      </span>
                    ))}
                  </p>
                ) : (
                  <p className="text-sm text-[#C8C8D8]/60">—</p>
                )}
              </div>

              <div className="glass-panel rounded-3xl p-6 sm:p-7">
                <div className="flex items-center gap-2.5 text-[#741BFF] mb-3.5">
                  <Target className="w-4 h-4" aria-hidden="true" />
                  <h3 className="font-display text-base font-bold text-white">
                    {t.about.goalsLabel}
                  </h3>
                </div>
                <p className="text-sm text-[#C8C8D8] leading-relaxed">
                  {goals || '—'}
                </p>
              </div>
            </div>

            {/* Real-Data Animated Statistics Row (ONLY rendered when real published works exist) */}
            {realStats.length > 0 && (
              <div
                data-testid="about-real-stats"
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {realStats.map((stat, idx) => (
                  <motion.div
                    key={stat.key}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="glass-panel rounded-2xl p-5"
                  >
                    <p className="font-mono-tabular text-3xl font-extrabold text-chrome">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#C8C8D8]/85">
                      {t.about.statLabels[stat.key]}
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
