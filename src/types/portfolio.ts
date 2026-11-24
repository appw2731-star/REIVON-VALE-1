export type Language = 'en' | 'bn';

export type SkillIconKey =
  | 'code'
  | 'smartphone'
  | 'layout'
  | 'cpu'
  | 'palette'
  | 'globe'
  | 'layers'
  | 'shield';

export type ProjectCategory = 'websites' | 'android' | 'ai' | 'uiux' | 'other';
export type ProjectStatus = 'live' | 'in_progress' | 'concept' | 'archived';
export type GalleryCategory = 'design' | 'development' | '3d' | 'photography' | 'other';
export type SocialPlatform =
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'telegram'
  | 'github'
  | 'linkedin'
  | 'youtube'
  | 'x'
  | 'custom';
export type MessageStatus = 'unread' | 'read' | 'replied';

export interface ProfileData {
  id: string;
  fullName: string;
  fullNameBn: string;
  profileImageUrl: string;
  taglineEn: string;
  taglineBn: string;
  introEn: string;
  introBn: string;
  bioEn: string;
  bioBn: string;
  locationEn: string;
  locationBn: string;
  institutionEn: string;
  institutionBn: string;
  academicYearEn: string;
  academicYearBn: string;
  currentSemesterEn: string;
  currentSemesterBn: string;
  departmentEn: string;
  departmentBn: string;
  interestsEn: string[];
  interestsBn: string[];
  goalsEn: string;
  goalsBn: string;
  updatedAt?: string;
}

export interface SkillItem {
  id: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  iconKey: SkillIconKey;
  focusAreasEn: string[];
  sortOrder: number;
  updatedAt?: string;
}

export interface ProjectItem {
  id: string;
  titleEn: string;
  titleBn: string;
  thumbnailUrl: string;
  descriptionEn: string;
  descriptionBn: string;
  category: ProjectCategory;
  technologies: string[];
  liveDemoUrl: string;
  githubUrl: string;
  status: ProjectStatus;
  featured: boolean;
  isPlaceholder: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryItem {
  id: string;
  titleEn: string;
  titleBn: string;
  captionEn: string;
  captionBn: string;
  imageUrl: string;
  category: GalleryCategory;
  isPlaceholder: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SocialLinkItem {
  id: string;
  platform: SocialPlatform;
  label: string;
  url: string;
  visible: boolean;
  sortOrder: number;
  updatedAt?: string;
}

export interface ContactMessageItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  createdAt?: string;
}

export interface SiteSettingsData {
  id: string;
  brandName: string;
  logoText: string;
  logoImageUrl: string;
  productionUrl: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImageUrl: string;
  footerNoteEn: string;
  footerNoteBn: string;
  updatedAt?: string;
}

export interface PortfolioSnapshot {
  profile: ProfileData;
  skills: SkillItem[];
  projects: ProjectItem[];
  gallery: GalleryItem[];
  socialLinks: SocialLinkItem[];
  siteSettings: SiteSettingsData;
}
