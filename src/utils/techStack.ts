import type { ProjectItem } from '../types/portfolio';

export type TechCategory =
  | 'frontend'
  | 'styling'
  | 'backend'
  | 'language'
  | 'mobile'
  | 'ai'
  | 'graphics'
  | 'platform';

export type TechIconId =
  | 'react'
  | 'nextjs'
  | 'typescript'
  | 'javascript'
  | 'firebase'
  | 'tailwind'
  | 'vercel'
  | 'pwa'
  | 'nodejs'
  | 'python'
  | 'threejs'
  | 'formula'
  | 'bilingual'
  | 'ecommerce'
  | 'code'
  | 'database'
  | 'server'
  | 'mobile'
  | 'ai'
  | 'cube'
  | 'cloud'
  | 'globe'
  | 'layers';

export interface TechBadgeDescriptor {
  label: string;
  normalizedKey: string;
  category: TechCategory;
  categoryLabelEn: string;
  categoryLabelBn: string;
  iconId: TechIconId;
  accentHex: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  dotClass: string;
  isRecognized: boolean;
}

interface TechRule {
  match: RegExp;
  canonicalLabel?: string;
  category: TechCategory;
  iconId: TechIconId;
  accentHex: string;
  borderClass: string;
  bgClass: string;
  textClass: string;
  dotClass: string;
}

const CATEGORY_LABELS: Record<TechCategory, { en: string; bn: string }> = {
  frontend: { en: 'Frontend', bn: 'ফ্রন্টএন্ড' },
  styling: { en: 'Styling', bn: 'স্টাইলিং' },
  backend: { en: 'Backend & Cloud', bn: 'ব্যাকএন্ড ও ক্লাউড' },
  language: { en: 'Language', bn: 'প্রোগ্রামিং' },
  mobile: { en: 'Mobile & PWA', bn: 'মোবাইল ও PWA' },
  ai: { en: 'AI & Smart', bn: 'এআই ও স্মার্ট' },
  graphics: { en: '3D & Design', bn: '৩ডি ও ডিজাইন' },
  platform: { en: 'Platform', bn: 'প্ল্যাটফর্ম' },
};

