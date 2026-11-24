import test from 'node:test';
import assert from 'node:assert/strict';
import {
  classifyTechnology,
  extractTechnologiesFromText,
  resolveProjectTechStack,
} from './techStack.ts';

test('classifyTechnology automatically highlights React, Firebase, Tailwind, and AI with semantic accents', () => {
  const react = classifyTechnology('React');
  assert.equal(react.isRecognized, true);
  assert.equal(react.category, 'frontend');
  assert.equal(react.iconId, 'react');

  const firebase = classifyTechnology('Firebase');
  assert.equal(firebase.isRecognized, true);
  assert.equal(firebase.category, 'backend');
  assert.equal(firebase.iconId, 'firebase');

  const tailwind = classifyTechnology('Tailwind');
  assert.equal(tailwind.isRecognized, true);
  assert.equal(tailwind.category, 'styling');
  assert.equal(tailwind.iconId, 'tailwind');

  const ai = classifyTechnology('AI Tutor');
  assert.equal(ai.isRecognized, true);
  assert.equal(ai.category, 'ai');
  assert.equal(ai.iconId, 'ai');

  const custom = classifyTechnology('Custom Academic Tool');
  assert.equal(custom.isRecognized, false);
  assert.equal(custom.iconId, 'layers');
});

test('resolveProjectTechStack deduplicates explicit technologies case-insensitively', () => {
  const badges = resolveProjectTechStack({
    titleEn: 'Campus Portal',
    descriptionEn: 'Built for engineering students',
    liveDemoUrl: 'https://campus.vercel.app',
    technologies: ['React', 'react', 'Firebase', 'Tailwind CSS', '  '],
  });

  assert.equal(badges.length, 3);
  assert.deepEqual(
    badges.map((b) => b.label),
    ['React', 'Firebase', 'Tailwind CSS']
  );
});

test('resolveProjectTechStack auto-detects technologies from description and live URL when explicit list is empty', () => {
  const badges = resolveProjectTechStack({
    titleEn: 'Diploma Study App',
    descriptionEn: 'Built with React, Tailwind, and Firebase for polytechnic exams with PWA support.',
    liveDemoUrl: 'https://diploma-study.vercel.app/',
    technologies: [],
  });

  const labels = badges.map((b) => b.label);
  assert.equal(labels.includes('React'), true);
  assert.equal(labels.includes('Tailwind CSS'), true);
  assert.equal(labels.includes('Firebase'), true);
  assert.equal(labels.includes('PWA'), true);
  assert.equal(labels.includes('Vercel'), true);
});

test('extractTechnologiesFromText respects maxItems cap and avoids false matches', () => {
  const extracted = extractTechnologiesFromText('Simple academic portfolio without framework keywords');
  assert.deepEqual(extracted, []);

  const capped = extractTechnologiesFromText(
    'React Next.js TypeScript JavaScript Tailwind Firebase Supabase Node.js Three.js Python',
    4
  );
  assert.equal(capped.length, 4);
});
