import type { Language, ProfileData } from '../types/portfolio';

export interface AcademicIdentityItem {
  key: 'institution' | 'academicYear' | 'department';
  label: string;
  value: string;
}

export interface AcademicIdentityLabels {
  institutionLabel: string;
  academicYearLabel: string;
  departmentLabel: string;
}

/**
 * Merges a remote Firestore profile document with application defaults.
 * Preserves any explicit admin edits while backfilling newly added academic
 * identity fields for legacy documents created before those fields existed.
 */
export function mergeProfileWithDefaults(
  remote: Partial<Omit<ProfileData, 'id'>> | null | undefined,
  defaults: ProfileData,
  updatedAt?: string,
): ProfileData {
  if (!remote) {
    return { ...defaults };
  }

  const hasRemoteAcademicSchema =
    typeof remote.institutionEn === 'string' ||
    typeof remote.institutionBn === 'string' ||
    typeof remote.departmentEn === 'string' ||
    typeof remote.departmentBn === 'string';

  return {
    ...defaults,
    ...remote,
    id: 'main',
    institutionEn:
      typeof remote.institutionEn === 'string' ? remote.institutionEn : defaults.institutionEn,
    institutionBn:
      typeof remote.institutionBn === 'string' ? remote.institutionBn : defaults.institutionBn,
    academicYearEn:
      typeof remote.academicYearEn === 'string' ? remote.academicYearEn : defaults.academicYearEn,
    academicYearBn:
      typeof remote.academicYearBn === 'string' ? remote.academicYearBn : defaults.academicYearBn,
    currentSemesterEn:
      typeof remote.currentSemesterEn === 'string'
        ? remote.currentSemesterEn
        : defaults.currentSemesterEn,
    currentSemesterBn:
      typeof remote.currentSemesterBn === 'string'
        ? remote.currentSemesterBn
        : defaults.currentSemesterBn,
    departmentEn:
      typeof remote.departmentEn === 'string' ? remote.departmentEn : defaults.departmentEn,
    departmentBn:
      typeof remote.departmentBn === 'string' ? remote.departmentBn : defaults.departmentBn,
    locationEn:
      hasRemoteAcademicSchema || (typeof remote.locationEn === 'string' && remote.locationEn.trim().length > 0)
        ? (remote.locationEn ?? '')
        : defaults.locationEn,
    locationBn:
      hasRemoteAcademicSchema || (typeof remote.locationBn === 'string' && remote.locationBn.trim().length > 0)
        ? (remote.locationBn ?? '')
        : defaults.locationBn,
    updatedAt: updatedAt ?? remote.updatedAt,
  };
}

/**
 * Returns non-empty structured academic identity items for the selected language.
 */
export function buildAcademicIdentityItems(
  profile: ProfileData,
  lang: Language,
  labels: AcademicIdentityLabels,
): AcademicIdentityItem[] {
  const institution = (lang === 'bn' ? profile.institutionBn : profile.institutionEn)?.trim() ?? '';
  const academicYear = (lang === 'bn' ? profile.academicYearBn : profile.academicYearEn)?.trim() ?? '';
  const department = (lang === 'bn' ? profile.departmentBn : profile.departmentEn)?.trim() ?? '';

  const items: AcademicIdentityItem[] = [];
  if (institution) {
    items.push({ key: 'institution', label: labels.institutionLabel, value: institution });
  }
  if (academicYear) {
    items.push({ key: 'academicYear', label: labels.academicYearLabel, value: academicYear });
  }
  if (department) {
    items.push({ key: 'department', label: labels.departmentLabel, value: department });
  }
  return items;
}

/**
 * Formats a concise single-line academic summary for the hero identity strip.
 */
export function formatHeroAcademicSummary(
  profile: ProfileData,
  lang: Language,
  departmentPrefix?: string,
): string {
  const institution = (lang === 'bn' ? profile.institutionBn : profile.institutionEn)?.trim() ?? '';
  const academicYear = (lang === 'bn' ? profile.academicYearBn : profile.academicYearEn)?.trim() ?? '';
  const department = (lang === 'bn' ? profile.departmentBn : profile.departmentEn)?.trim() ?? '';

  const parts: string[] = [];
  if (institution) parts.push(institution);
  if (academicYear) parts.push(academicYear);
  if (department) {
    const lowerDept = department.toLowerCase();
    const alreadyLabeled =
      lowerDept.includes('department') ||
      department.includes('ডিপার্টমেন্ট') ||
      (departmentPrefix ? lowerDept.includes(departmentPrefix.toLowerCase()) : false);
    parts.push(departmentPrefix && !alreadyLabeled ? `${departmentPrefix}: ${department}` : department);
  }
  return parts.join(' · ');
}

/**
 * Resolves the active semester label dynamically.
 * Prioritizes explicit admin-configured semester values; if left blank, infers
 * the active Diploma in Engineering semester from the student's academic year.
 */
export function resolveCurrentSemester(
  profile: Pick<
    ProfileData,
    'currentSemesterEn' | 'currentSemesterBn' | 'academicYearEn' | 'academicYearBn'
  >,
  lang: Language,
): string | null {
  const explicit = (lang === 'bn' ? profile.currentSemesterBn : profile.currentSemesterEn)?.trim();
  if (explicit) {
    return explicit;
  }

  const yearSource = `${profile.academicYearEn ?? ''} ${profile.academicYearBn ?? ''}`.trim();
  if (!yearSource) {
    return null;
  }

  const normalized = yearSource.toLowerCase();
  if (normalized.includes('1st') || normalized.includes('first') || yearSource.includes('১ম')) {
    return lang === 'bn' ? '১ম সেমিস্টার' : '1st Semester';
  }
  if (normalized.includes('2nd') || normalized.includes('second') || yearSource.includes('২য়')) {
    return lang === 'bn' ? '৩য় সেমিস্টার' : '3rd Semester';
  }
  if (normalized.includes('3rd') || normalized.includes('third') || yearSource.includes('৩য়')) {
    return lang === 'bn' ? '৫ম সেমিস্টার' : '5th Semester';
  }
  if (normalized.includes('4th') || normalized.includes('fourth') || yearSource.includes('৪র্থ')) {
    return lang === 'bn' ? '৭ম সেমিস্টার' : '7th Semester';
  }

  return lang === 'bn' ? 'চলমান সেমিস্টার' : 'Active Semester';
}
