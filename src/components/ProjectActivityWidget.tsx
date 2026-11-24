import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Activity,
  CalendarCheck,
  ExternalLink,
  Flame,
  GitBranch,
  Github,
  Layers,
  Rocket,
} from 'lucide-react';
import {
  aggregateGitHubEventsByDate,
  buildAcademicBuildActivityMap,
  buildHeatmapGrid,
  computePortfolioContributorStats,
  extractGitHubUsername,
  type GitHubEventLite,
  type GitHubProfileStats,
  type HeatmapCell,
} from '../utils/githubActivity';
import type {
  Language,
  ProfileData,
  ProjectItem,
  SkillItem,
  SocialLinkItem,
} from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';

interface ProjectActivityWidgetProps {
  lang: Language;
  t: TranslationDictionary;
  projects: ProjectItem[];
  skills: SkillItem[];
  socialLinks: SocialLinkItem[];
  profile: ProfileData;
}

const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_BN = ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রি', 'মে', 'জুন', 'জুলা', 'আগ', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'];

const WEEKDAYS_EN = ['', 'Mon', '', 'Wed', '', 'Fri', ''];
const WEEKDAYS_BN = ['', 'সোম', '', 'বুধ', '', 'শুক্র', ''];

const LEVEL_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: 'bg-[#111326] border-[#C8C8D8]/10 hover:border-[#C8C8D8]/35',
  1: 'bg-[#741BFF]/35 border-[#741BFF]/50 hover:border-[#A87BFF]',
  2: 'bg-[#741BFF]/70 border-[#9B62FF]/70 hover:border-[#C5A3FF]',
  3: 'bg-[#00A8E8]/80 border-[#00D9FF]/70 hover:border-[#9AF0FF]',
  4: 'bg-[#00D9FF] border-[#B8F6FF]/90 shadow-[0_0_10px_rgba(0,217,255,0.55)] hover:brightness-110',
};

function formatDisplayDate(dateKey: string, lang: Language): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  if (!y || !m || !d) return dateKey;
  const monthName = (lang === 'bn' ? MONTHS_BN : MONTHS_EN)[m - 1] ?? String(m);
  return `${monthName} ${d}, ${y}`;
}