const TECH_RULES: TechRule[] = [
  {
    match: /^(react(\.?js)?|react\s+native)$/i,
    category: 'frontend',
    iconId: 'react',
    accentHex: '#38BDF8',
    borderClass: 'border-sky-400/35 hover:border-sky-300/70',
    bgClass: 'bg-sky-500/10',
    textClass: 'text-sky-200',
    dotClass: 'bg-sky-400',
  },
  {
    match: /^next(\.?js)?$/i,
    category: 'frontend',
    iconId: 'nextjs',
    accentHex: '#E5E7EB',
    borderClass: 'border-slate-300/35 hover:border-white/70',
    bgClass: 'bg-white/[0.08]',
    textClass: 'text-slate-100',
    dotClass: 'bg-slate-200',
  },
  {
    match: /^(vite|vue(\.?js)?|angular|svelte|astro|web\s*platform|web\s*app)$/i,
    category: 'frontend',
    iconId: 'globe',
    accentHex: '#00D9FF',
    borderClass: 'border-[#00D9FF]/35 hover:border-[#00D9FF]/70',
    bgClass: 'bg-[#00D9FF]/10',
    textClass: 'text-[#B6F6FF]',
    dotClass: 'bg-[#00D9FF]',
  },
  {
    match: /^(tailwind(\s*css)?|css3?|sass|scss|framer\s*motion|motion)$/i,
    category: 'styling',
    iconId: 'tailwind',
    accentHex: '#22D3EE',
    borderClass: 'border-cyan-400/35 hover:border-cyan-300/70',
    bgClass: 'bg-cyan-500/10',
    textClass: 'text-cyan-200',
    dotClass: 'bg-cyan-400',
  },
  {
    match: /^(firebase(\s*(auth|hosting|studio))?|firestore)$/i,
    category: 'backend',
    iconId: 'firebase',
    accentHex: '#F59E0B',
    borderClass: 'border-amber-400/35 hover:border-amber-300/70',
    bgClass: 'bg-amber-500/10',
    textClass: 'text-amber-200',
    dotClass: 'bg-amber-400',
  },
  {
    match: /^(supabase|postgresql|postgres|mongodb|mysql|sqlite|sql|redis|cloud\s*sync)$/i,
    category: 'backend',
    iconId: 'database',
    accentHex: '#10B981',
    borderClass: 'border-emerald-400/35 hover:border-emerald-300/70',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-200',
    dotClass: 'bg-emerald-400',
  },
  {
    match: /^node(\.?js)?$/i,
    category: 'backend',
    iconId: 'nodejs',
    accentHex: '#34D399',
    borderClass: 'border-emerald-400/35 hover:border-emerald-300/70',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-200',
    dotClass: 'bg-emerald-400',
  },
  {
    match: /^(express(\.?js)?|nest(\.?js)?|graphql|rest\s*api)$/i,
    category: 'backend',
    iconId: 'server',
    accentHex: '#34D399',
    borderClass: 'border-emerald-400/35 hover:border-emerald-300/70',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-200',
    dotClass: 'bg-emerald-400',
  },
  {
    match: /^(typescript|ts)$/i,
    category: 'language',
    iconId: 'typescript',
    accentHex: '#3B82F6',
    borderClass: 'border-blue-400/35 hover:border-blue-300/70',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-200',
    dotClass: 'bg-blue-400',
  },
  {
    match: /^(javascript|js)$/i,
    category: 'language',
    iconId: 'javascript',
    accentHex: '#FACC15',
    borderClass: 'border-yellow-400/35 hover:border-yellow-300/70',
    bgClass: 'bg-yellow-500/10',
    textClass: 'text-yellow-200',
    dotClass: 'bg-yellow-400',
  },
  {
    match: /^python$/i,
    category: 'language',
    iconId: 'python',
    accentHex: '#60A5FA',
    borderClass: 'border-blue-400/35 hover:border-blue-300/70',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-200',
    dotClass: 'bg-blue-400',
  },
  {
    match: /^(java|c|c\+\+|c#|embedded\s*c|go|rust|php|html5?|matlab)$/i,
    category: 'language',
    iconId: 'code',
    accentHex: '#60A5FA',
    borderClass: 'border-blue-400/35 hover:border-blue-300/70',
    bgClass: 'bg-blue-500/10',
    textClass: 'text-blue-200',
    dotClass: 'bg-blue-400',
  },
  {
    match: /^(arduino|iot|plc|esp32|raspberry\s*pi|autocad|solidworks|proteus)$/i,
    category: 'graphics',
    iconId: 'cube',
    accentHex: '#38BDF8',
    borderClass: 'border-sky-400/35 hover:border-sky-300/70',
    bgClass: 'bg-sky-500/10',
    textClass: 'text-sky-200',
    dotClass: 'bg-sky-400',
  },
  {
    match: /^pwa$/i,
    category: 'mobile',
    iconId: 'pwa',
    accentHex: '#2DD4BF',
    borderClass: 'border-teal-400/35 hover:border-teal-300/70',
    bgClass: 'bg-teal-500/10',
    textClass: 'text-teal-200',
    dotClass: 'bg-teal-400',
  },
  {
    match: /^(android|ios|flutter|kotlin|dart|mobile\s*ux|apk)$/i,
    category: 'mobile',
    iconId: 'mobile',
    accentHex: '#2DD4BF',
    borderClass: 'border-teal-400/35 hover:border-teal-300/70',
    bgClass: 'bg-teal-500/10',
    textClass: 'text-teal-200',
    dotClass: 'bg-teal-400',
  },
  {
    match: /formula\s*hub/i,
    category: 'ai',
    iconId: 'formula',
    accentHex: '#C084FC',
    borderClass: 'border-purple-400/40 hover:border-purple-300/80',
    bgClass: 'bg-purple-500/12',
    textClass: 'text-purple-200',
    dotClass: 'bg-purple-400',
  },
  {
    match: /(^ai(\s|$)|gemini|openai|machine\s*learning|ml|llm|tensorflow|pytorch)/i,
    category: 'ai',
    iconId: 'ai',
    accentHex: '#A855F7',
    borderClass: 'border-[#741BFF]/45 hover:border-purple-400/80',
    bgClass: 'bg-[#741BFF]/15',
    textClass: 'text-purple-200',
    dotClass: 'bg-purple-400',
  },
  {
    match: /^(three(\.?js)?|webgl|3d)$/i,
    category: 'graphics',
    iconId: 'threejs',
    accentHex: '#C084FC',
    borderClass: 'border-fuchsia-400/35 hover:border-fuchsia-300/70',
    bgClass: 'bg-fuchsia-500/10',
    textClass: 'text-fuchsia-200',
    dotClass: 'bg-fuchsia-400',
  },
  {
    match: /^(blender|figma|ui\/ux|canvas)$/i,
    category: 'graphics',
    iconId: 'cube',
    accentHex: '#C084FC',
    borderClass: 'border-fuchsia-400/35 hover:border-fuchsia-300/70',
    bgClass: 'bg-fuchsia-500/10',
    textClass: 'text-fuchsia-200',
    dotClass: 'bg-fuchsia-400',
  },
  {
    match: /^vercel$/i,
    category: 'platform',
    iconId: 'vercel',
    accentHex: '#FFFFFF',
    borderClass: 'border-white/30 hover:border-white/70',
    bgClass: 'bg-white/[0.08]',
    textClass: 'text-white',
    dotClass: 'bg-white',
  },
  {
    match: /^bilingual.*$/i,
    category: 'platform',
    iconId: 'bilingual',
    accentHex: '#38BDF8',
    borderClass: 'border-sky-300/35 hover:border-sky-200/70',
    bgClass: 'bg-sky-400/10',
    textClass: 'text-sky-100',
    dotClass: 'bg-sky-300',
  },
  {
    match: /^(e-?commerce|online\s*store|marketplace|shopping\s*cart|cart\s*&\s*wishlist)$/i,
    category: 'platform',
    iconId: 'ecommerce',
    accentHex: '#F472B6',
    borderClass: 'border-pink-400/35 hover:border-pink-300/70',
    bgClass: 'bg-pink-500/10',
    textClass: 'text-pink-200',
    dotClass: 'bg-pink-400',
  },
  {
    match: /^(order\s*tracking|admin\s*console|store\s*admin)$/i,
    category: 'backend',
    iconId: 'server',
    accentHex: '#34D399',
    borderClass: 'border-emerald-400/35 hover:border-emerald-300/70',
    bgClass: 'bg-emerald-500/10',
    textClass: 'text-emerald-200',
    dotClass: 'bg-emerald-400',
  },
  {
    match: /^(dark\/light\s*ui|responsive\s*ui|ui\s*system)$/i,
    category: 'styling',
    iconId: 'tailwind',
    accentHex: '#22D3EE',
    borderClass: 'border-cyan-400/35 hover:border-cyan-300/70',
    bgClass: 'bg-cyan-500/10',
    textClass: 'text-cyan-200',
    dotClass: 'bg-cyan-400',
  },
  {
    match: /^(netlify|github|docker|aws|gcp)$/i,
    category: 'platform',
    iconId: 'cloud',
    accentHex: '#C8C8D8',
    borderClass: 'border-[#C8C8D8]/30 hover:border-white/60',
    bgClass: 'bg-[#C8C8D8]/10',
    textClass: 'text-[#E5E5F2]',
    dotClass: 'bg-[#C8C8D8]',
  },
];

const TEXT_EXTRACTION_DETECTORS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /\breact(\.?js)?\b/i, label: 'React' },
  { pattern: /\bnext(\.?js)?\b/i, label: 'Next.js' },
  { pattern: /\btypescript\b/i, label: 'TypeScript' },
  { pattern: /\bjavascript\b/i, label: 'JavaScript' },
  { pattern: /\btailwind(\s*css)?\b/i, label: 'Tailwind CSS' },
  { pattern: /\bfirebase\b/i, label: 'Firebase' },
  { pattern: /\bfirestore\b/i, label: 'Firestore' },
  { pattern: /\bsupabase\b/i, label: 'Supabase' },
  { pattern: /\bnode(\.?js)?\b/i, label: 'Node.js' },
  { pattern: /\bthree(\.?js)?\b/i, label: 'Three.js' },
  { pattern: /\bpython\b/i, label: 'Python' },
  { pattern: /\bflutter\b/i, label: 'Flutter' },
  { pattern: /\bandroid\b/i, label: 'Android' },
  { pattern: /\bpwa\b/i, label: 'PWA' },
  { pattern: /\b(ai\s*tutor|artificial\s*intelligence|gemini|openai)\b/i, label: 'AI' },
  { pattern: /\.vercel\.app\b|\bvercel\b/i, label: 'Vercel' },
  { pattern: /\bpostgresql\b|\bpostgres\b/i, label: 'PostgreSQL' },
  { pattern: /\bmongodb\b/i, label: 'MongoDB' },
];

