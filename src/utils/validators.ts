import type { ProjectCategory, ProjectItem, GalleryCategory, GalleryItem } from '../types/portfolio';

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
  honeypot?: string;
}

export interface ValidationResult<T = Record<string, string>> {
  valid: boolean;
  errors: T;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SAFE_HTTP_URL_PATTERN = /^https?:\/\/.+/i;

export function sanitizeText(value: string, maxLength: number): string {
  return value.trim().slice(0, maxLength);
}

export function isSafeHttpUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return true;
  if (!SAFE_HTTP_URL_PATTERN.test(trimmed)) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
}

export function isSafeImageSrc(src: string): boolean {
  const trimmed = src.trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('/src/assets/') || trimmed.startsWith('/')) return true;
  if (/^data:image\/(jpeg|jpg|png|webp|avif);base64,/i.test(trimmed)) return true;
  return isSafeHttpUrl(trimmed);
}

export function validateContactForm(input: ContactInput): ValidationResult {
  const errors: Record<string, string> = {};

  if (input.honeypot && input.honeypot.trim().length > 0) {
    errors.spam = 'spam_detected';
    return { valid: false, errors };
  }

  const name = input.name.trim();
  const email = input.email.trim();
  const subject = input.subject.trim();
  const message = input.message.trim();

  if (name.length < 2 || name.length > 100) {
    errors.name = 'invalid_name';
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 160) {
    errors.email = 'invalid_email';
  }
  if (subject.length < 2 || subject.length > 180) {
    errors.subject = 'invalid_subject';
  }
  if (message.length < 10 || message.length > 3000) {
    errors.message = 'invalid_message';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateImageUploadFile(file: { type: string; size: number }, maxBytes = 5 * 1024 * 1024): string | null {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
  if (!allowed.includes(file.type)) {
    return 'unsupported_file_type';
  }
  if (file.size <= 0 || file.size > maxBytes) {
    return 'file_too_large';
  }
  return null;
}

export function resolveProductionUrl(configuredUrl: string | undefined, envSiteUrl: string | undefined, runtimeOrigin: string): string {
  const candidate = (configuredUrl || '').trim() || (envSiteUrl || '').trim() || runtimeOrigin.trim();
  if (!candidate) return 'https://reivonvale.vercel.app';
  if (isSafeHttpUrl(candidate)) {
    return candidate.replace(/\/+$/, '');
  }
  return runtimeOrigin.replace(/\/+$/, '') || 'https://reivonvale.vercel.app';
}

export function filterProjectsByCategory(
  projects: ProjectItem[],
  category: ProjectCategory | 'all'
): ProjectItem[] {
  const sorted = [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });
  if (category === 'all') return sorted;
  return sorted.filter((project) => project.category === category);
}

export function filterGalleryByCategory(
  items: GalleryItem[],
  category: GalleryCategory | 'all'
): GalleryItem[] {
  const sorted = [...items].sort((a, b) => a.sortOrder - b.sortOrder);
  if (category === 'all') return sorted;
  return sorted.filter((item) => item.category === category);
}

export function parseTagInput(raw: string, maxItems: number): string[] {
  return raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, maxItems);
}

export function checkSpamCooldown(lastSubmittedAtMs: number | null, nowMs: number, cooldownMs = 20000): boolean {
  if (!lastSubmittedAtMs) return true;
  return nowMs - lastSubmittedAtMs >= cooldownMs;
}

export interface RealPortfolioStat {
  key: 'projects' | 'gallery' | 'skills';
  value: number;
}

/**
 * Computes real, non-fabricated statistics strictly from published (non-placeholder) records.
 * Returns an empty array when no real published projects or gallery uploads exist yet.
 */
export function computeRealPortfolioStats(input: {
  projects: ProjectItem[];
  gallery: GalleryItem[];
  skillsCount: number;
}): RealPortfolioStat[] {
  const realProjects = input.projects.filter((p) => !p.isPlaceholder).length;
  const realGallery = input.gallery.filter((g) => !g.isPlaceholder).length;

  // Only surface animated statistics once the owner has published at least one real project or gallery asset
  if (realProjects === 0 && realGallery === 0) {
    return [];
  }

  const stats: RealPortfolioStat[] = [];
  if (realProjects > 0) {
    stats.push({ key: 'projects', value: realProjects });
  }
  if (realGallery > 0) {
    stats.push({ key: 'gallery', value: realGallery });
  }
  if (input.skillsCount > 0) {
    stats.push({ key: 'skills', value: input.skillsCount });
  }
  return stats;
}

export function extractSocialHandle(url: string, fallbackLabel: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    const path = parsed.pathname.replace(/^\/+|\/+$/g, '');

    if (host.includes('facebook.com')) {
      return 'REIVON VALE Official';
    }
    if (host.includes('instagram.com') && path) {
      return `@${path.split('/')[0]}`;
    }
    if (host.includes('tiktok.com') && path) {
      const segment = path.split('/')[0];
      return segment.startsWith('@') ? segment : `@${segment}`;
    }
    if ((host === 't.me' || host.includes('telegram.me')) && path) {
      return `@${path.split('/')[0]}`;
    }
    return path ? `@${path.split('/')[0]}` : fallbackLabel;
  } catch {
    return fallbackLabel;
  }
}