export function ProjectActivityWidget({
  lang,
  t,
  projects,
  skills,
  socialLinks,
  profile,
}: ProjectActivityWidgetProps) {
  const act = t.projects.activity;
  const githubUsername = useMemo(
    () => extractGitHubUsername(socialLinks, projects),
    [socialLinks, projects],
  );

  const [githubProfile, setGithubProfile] = useState<GitHubProfileStats | null>(null);
  const [githubActivityMap, setGithubActivityMap] = useState<Record<string, number> | null>(null);
  const [selectedCell, setSelectedCell] = useState<HeatmapCell | null>(null);

  useEffect(() => {
    if (!githubUsername) {
      setGithubProfile(null);
      setGithubActivityMap(null);
      return;
    }

    const controller = new AbortController();
    const fetchLiveGitHub = async () => {
      try {
        const [userRes, eventsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${encodeURIComponent(githubUsername)}`, {
            signal: controller.signal,
            headers: { Accept: 'application/vnd.github+json' },
          }),
          fetch(
            `https://api.github.com/users/${encodeURIComponent(githubUsername)}/events/public?per_page=100`,
            {
              signal: controller.signal,
              headers: { Accept: 'application/vnd.github+json' },
            },
          ),
        ]);

        if (!userRes.ok) return;
        const userJson = (await userRes.json()) as {
          login?: string;
          html_url?: string;
          public_repos?: number;
          followers?: number;
          avatar_url?: string;
        };

        if (controller.signal.aborted) return;

        setGithubProfile({
          username: userJson.login || githubUsername,
          profileUrl: userJson.html_url || `https://github.com/${githubUsername}`,
          publicRepos: Number(userJson.public_repos) || 0,
          followers: Number(userJson.followers) || 0,
          avatarUrl: userJson.avatar_url,
        });

        if (eventsRes.ok) {
          const eventsJson = (await eventsRes.json()) as GitHubEventLite[];
          if (!controller.signal.aborted && Array.isArray(eventsJson)) {
            setGithubActivityMap(aggregateGitHubEventsByDate(eventsJson));
          }
        }
      } catch {
        // Silent graceful fallback to portfolio/academic build metrics when offline or rate-limited
      }
    };

    void fetchLiveGitHub();
    return () => controller.abort();
  }, [githubUsername]);

  const isLiveGitHub = Boolean(githubProfile && githubActivityMap);

  const contributorStats = useMemo(
    () => computePortfolioContributorStats(projects, skills),
    [projects, skills],
  );

  const heatmap = useMemo(() => {
    const sourceMap = isLiveGitHub && githubActivityMap
      ? githubActivityMap
      : buildAcademicBuildActivityMap(projects, new Date(), 36);
    return buildHeatmapGrid(sourceMap, new Date(), 36);
  }, [isLiveGitHub, githubActivityMap, projects]);

  const monthNames = lang === 'bn' ? MONTHS_BN : MONTHS_EN;
  const weekdayNames = lang === 'bn' ? WEEKDAYS_BN : WEEKDAYS_EN;

  const monthByWeek = useMemo(() => {
    const map = new Map<number, string>();
    for (const item of heatmap.monthLabels) {
      map.set(item.weekIndex, monthNames[item.monthIndex] ?? '');
    }
    return map;
  }, [heatmap.monthLabels, monthNames]);

  const institutionLabel = (lang === 'bn' ? profile.institutionBn : profile.institutionEn)?.trim();
  const departmentLabel = (lang === 'bn' ? profile.departmentBn : profile.departmentEn)?.trim();

  const statCards = isLiveGitHub && githubProfile
    ? [
        {
          key: 'repos',
          label: act.statPublicRepos,
          value: String(githubProfile.publicRepos),
          icon: GitBranch,
          accent: 'text-[#00D9FF]',
        },
        {
          key: 'events',
          label: act.statRecentEvents,
          value: String(heatmap.totalCount),
          icon: Activity,
          accent: 'text-[#A87BFF]',
        },
        {
          key: 'days',
          label: act.statActiveDays,
          value: `${heatmap.activeDays}`,
          icon: CalendarCheck,
          accent: 'text-[#00D9FF]',
        },
        {
          key: 'streak',
          label: act.statStreak,
          value: `${heatmap.longestStreak} ${act.daysUnit}`,
          icon: Flame,
          accent: 'text-[#C5A3FF]',
        },
      ]
    : [
        {
          key: 'live',
          label: act.statLiveProjects,
          value: String(contributorStats.liveProjects),
          icon: Rocket,
          accent: 'text-[#00D9FF]',
        },
        {
          key: 'tech',
          label: act.statTechCount,
          value: String(contributorStats.uniqueTechnologies),
          icon: Layers,
          accent: 'text-[#A87BFF]',
        },
        {
          key: 'days',
          label: act.statActiveDays,
          value: String(heatmap.activeDays),
          icon: CalendarCheck,
          accent: 'text-[#00D9FF]',
        },
        {
          key: 'streak',
          label: act.statStreak,
          value: `${heatmap.longestStreak} ${act.daysUnit}`,
          icon: Flame,
          accent: 'text-[#C5A3FF]',
        },
      ];

  const totalTechPercent = contributorStats.topTechnologies.reduce(
    (sum, item) => sum + Math.max(1, item.count),
    0,
  );

  return (
    <motion.section
      data-testid="project-activity-widget"
      aria-labelledby="coding-consistency-heading"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.48, ease: [0.16, 1, 0.3, 1] }}
      className="mt-10 relative overflow-hidden glass-chrome rounded-3xl p-6 sm:p-8"
    >
      {/* Top cyan-to-purple hairline accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-[#741BFF]/80 via-[#00D9FF] to-[#741BFF]/20"
      />

      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-[#C8C8D8]/12">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5 mb-2">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-[#00D9FF]/12 border border-[#00D9FF]/30 text-[#00D9FF]">
              <Github className="w-4 h-4" aria-hidden="true" />
            </span>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#00D9FF]">
              {act.eyebrow}
            </p>
            {institutionLabel && (
              <span className="text-xs text-[#C8C8D8]/70 hidden sm:inline">
                · {institutionLabel}
                {departmentLabel ? ` (${departmentLabel})` : ''}
              </span>
            )}
          </div>
          <h3
            id="coding-consistency-heading"
            className="font-display text-xl sm:text-2xl font-extrabold text-chrome tracking-tight"
          >
            {act.heading}
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-[#C8C8D8]/85 leading-relaxed">
            {isLiveGitHub ? act.subtitleGithub : act.subtitleAcademic}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <span
            data-testid="activity-source-badge"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B0D1D] border border-[#00D9FF]/28 text-xs font-semibold text-[#9AF0FF]"
          >
            <span className="w-2 h-2 rounded-full bg-[#00D9FF] shadow-[0_0_8px_#00D9FF]" aria-hidden="true" />
            <span>{isLiveGitHub ? `${act.githubLiveBadge} (@${githubProfile?.username})` : act.academicModeBadge}</span>
          </span>

          {githubProfile && (
            <a
              href={githubProfile.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-chrome inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white whitespace-nowrap"
            >
              <span>{act.viewGithubProfile}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00D9FF]" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>

      {/* 4-Column Contributor Stats Row */}
      <div
        data-testid="contributor-stats-grid"
        className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3.5"
      >
        {statCards.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.key}
              className="rounded-2xl bg-[#0A0B18]/90 border border-[#C8C8D8]/12 px-4 py-4 flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-3.5"
            >
              <span
                aria-hidden="true"
                className={`inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-[#C8C8D8]/12 shrink-0 ${stat.accent}`}
              >
                <IconComponent className="w-4 h-4" />
              </span>
              <div className="min-w-0">
                <p className="font-mono-tabular text-lg sm:text-2xl font-extrabold text-white leading-tight whitespace-nowrap">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] sm:text-xs font-medium text-[#C8C8D8]/85 leading-snug">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive 20-Week Contribution Activity Heatmap */}
      <div className="mt-6 rounded-2xl bg-[#090A16]/90 border border-[#C8C8D8]/12 p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <p className="text-xs font-semibold tracking-[0.14em] uppercase text-[#C8C8D8]">
            {act.heatmapTitle}
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-[#C8C8D8]/75" aria-hidden="true">
            <span>{act.lessLabel}</span>
            {([0, 1, 2, 3, 4] as const).map((lvl) => (
              <span
                key={lvl}
                className={`w-3 h-3 rounded-[3px] border ${LEVEL_CLASSES[lvl]}`}
              />
            ))}
            <span>{act.moreLabel}</span>
          </div>
        </div>

        <div className="overflow-x-auto pb-2 -mx-1 px-1">
          <div
            data-testid="activity-heatmap-grid"
            className="inline-flex flex-col min-w-max"
          >
            {/* Month Header Row */}
            <div className="flex items-center gap-1.5 pl-9 mb-1.5">
              {heatmap.weeks.map((_, weekIdx) => (
                <span
                  key={`m-${weekIdx}`}
                  className="w-3.5 sm:w-4 text-[10px] font-medium text-[#C8C8D8]/70 leading-none select-none"
                >
                  {monthByWeek.get(weekIdx) ?? ''}
                </span>
              ))}
            </div>

            {/* Matrix Body: Weekday Labels + 20 Week Columns */}
            <div className="flex items-start gap-2">
              <div
                aria-hidden="true"
                className="grid grid-rows-7 gap-1.5 w-7 text-[10px] font-medium text-[#C8C8D8]/65 pt-0.5 select-none"
              >
                {weekdayNames.map((label, idx) => (
                  <span key={idx} className="h-3.5 sm:h-4 flex items-center leading-none">
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex gap-1.5" role="grid" aria-label={act.heatmapTitle}>
                {heatmap.weeks.map((week, weekIdx) => (
                  <div key={`w-${weekIdx}`} className="grid grid-rows-7 gap-1.5" role="row">
                    {week.map((cell) => {
                      const isSelected = selectedCell?.dateKey === cell.dateKey;
                      const formattedDate = formatDisplayDate(cell.dateKey, lang);
                      const activityLabel =
                        cell.count > 0
                          ? `${cell.count} ${isLiveGitHub ? act.eventsUnit : act.sessionsUnit}`
                          : act.noActivityDay;

                      return (
                        <button
                          key={cell.dateKey}
                          type="button"
                          role="gridcell"
                          onMouseEnter={() => setSelectedCell(cell)}
                          onFocus={() => setSelectedCell(cell)}
                          onClick={() => setSelectedCell(cell)}
                          aria-label={`${formattedDate}: ${activityLabel}`}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-[4px] border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] ${
                            LEVEL_CLASSES[cell.level]
                          } ${isSelected ? 'ring-2 ring-white/80 scale-110' : ''}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Day Readout Footer */}
        <div className="mt-3 pt-3 border-t border-[#C8C8D8]/10 flex flex-wrap items-center justify-between gap-2 text-xs">
          <p data-testid="activity-day-readout" className="text-[#E5E8F5] font-medium">
            {selectedCell ? (
              <>
                <span className="text-[#00D9FF] font-mono-tabular">
                  {formatDisplayDate(selectedCell.dateKey, lang)}
                </span>
                <span className="mx-2 text-[#C8C8D8]/40" aria-hidden="true">
                  —
                </span>
                <span>
                  {selectedCell.count > 0
                    ? `${selectedCell.count} ${isLiveGitHub ? act.eventsUnit : act.sessionsUnit}`
                    : act.noActivityDay}
                </span>
              </>
            ) : (
              <span className="text-[#C8C8D8]/75">{act.hoverHint}</span>
            )}
          </p>

          {!isLiveGitHub && (
            <p className="text-[11px] text-[#C8C8D8]/60">{act.connectGithubHint}</p>
          )}
        </div>
      </div>

      {/* Project Tech Stack Footprint Bar */}
      {contributorStats.topTechnologies.length > 0 && (
        <div className="mt-5 pt-5 border-t border-[#C8C8D8]/12">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#C8C8D8]/80">
              {act.techFootprintLabel}
            </p>
            <span className="font-mono-tabular text-[11px] text-[#00D9FF] whitespace-nowrap">
              {contributorStats.uniqueTechnologies} {act.statTechCount}
            </span>
          </div>

          <svg
            viewBox="0 0 100 3"
            preserveAspectRatio="none"
            className="w-full h-2 rounded-full overflow-hidden bg-[#121327]"
            role="img"
            aria-label={act.techFootprintLabel}
          >
            {(() => {
              let offset = 0;
              return contributorStats.topTechnologies.map((item) => {
                const width = totalTechPercent > 0 ? (item.count / totalTechPercent) * 100 : 0;
                const x = offset;
                offset += width;
                return (
                  <rect
                    key={item.label}
                    x={x}
                    y={0}
                    width={Math.max(0.5, width - 0.35)}
                    height={3}
                    fill={item.accentHex}
                  />
                );
              });
            })()}
          </svg>

          <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[#C8C8D8]">
            {contributorStats.topTechnologies.map((item) => (
              <li key={item.label} className="inline-flex items-center gap-1.5">
                <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true" className="shrink-0">
                  <circle cx="4" cy="4" r="4" fill={item.accentHex} />
                </svg>
                <span className="font-medium text-white/90">{item.label}</span>
                <span className="font-mono-tabular text-[11px] text-[#C8C8D8]/65">
                  {item.percent}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.section>
  );
}
