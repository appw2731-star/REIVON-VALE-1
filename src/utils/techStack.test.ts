import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBriefProjectDescription,
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

test('classifyTechnology resolves specific SVG icon IDs for Vercel, PWA, TypeScript, Next.js, Formula Hub, and Bilingual', () => {
  assert.equal(classifyTechnology('Vercel').iconId, 'vercel');
  assert.equal(classifyTechnology('PWA').iconId, 'pwa');
  assert.equal(classifyTechnology('TypeScript').iconId, 'typescript');
  assert.equal(classifyTechnology('JavaScript').iconId, 'javascript');
  assert.equal(classifyTechnology('Next.js').iconId, 'nextjs');
  assert.equal(classifyTechnology('Node.js').iconId, 'nodejs');
  assert.equal(classifyTechnology('Formula Hub').iconId, 'formula');
  assert.equal(classifyTechnology('Bilingual EN/বাংলা').iconId, 'bilingual');
  assert.equal(classifyTechnology('Three.js').iconId, 'threejs');
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

test('buildBriefProjectDescription returns concise clean summaries for hover overlays', () => {
  assert.equal(buildBriefProjectDescription('   '), '');
  assert.equal(buildBriefProjectDescription('Short summary text.', 120), 'Short summary text.');

  const multiSentence =
    'A dedicated study platform built for Bangladesh Polytechnic students with interactive tools. It also adds extra modules for semester prep, MCQ testing, and community study rooms.';
  const brief = buildBriefProjectDescription(multiSentence, 120);
  assert.equal(
    brief,
    'A dedicated study platform built for Bangladesh Polytechnic students with interactive tools.'
  );

  const singleLong =
    'A comprehensive diploma engineering study workspace offering PDF libraries, formula sheets, AI tutor explanations, study timers, routine planners, and exam practice tests';
  const trimmed = buildBriefProjectDescription(singleLong, 100);
  assert.equal(trimmed.endsWith('…'), true);
  assert.equal(trimmed.length <= 101, true);
  assert.equal(trimmed.includes('formu…'), false);

  const trailingAmpersand =
    'A dedicated study platform built for Bangladesh Polytechnic students featuring PDF library, Formula Hub, AI Tutor, BTEB Result access, MCQ & Model Tests and Study Timer';
  const cleanCut = buildBriefProjectDescription(trailingAmpersand, 141);
  assert.equal(cleanCut.endsWith('&…'), false);
  assert.equal(cleanCut.endsWith('…'), true);
});

