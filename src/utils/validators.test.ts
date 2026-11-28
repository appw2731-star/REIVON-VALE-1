import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateContactForm,
  isSafeHttpUrl,
  isSafeImageSrc,
  validateImageUploadFile,
  resolveProductionUrl,
  filterProjectsByCategory,
  filterGalleryByCategory,
  parseTagInput,
  checkSpamCooldown,
  computeRealPortfolioStats,
  extractSocialHandle,
  mergeProjectsWithDefaults,
} from './validators';
import type { ProjectItem, GalleryItem } from '../types/portfolio';

test('validateContactForm rejects empty, short, invalid email, and honeypot payloads', () => {
  const empty = validateContactForm({ name: '', email: '', subject: '', message: '' });
  assert.equal(empty.valid, false);
  assert.equal(empty.errors.name, 'invalid_name');
  assert.equal(empty.errors.email, 'invalid_email');
  assert.equal(empty.errors.subject, 'invalid_subject');
  assert.equal(empty.errors.message, 'invalid_message');

  const honeypot = validateContactForm({
    name: 'Visitor Name',
    email: 'visitor@example.com',
    subject: 'Project Inquiry',
    message: 'Hello, I would love to discuss a project.',
    honeypot: 'http://spam.example',
  });
  assert.equal(honeypot.valid, false);
  assert.equal(honeypot.errors.spam, 'spam_detected');
});

test('validateContactForm accepts valid payload', () => {
  const ok = validateContactForm({
    name: 'Amina Rahman',
    email: 'amina@example.com',
    subject: 'Collaboration Proposal',
    message: 'Hello Reivon, I saw your portfolio and would like to discuss a web application.',
    honeypot: '',
  });
  assert.equal(ok.valid, true);
  assert.deepEqual(ok.errors, {});
});

test('URL and image source validators block javascript: and unsafe data: schemes', () => {
  assert.equal(isSafeHttpUrl('https://t.me/reivonvale'), true);
  assert.equal(isSafeHttpUrl('javascript:alert(1)'), false);
  assert.equal(isSafeHttpUrl('data:text/html,<script>alert(1)</script>'), false);

  assert.equal(isSafeImageSrc('/src/assets/images/sample.jpg'), true);
  assert.equal(isSafeImageSrc('data:image/webp;base64,UklGRh4='), true);
  assert.equal(isSafeImageSrc('data:image/svg+xml;base64,PHN2Zz4='), false);
  assert.equal(isSafeImageSrc('javascript:alert(1)'), false);
});

test('validateImageUploadFile enforces allowed MIME types and 5MB cap', () => {
  assert.equal(validateImageUploadFile({ type: 'image/webp', size: 1024 * 500 }), null);
  assert.equal(validateImageUploadFile({ type: 'image/svg+xml', size: 1024 }), 'unsupported_file_type');
  assert.equal(validateImageUploadFile({ type: 'image/png', size: 6 * 1024 * 1024 }), 'file_too_large');
});

test('resolveProductionUrl prioritizes configured URL, then env, then runtime origin', () => {
  assert.equal(
    resolveProductionUrl('https://reivonvale.com/', 'https://env.example', 'https://runtime.example'),
    'https://reivonvale.com'
  );
  assert.equal(
    resolveProductionUrl('', 'https://reivonvale.vercel.app/', 'https://runtime.example'),
    'https://reivonvale.vercel.app'
  );
  assert.equal(
    resolveProductionUrl('javascript:alert(1)', '', 'https://ais.run.app/'),
    'https://ais.run.app'
  );
});

test('filterProjectsByCategory prioritizes featured items and filters strictly', () => {
  const sample: ProjectItem[] = [
    {
      id: '1',
      titleEn: 'Beta',
      titleBn: 'বিটা',
      thumbnailUrl: '',
      descriptionEn: 'Desc',
      descriptionBn: 'বিবরণ',
      category: 'websites',
      technologies: ['React'],
      liveDemoUrl: '',
      githubUrl: '',
      status: 'live',
      featured: false,
      isPlaceholder: true,
      sortOrder: 1,
    },
    {
      id: '2',
      titleEn: 'Alpha',
      titleBn: 'আলফা',
      thumbnailUrl: '',
      descriptionEn: 'Desc',
      descriptionBn: 'বিবরণ',
      category: 'ai',
      technologies: ['Python'],
      liveDemoUrl: '',
      githubUrl: '',
      status: 'concept',
      featured: true,
      isPlaceholder: true,
      sortOrder: 2,
    },
  ];
  const all = filterProjectsByCategory(sample, 'all');
  assert.equal(all[0].id, '2');
  assert.equal(filterProjectsByCategory(sample, 'websites').length, 1);
  assert.equal(filterProjectsByCategory(sample, 'android').length, 0);
});

