import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  orderBy,
  query,
  Timestamp,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaults';
import { sanitizeText, mergeProjectsWithDefaults } from '../utils/validators';
import { mergeProfileWithDefaults } from '../utils/profileIdentity';
import type {
  PortfolioSnapshot,
  ProfileData,
  SkillItem,
  ProjectItem,
  GalleryItem,
  SocialLinkItem,
  ContactMessageItem,
  SiteSettingsData,
  MessageStatus,
} from '../types/portfolio';

function toIsoString(value: unknown): string | undefined {
  if (value instanceof Timestamp) {
    return value.toDate().toISOString();
  }
  if (typeof value === 'string') return value;
  return undefined;
}

export function createSafeDocId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${Date.now().toString(36)}-${rand}`.replace(/[^a-zA-Z0-9_-]/g, '');
}

export async function fetchPortfolioSnapshot(): Promise<PortfolioSnapshot> {
  try {
    const [
      profileSnap,
      skillsSnap,
      projectsSnap,
      gallerySnap,
      socialSnap,
      settingsSnap,
    ] = await Promise.all([
      getDoc(doc(db, 'profiles', 'main')),
      getDocs(query(collection(db, 'skills'), orderBy('sortOrder', 'asc'))),
      getDocs(query(collection(db, 'projects'), orderBy('sortOrder', 'asc'))),
      getDocs(query(collection(db, 'gallery'), orderBy('sortOrder', 'asc'))),
      getDocs(query(collection(db, 'social_links'), orderBy('sortOrder', 'asc'))),
      getDoc(doc(db, 'site_settings', 'main')),
    ]);

    const profile: ProfileData = profileSnap.exists()
      ? mergeProfileWithDefaults(
          profileSnap.data() as Partial<Omit<ProfileData, 'id'>>,
          DEFAULT_PORTFOLIO_DATA.profile,
          toIsoString(profileSnap.data().updatedAt),
        )
      : DEFAULT_PORTFOLIO_DATA.profile;

    const skills: SkillItem[] = skillsSnap.empty
      ? DEFAULT_PORTFOLIO_DATA.skills
      : skillsSnap.docs.map((d) => ({
          ...(d.data() as Omit<SkillItem, 'id'>),
          id: d.id,
          updatedAt: toIsoString(d.data().updatedAt),
        }));

    const remoteProjects: ProjectItem[] = projectsSnap.docs.map((d) => ({
      ...(d.data() as Omit<ProjectItem, 'id'>),
      id: d.id,
      createdAt: toIsoString(d.data().createdAt),
      updatedAt: toIsoString(d.data().updatedAt),
    }));

    const projects: ProjectItem[] = mergeProjectsWithDefaults(
      remoteProjects,
      DEFAULT_PORTFOLIO_DATA.projects,
    );

    const gallery: GalleryItem[] = gallerySnap.empty
      ? DEFAULT_PORTFOLIO_DATA.gallery
      : gallerySnap.docs.map((d) => ({
          ...(d.data() as Omit<GalleryItem, 'id'>),
          id: d.id,
          createdAt: toIsoString(d.data().createdAt),
          updatedAt: toIsoString(d.data().updatedAt),
        }));

    const socialLinks: SocialLinkItem[] = socialSnap.empty
      ? DEFAULT_PORTFOLIO_DATA.socialLinks
      : socialSnap.docs.map((d) => ({
          ...(d.data() as Omit<SocialLinkItem, 'id'>),
          id: d.id,
          updatedAt: toIsoString(d.data().updatedAt),
        }));

    const siteSettings: SiteSettingsData = settingsSnap.exists()
      ? {
          ...DEFAULT_PORTFOLIO_DATA.siteSettings,
          ...(settingsSnap.data() as Omit<SiteSettingsData, 'id'>),
          id: 'main',
          updatedAt: toIsoString(settingsSnap.data().updatedAt),
        }
      : DEFAULT_PORTFOLIO_DATA.siteSettings;

    return {
      profile,
      skills,
      projects,
      gallery,
      socialLinks,
      siteSettings,
    };
  } catch (error) {
    console.warn('Falling back to default portfolio data:', error);
    return DEFAULT_PORTFOLIO_DATA;
  }
}

export async function saveProfile(profile: Omit<ProfileData, 'id' | 'updatedAt'>): Promise<void> {
  const path = 'profiles/main';
  try {
    await setDoc(doc(db, 'profiles', 'main'), {
      fullName: sanitizeText(profile.fullName, 120) || 'REIVON VALE',
      fullNameBn: sanitizeText(profile.fullNameBn, 120) || 'রেইভন ভেল',
      profileImageUrl: profile.profileImageUrl.slice(0, 900000),
      taglineEn: sanitizeText(profile.taglineEn, 180) || 'Creating Digital Experiences.',
      taglineBn: sanitizeText(profile.taglineBn, 180) || 'ডিজিটাল অভিজ্ঞতা তৈরি করছি।',
      introEn: sanitizeText(profile.introEn, 800) || '-',
      introBn: sanitizeText(profile.introBn, 800) || '-',
      bioEn: sanitizeText(profile.bioEn, 2400) || '-',
      bioBn: sanitizeText(profile.bioBn, 2400) || '-',
      locationEn: sanitizeText(profile.locationEn, 120),
      locationBn: sanitizeText(profile.locationBn, 120),
      institutionEn: sanitizeText(profile.institutionEn, 160),
      institutionBn: sanitizeText(profile.institutionBn, 160),
      academicYearEn: sanitizeText(profile.academicYearEn, 100),
      academicYearBn: sanitizeText(profile.academicYearBn, 100),
      currentSemesterEn: sanitizeText(profile.currentSemesterEn, 100),
      currentSemesterBn: sanitizeText(profile.currentSemesterBn, 100),
      departmentEn: sanitizeText(profile.departmentEn, 100),
      departmentBn: sanitizeText(profile.departmentBn, 100),
      interestsEn: profile.interestsEn.slice(0, 12).map((s) => sanitizeText(s, 80)),
      interestsBn: profile.interestsBn.slice(0, 12).map((s) => sanitizeText(s, 80)),
      goalsEn: sanitizeText(profile.goalsEn, 1200),
      goalsBn: sanitizeText(profile.goalsBn, 1200),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveSkill(skill: SkillItem): Promise<string> {
  const id = skill.id || createSafeDocId('skill');
  const path = `skills/${id}`;
  try {
    await setDoc(doc(db, 'skills', id), {
      titleEn: sanitizeText(skill.titleEn, 100),
      titleBn: sanitizeText(skill.titleBn || skill.titleEn, 100),
      descriptionEn: sanitizeText(skill.descriptionEn, 500),
      descriptionBn: sanitizeText(skill.descriptionBn || skill.descriptionEn, 500),
      iconKey: skill.iconKey,
      focusAreasEn: skill.focusAreasEn.slice(0, 6).map((s) => sanitizeText(s, 80)),
      sortOrder: Math.max(0, Math.min(1000, Number(skill.sortOrder) || 0)),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSkill(id: string): Promise<void> {
  const path = `skills/${id}`;
  try {
    await deleteDoc(doc(db, 'skills', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveProject(project: ProjectItem, isNew: boolean): Promise<string> {
  const id = project.id || createSafeDocId('proj');
  const path = `projects/${id}`;
  const payload = {
    titleEn: sanitizeText(project.titleEn, 140),
    titleBn: sanitizeText(project.titleBn || project.titleEn, 140),
    thumbnailUrl: project.thumbnailUrl.slice(0, 900000),
    descriptionEn: sanitizeText(project.descriptionEn, 1500),
    descriptionBn: sanitizeText(project.descriptionBn || project.descriptionEn, 1500),
    category: project.category,
    technologies: project.technologies.slice(0, 12).map((s) => sanitizeText(s, 80)),
    liveDemoUrl: sanitizeText(project.liveDemoUrl, 500),
    githubUrl: sanitizeText(project.githubUrl, 500),
    status: project.status,
    featured: Boolean(project.featured),
    isPlaceholder: Boolean(project.isPlaceholder),
    sortOrder: Math.max(0, Math.min(1000, Number(project.sortOrder) || 0)),
    updatedAt: serverTimestamp(),
  };

  try {
    const ref = doc(db, 'projects', id);
    if (isNew) {
      await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
    } else {
      const existingSnap = await getDoc(ref);
      if (existingSnap.exists()) {
        await updateDoc(ref, payload);
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
    }
    return id;
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
  }
}

export async function deleteProject(id: string): Promise<void> {
  const path = `projects/${id}`;
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveGalleryItem(item: GalleryItem, isNew: boolean): Promise<string> {
  const id = item.id || createSafeDocId('gal');
  const path = `gallery/${id}`;
  const payload = {
    titleEn: sanitizeText(item.titleEn, 120),
    titleBn: sanitizeText(item.titleBn || item.titleEn, 120),
    captionEn: sanitizeText(item.captionEn, 400),
    captionBn: sanitizeText(item.captionBn || item.captionEn, 400),
    imageUrl: item.imageUrl.slice(0, 900000),
    category: item.category,
    isPlaceholder: Boolean(item.isPlaceholder),
    sortOrder: Math.max(0, Math.min(1000, Number(item.sortOrder) || 0)),
    updatedAt: serverTimestamp(),
  };

  try {
    const ref = doc(db, 'gallery', id);
    if (isNew) {
      await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
    } else {
      const existingSnap = await getDoc(ref);
      if (existingSnap.exists()) {
        await updateDoc(ref, payload);
      } else {
        await setDoc(ref, { ...payload, createdAt: serverTimestamp() });
      }
    }
    return id;
  } catch (error) {
    handleFirestoreError(error, isNew ? OperationType.CREATE : OperationType.UPDATE, path);
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const path = `gallery/${id}`;
  try {
    await deleteDoc(doc(db, 'gallery', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveSocialLink(link: SocialLinkItem): Promise<string> {
  const id = link.id || createSafeDocId('social');
  const path = `social_links/${id}`;
  try {
    await setDoc(doc(db, 'social_links', id), {
      platform: link.platform,
      label: sanitizeText(link.label, 60),
      url: sanitizeText(link.url, 500),
      visible: Boolean(link.visible),
      sortOrder: Math.max(0, Math.min(100, Number(link.sortOrder) || 0)),
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSocialLink(id: string): Promise<void> {
  const path = `social_links/${id}`;
  try {
    await deleteDoc(doc(db, 'social_links', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function submitContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<string> {
  const id = createSafeDocId('msg');
  const path = `contact_messages/${id}`;
  try {
    await setDoc(doc(db, 'contact_messages', id), {
      name: sanitizeText(input.name, 100),
      email: sanitizeText(input.email, 160),
      subject: sanitizeText(input.subject, 180),
      message: sanitizeText(input.message, 3000),
      status: 'unread',
      createdAt: serverTimestamp(),
    });
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function fetchContactMessages(): Promise<ContactMessageItem[]> {
  const path = 'contact_messages';
  try {
    const snap = await getDocs(query(collection(db, path), orderBy('createdAt', 'desc')));
    return snap.docs.map((d) => ({
      ...(d.data() as Omit<ContactMessageItem, 'id'>),
      id: d.id,
      createdAt: toIsoString(d.data().createdAt),
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function updateContactMessageStatus(id: string, status: MessageStatus): Promise<void> {
  const path = `contact_messages/${id}`;
  try {
    await updateDoc(doc(db, 'contact_messages', id), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteContactMessage(id: string): Promise<void> {
  const path = `contact_messages/${id}`;
  try {
    await deleteDoc(doc(db, 'contact_messages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function saveSiteSettings(settings: Omit<SiteSettingsData, 'id' | 'updatedAt'>): Promise<void> {
  const path = 'site_settings/main';
  try {
    await setDoc(doc(db, 'site_settings', 'main'), {
      brandName: sanitizeText(settings.brandName, 80) || 'REIVON VALE',
      logoText: sanitizeText(settings.logoText, 40) || 'REIVON VALE',
      logoImageUrl: settings.logoImageUrl.slice(0, 900000),
      productionUrl: sanitizeText(settings.productionUrl, 300),
      seoTitle: sanitizeText(settings.seoTitle, 120) || 'REIVON VALE — Creating Digital Experiences',
      seoDescription: sanitizeText(settings.seoDescription, 320) || 'Personal portfolio of REIVON VALE.',
      seoKeywords: sanitizeText(settings.seoKeywords, 300),
      ogImageUrl: settings.ogImageUrl.slice(0, 900000),
      footerNoteEn: sanitizeText(settings.footerNoteEn, 240),
      footerNoteBn: sanitizeText(settings.footerNoteBn, 240),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function seedDefaultsToDatabase(): Promise<void> {
  await saveProfile(DEFAULT_PORTFOLIO_DATA.profile);
  await saveSiteSettings(DEFAULT_PORTFOLIO_DATA.siteSettings);
  for (const skill of DEFAULT_PORTFOLIO_DATA.skills) {
    await saveSkill(skill);
  }
  for (const project of DEFAULT_PORTFOLIO_DATA.projects) {
    await saveProject(project, false);
  }
  for (const item of DEFAULT_PORTFOLIO_DATA.gallery) {
    await saveGalleryItem(item, false);
  }
  for (const link of DEFAULT_PORTFOLIO_DATA.socialLinks) {
    await saveSocialLink(link);
  }
}
