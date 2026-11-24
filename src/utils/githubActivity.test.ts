import test from 'node:test';
import assert from 'node:assert/strict';
import {
  aggregateGitHubEventsByDate,
  buildAcademicBuildActivityMap,
  buildHeatmapGrid,
  computePortfolioContributorStats,
  extractGitHubUsername,
} from './githubActivity';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaults';

test('extractGitHubUsername parses valid social or project GitHub URLs and rejects reserved paths', () => {
  assert.equal(
    extractGitHubUsername(
      [
        {
          id: 'gh-1',
          platform: 'github',
          label: 'GitHub',
          url: 'https://github.com/reivon-vale',
          visible: true,
          sortOrder: 1,
        },
      ],
      [],
    ),
    'reivon-vale',
  );

  assert.equal(
    extractGitHubUsername(
      [],
      [
        {
          ...DEFAULT_PORTFOLIO_DATA.projects[0],
          githubUrl: 'https://github.com/rokibdev/polytechnic-hub',
        },
      ],
    ),
    'rokibdev',
  );

  assert.equal(
    extractGitHubUsername(
      [
        {
          id: 'gh-bad',
          platform: 'github',
          label: 'GitHub',
          url: 'https://github.com/explore',
          visible: true,
          sortOrder: 1,
        },
      ],
      [],
    ),
    null,
  );
});

test('aggregateGitHubEventsByDate sums PushEvent commit sizes and contributor actions by UTC date', () => {
  const counts = aggregateGitHubEventsByDate([
    { type: 'PushEvent', created_at: '2026-11-20T10:00:00Z', payload: { size: 3 } },
    { type: 'PullRequestEvent', created_at: '2026-11-20T15:30:00Z' },
    { type: 'PushEvent', created_at: '2026-11-21T08:00:00Z', payload: { commits: [{ sha: 'a' }, { sha: 'b' }] } },
    { type: 'IssuesEvent', created_at: 'not-a-date' },
  ]);

  assert.equal(counts['2026-11-20'], 4);
  assert.equal(counts['2026-11-21'], 2);
  assert.equal(Object.keys(counts).length, 2);
});

test('buildHeatmapGrid builds exact week columns, active day counts, and streak stats', () => {
  const refDate = new Date(Date.UTC(2026, 10, 24)); // 2026-11-24 (Tuesday)
  const map: Record<string, number> = {
    '2026-11-24': 3,
    '2026-11-23': 2,
    '2026-11-22': 1,
    '2026-11-18': 4,
    '2026-11-17': 2,
  };

  const grid = buildHeatmapGrid(map, refDate, 12);
  assert.equal(grid.weeks.length, 12);
  assert.ok(grid.weeks.every((col) => col.length === 7));
  assert.equal(grid.totalCount, 12);
  assert.equal(grid.activeDays, 5);
  assert.equal(grid.currentStreak, 3);
  assert.equal(grid.longestStreak, 3);
  assert.ok(grid.monthLabels.length >= 2);
});

test('computePortfolioContributorStats aggregates real projects, live builds, and tech stack distribution', () => {
  const stats = computePortfolioContributorStats(
    DEFAULT_PORTFOLIO_DATA.projects,
    DEFAULT_PORTFOLIO_DATA.skills,
  );
  assert.equal(stats.publishedProjects, 1);
  assert.equal(stats.liveProjects, 1);
  assert.equal(stats.featuredProjects, 1);
  assert.equal(stats.uniqueTechnologies, 6);
  assert.equal(stats.coreSkills, 6);
  assert.equal(stats.topTechnologies.length, 6);

  const cadence = buildAcademicBuildActivityMap(
    DEFAULT_PORTFOLIO_DATA.projects,
    new Date(Date.UTC(2026, 10, 24)),
    16,
  );
  assert.ok((cadence['2026-11-24'] ?? 0) >= 2);
});