export function classifyTechnology(rawLabel: string): TechBadgeDescriptor {
  const label = rawLabel.trim();
  const normalizedKey = label.toLowerCase().replace(/\s+/g, ' ');

  for (const rule of TECH_RULES) {
    if (rule.match.test(label)) {
      const catLabels = CATEGORY_LABELS[rule.category];
      return {
        label: rule.canonicalLabel || label,
        normalizedKey,
        category: rule.category,
        categoryLabelEn: catLabels.en,
        categoryLabelBn: catLabels.bn,
        iconId: rule.iconId,
        accentHex: rule.accentHex,
        borderClass: rule.borderClass,
        bgClass: rule.bgClass,
        textClass: rule.textClass,
        dotClass: rule.dotClass,
        isRecognized: true,
      };
    }
  }

  return {
    label,
    normalizedKey,
    category: 'platform',
    categoryLabelEn: CATEGORY_LABELS.platform.en,
    categoryLabelBn: CATEGORY_LABELS.platform.bn,
    iconId: 'layers',
    accentHex: '#C8C8D8',
    borderClass: 'border-[#C8C8D8]/22 hover:border-[#00D9FF]/50',
    bgClass: 'bg-white/[0.04]',
    textClass: 'text-[#D8D8E6]',
    dotClass: 'bg-[#9CA3AF]',
    isRecognized: false,
  };
}