test('filterGalleryByCategory, parseTagInput, and checkSpamCooldown work deterministically', () => {
  const gallery: GalleryItem[] = [
    {
      id: 'g2',
      titleEn: 'Second',
      titleBn: 'দ্বিতীয়',
      captionEn: '',
      captionBn: '',
      imageUrl: '/src/assets/images/a.jpg',
      category: '3d',
      isPlaceholder: true,
      sortOrder: 2,
    },
    {
      id: 'g1',
      titleEn: 'First',
      titleBn: 'প্রথম',
      captionEn: '',
      captionBn: '',
      imageUrl: '/src/assets/images/b.jpg',
      category: 'design',
      isPlaceholder: true,
      sortOrder: 1,
    },
  ];
  assert.equal(filterGalleryByCategory(gallery, 'all')[0].id, 'g1');
  assert.equal(filterGalleryByCategory(gallery, '3d').length, 1);
  assert.deepEqual(parseTagInput(' React , TypeScript, , Three.js ', 2), ['React', 'TypeScript']);
  assert.equal(checkSpamCooldown(1000, 15000, 20000), false);
  assert.equal(checkSpamCooldown(1000, 25000, 20000), true);
});

test('computeRealPortfolioStats returns empty when only placeholder data exists and counts real published items', () => {
  const placeholderProject: ProjectItem = {
    id: 'p1',
    titleEn: 'Template',
    titleBn: 'টেমপ্লেট',
    thumbnailUrl: '',
    descriptionEn: 'Desc',
    descriptionBn: 'বিবরণ',
    category: 'websites',
    technologies: [],
    liveDemoUrl: '',
    githubUrl: '',
    status: 'concept',
    featured: false,
    isPlaceholder: true,
    sortOrder: 1,
  };
  assert.deepEqual(
    computeRealPortfolioStats({ projects: [placeholderProject], gallery: [], skillsCount: 6 }),
    []
  );

  const liveProject: ProjectItem = { ...placeholderProject, id: 'p2', isPlaceholder: false };
  const liveGallery: GalleryItem = {
    id: 'g1',
    titleEn: 'Render',
    titleBn: 'রেন্ডার',
    captionEn: '',
    captionBn: '',
    imageUrl: '/src/assets/images/a.jpg',
    category: '3d',
    isPlaceholder: false,
    sortOrder: 1,
  };
  assert.deepEqual(
    computeRealPortfolioStats({ projects: [placeholderProject, liveProject], gallery: [liveGallery], skillsCount: 6 }),
    [
      { key: 'projects', value: 1 },
      { key: 'gallery', value: 1 },
      { key: 'skills', value: 6 },
    ]
  );
});

test('extractSocialHandle extracts clean official handles from REIVON VALE social URLs', () => {
  assert.equal(
    extractSocialHandle('https://www.facebook.com/profile.php?id=61595567000911', 'Facebook'),
    'REIVON VALE Official'
  );
  assert.equal(
    extractSocialHandle('https://www.instagram.com/reivonvale?dlrf=MWN3cHV0cDZxaGV5OA==', 'Instagram'),
    '@reivonvale'
  );
  assert.equal(
    extractSocialHandle('https://www.tiktok.com/@reivon.vale', 'TikTok'),
    '@reivon.vale'
  );
  assert.equal(
    extractSocialHandle('https://t.me/reivonvale', 'Telegram'),
    '@reivonvale'
  );
});

test('mergeProjectsWithDefaults appends newly added defaults while preserving remote edits and preventing duplicates', () => {
  const polytechnicRemote: ProjectItem = {
    id: 'proj-polytechnic-hub',
    titleEn: 'Polytechnic Hub (Custom Edited)',
    titleBn: 'পলিটেকনিক হাব',
    thumbnailUrl: '/images/project-polytechnic-hub.png',
    descriptionEn: 'Edited in Admin',
    descriptionBn: 'এডমিন থেকে আপডেট',
    category: 'websites',
    technologies: ['React', 'Vercel'],
    liveDemoUrl: 'https://polytechnic-hub-alpha.vercel.app/',
    githubUrl: '',
    status: 'live',
    featured: true,
    isPlaceholder: false,
    sortOrder: 1,
  };

  const defaults: ProjectItem[] = [
    {
      ...polytechnicRemote,
      titleEn: 'Polytechnic Hub — Default Title',
    },
    {
      id: 'proj-glow-gift-bd',
      titleEn: 'Glow & Gift BD',
      titleBn: 'Glow & Gift BD',
      thumbnailUrl: '/images/project-glow-gift-bd.png',
      descriptionEn: 'E-commerce storefront',
      descriptionBn: 'ই-কমার্স ওয়েবসাইট',
      category: 'websites',
      technologies: ['E-Commerce', 'Vercel'],
      liveDemoUrl: 'https://glow-gift-bd.vercel.app/',
      githubUrl: '',
      status: 'live',
      featured: true,
      isPlaceholder: false,
      sortOrder: 2,
    },
  ];

  // Appends missing Glow & Gift BD and preserves remote edit on Polytechnic Hub
  const merged = mergeProjectsWithDefaults([polytechnicRemote], defaults);
  assert.equal(merged.length, 2);
  assert.equal(merged[0].id, 'proj-polytechnic-hub');
  assert.equal(merged[0].titleEn, 'Polytechnic Hub (Custom Edited)');
  assert.equal(merged[1].id, 'proj-glow-gift-bd');

  // Prevents duplicate when remote already added same URL under a custom id without trailing slash
  const customGlowRemote: ProjectItem = {
    ...defaults[1],
    id: 'proj-custom-glow',
    liveDemoUrl: 'https://GLOW-GIFT-BD.vercel.app',
  };
  const deduped = mergeProjectsWithDefaults([polytechnicRemote, customGlowRemote], defaults);
  assert.equal(deduped.length, 2);
  assert.equal(deduped[1].id, 'proj-custom-glow');
});


