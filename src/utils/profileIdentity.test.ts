import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildAcademicIdentityItems,
  formatHeroAcademicSummary,
  mergeProfileWithDefaults,
  resolveCurrentSemester,
} from './profileIdentity';
import { DEFAULT_PORTFOLIO_DATA } from '../data/defaults';

test('mergeProfileWithDefaults backfills academic identity, semester, and location on legacy remote docs', () => {
  const legacyRemote = {
    fullName: 'REIVON VALE',
    fullNameBn: 'রেইভন ভেল',
    locationEn: '',
    locationBn: '',
  };

  const merged = mergeProfileWithDefaults(legacyRemote, DEFAULT_PORTFOLIO_DATA.profile);
  assert.equal(merged.institutionEn, 'Bogra Polytechnic Institute');
  assert.equal(merged.institutionBn, 'বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট');
  assert.equal(merged.academicYearEn, '1st Year Student');
  assert.equal(merged.academicYearBn, '১ম বর্ষের ছাত্র');
  assert.equal(merged.currentSemesterEn, '1st Semester');
  assert.equal(merged.currentSemesterBn, '১ম সেমিস্টার');
  assert.equal(merged.departmentEn, 'Power Department');
  assert.equal(merged.departmentBn, 'পাওয়ার ডিপার্টমেন্ট');
  assert.equal(merged.locationEn, 'Bogra, Bangladesh');
  assert.equal(merged.locationBn, 'বগুড়া, বাংলাদেশ');
});

test('mergeProfileWithDefaults preserves explicit admin edits including cleared fields', () => {
  const updatedRemote = {
    fullName: 'REIVON VALE',
    institutionEn: 'Bogra Polytechnic Institute',
    institutionBn: 'বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট',
    academicYearEn: '2nd Year Student',
    academicYearBn: '২য় বর্ষের ছাত্র',
    currentSemesterEn: '3rd Semester',
    currentSemesterBn: '৩য় সেমিস্টার',
    departmentEn: 'Power Department',
    departmentBn: 'পাওয়ার ডিপার্টমেন্ট',
    locationEn: '',
    locationBn: '',
  };

  const merged = mergeProfileWithDefaults(updatedRemote, DEFAULT_PORTFOLIO_DATA.profile);
  assert.equal(merged.academicYearEn, '2nd Year Student');
  assert.equal(merged.academicYearBn, '২য় বর্ষের ছাত্র');
  assert.equal(merged.currentSemesterEn, '3rd Semester');
  assert.equal(merged.currentSemesterBn, '৩য় সেমিস্টার');
  assert.equal(merged.locationEn, '');
  assert.equal(merged.locationBn, '');
});

test('buildAcademicIdentityItems returns localized structured items and omits blanks', () => {
  const bnItems = buildAcademicIdentityItems(DEFAULT_PORTFOLIO_DATA.profile, 'bn', {
    institutionLabel: 'প্রতিষ্ঠান',
    academicYearLabel: 'শিক্ষার্থী পরিচয়',
    departmentLabel: 'ডিপার্টমেন্ট / মেজর',
  });
  assert.equal(bnItems.length, 3);
  assert.deepEqual(
    bnItems.map((i) => i.value),
    ['বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট', '১ম বর্ষের ছাত্র', 'পাওয়ার ডিপার্টমেন্ট'],
  );

  const partial = buildAcademicIdentityItems(
    { ...DEFAULT_PORTFOLIO_DATA.profile, academicYearEn: '   ' },
    'en',
    {
      institutionLabel: 'Institute',
      academicYearLabel: 'Student Status',
      departmentLabel: 'Major',
    },
  );
  assert.equal(partial.length, 2);
  assert.deepEqual(
    partial.map((i) => i.key),
    ['institution', 'department'],
  );
});

test('formatHeroAcademicSummary avoids duplicate department prefixes and supports raw names', () => {
  const enLine = formatHeroAcademicSummary(DEFAULT_PORTFOLIO_DATA.profile, 'en', 'Major');
  assert.equal(enLine, 'Bogra Polytechnic Institute · 1st Year Student · Power Department');

  const bnLine = formatHeroAcademicSummary(DEFAULT_PORTFOLIO_DATA.profile, 'bn', 'ডিপার্টমেন্ট');
  assert.equal(bnLine, 'বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট · ১ম বর্ষের ছাত্র · পাওয়ার ডিপার্টমেন্ট');

  const customShort = formatHeroAcademicSummary(
    { ...DEFAULT_PORTFOLIO_DATA.profile, departmentEn: 'Power' },
    'en',
    'Department',
  );
  assert.equal(customShort, 'Bogra Polytechnic Institute · 1st Year Student · Department: Power');
});

test('resolveCurrentSemester prioritizes explicit semester and derives from academic year when blank', () => {
  assert.equal(resolveCurrentSemester(DEFAULT_PORTFOLIO_DATA.profile, 'en'), '1st Semester');
  assert.equal(resolveCurrentSemester(DEFAULT_PORTFOLIO_DATA.profile, 'bn'), '১ম সেমিস্টার');

  assert.equal(
    resolveCurrentSemester(
      {
        currentSemesterEn: '',
        currentSemesterBn: '',
        academicYearEn: '2nd Year Student',
        academicYearBn: '২য় বর্ষের ছাত্র',
      },
      'en',
    ),
    '3rd Semester',
  );
  assert.equal(
    resolveCurrentSemester(
      {
        currentSemesterEn: '',
        currentSemesterBn: '',
        academicYearEn: '2nd Year Student',
        academicYearBn: '২য় বর্ষের ছাত্র',
      },
      'bn',
    ),
    '৩য় সেমিস্টার',
  );

  assert.equal(
    resolveCurrentSemester(
      {
        currentSemesterEn: '',
        currentSemesterBn: '',
        academicYearEn: '',
        academicYearBn: '',
      },
      'en',
    ),
    null,
  );
});