/**
 * Extracts recognized technology names from a project's text fields and URLs.
 * Used as a smart fallback when explicit project.technologies is empty.
 */
export function extractTechnologiesFromText(text: string, maxItems = 8): string[] {
  const found: string[] = [];
  const seen = new Set<string>();
  for (const detector of TEXT_EXTRACTION_DETECTORS) {
    if (detector.pattern.test(text)) {
      const key = detector.label.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        found.push(detector.label);
        if (found.length >= maxItems) break;
      }
    }
  }
  return found;
}

/**
 * Resolves the complete, deduplicated, auto-highlighted Tech Stack badges for any project.
 * Prioritizes explicit project.technologies; falls back to auto-detection from project metadata if empty.
 */
export function resolveProjectTechStack(
  project: Pick<ProjectItem, 'technologies' | 'titleEn' | 'descriptionEn' | 'liveDemoUrl'>
): TechBadgeDescriptor[] {
  const rawList =
    project.technologies.length > 0
      ? project.technologies
      : extractTechnologiesFromText(
          `${project.titleEn} ${project.descriptionEn} ${project.liveDemoUrl}`
        );

  const deduped: TechBadgeDescriptor[] = [];
  const seen = new Set<string>();

  for (const item of rawList) {
    const cleaned = item.trim();
    if (!cleaned) continue;
    const descriptor = classifyTechnology(cleaned);
    if (!seen.has(descriptor.normalizedKey)) {
      seen.add(descriptor.normalizedKey);
      deduped.push(descriptor);
    }
  }

  return deduped;
}

/**
 * Formats a concise, readable brief description for the ProjectCard hover reveal overlay.
 * Prefers natural sentence boundaries (. ! ? ।) when within maxChars, otherwise trims cleanly on a word boundary.
 */
export function buildBriefProjectDescription(rawDescription: string, maxChars = 175): string {
  const normalized = rawDescription.replace(/\s+/g, ' ').trim();
  if (!normalized) return '';
  if (normalized.length <= maxChars) return normalized;

  const slice = normalized.slice(0, maxChars);
  const sentenceEndMatch = slice.match(/^(.{48,}?[.!?।])(?:\s|$)/);
  if (sentenceEndMatch?.[1]) {
    return sentenceEndMatch[1].trim();
  }

  const lastSpace = slice.lastIndexOf(' ');
  const cutoff = lastSpace >= Math.floor(maxChars * 0.55) ? lastSpace : maxChars;
  const cleaned = slice
    .slice(0, cutoff)
    .replace(/[\s,;:\-—–•·&]+$/u, '')
    .replace(/\s+(?:and|or|with|for|of|to|in|on|a|an|the|&|ও|এবং)$/iu, '')
    .replace(/[\s,;:\-—–•·&]+$/u, '')
    .trim();
  return `${cleaned}…`;
}

/**
 * Filters a list of projects to those matching a selected normalized technology key,
 * checking resolved tech stack badges (both explicit and auto-detected technologies).
 */
export function filterProjectsByTechnology(
  projects: ProjectItem[],
  normalizedTechKey: string | null,
): ProjectItem[] {
  const target = normalizedTechKey?.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!target) return projects;
  return projects.filter((project) =>
    resolveProjectTechStack(project).some((badge) => badge.normalizedKey === target),
  );
}


