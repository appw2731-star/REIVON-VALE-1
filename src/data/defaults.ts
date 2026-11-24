import type { PortfolioSnapshot } from '../types/portfolio';

export const ASSET_PATHS = {
  profileAvatar: '/src/assets/images/profile_reivon_avatar_1795456284630.jpg',
  projectPolytechnicHub: '/images/project-polytechnic-hub.png',
  projectWeb: '/src/assets/images/project_web_platform_1795456284398.jpg',
  projectAndroid: '/src/assets/images/project_android_app_1795456283913.jpg',
  projectAi: '/src/assets/images/project_ai_system_1795456283667.jpg',
  gallerySpatial: '/src/assets/images/gallery_spatial_art_1795456283369.jpg',
} as const;

export const DEFAULT_PORTFOLIO_DATA: PortfolioSnapshot = {
  profile: {
    id: 'main',
    fullName: 'REIVON VALE',
    fullNameBn: 'রেইভন ভেল',
    profileImageUrl: ASSET_PATHS.profileAvatar,
    taglineEn: 'Creating Digital Experiences.',
    taglineBn: 'ডিজিটাল অভিজ্ঞতা তৈরি করছি।',
    introEn:
      '1st Year Student in the Power Department at Bogra Polytechnic Institute — building modern web platforms, mobile applications, thoughtful UI/UX design, and interactive 3D digital experiences.',
    introBn:
      'বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউটের পাওয়ার ডিপার্টমেন্টের ১ম বর্ষের ছাত্র — আধুনিক ওয়েব প্ল্যাটফর্ম, মোবাইল অ্যাপ, ইউআই/ইউএক্স ডিজাইন এবং ইন্টারেক্টিভ ৩ডি ডিজিটাল অভিজ্ঞতা তৈরি করছি।',
    bioEn:
      'Currently studying as a 1st Year Student in the Power Department at Bogra Polytechnic Institute. Focused on combining engineering discipline with modern web and mobile development to build fast, purposeful digital products.',
    bioBn:
      'আমি বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউটের পাওয়ার ডিপার্টমেন্টের ১ম বর্ষের ছাত্র। ইঞ্জিনিয়ারিংয়ের শৃঙ্খলা ও আধুনিক ওয়েব ও মোবাইল ডেভেলপমেন্টের সমন্বয়ে দ্রুত, কার্যকর এবং দৃষ্টিনন্দন ডিজিটাল প্ল্যাটফর্ম তৈরিতে কাজ করছি।',
    locationEn: 'Bogra, Bangladesh',
    locationBn: 'বগুড়া, বাংলাদেশ',
    institutionEn: 'Bogra Polytechnic Institute',
    institutionBn: 'বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট',
    academicYearEn: '1st Year Student',
    academicYearBn: '১ম বর্ষের ছাত্র',
    currentSemesterEn: '1st Semester',
    currentSemesterBn: '১ম সেমিস্টার',
    departmentEn: 'Power Department',
    departmentBn: 'পাওয়ার ডিপার্টমেন্ট',
    interestsEn: ['Power Engineering', 'Web Architecture', '3D Interaction', 'Artificial Intelligence', 'Visual Design'],
    interestsBn: ['পাওয়ার ইঞ্জিনিয়ারিং', 'ওয়েব আর্কিটেকচার', '৩ডি ইন্টারঅ্যাকশন', 'কৃত্রিম বুদ্ধিমত্তা', 'ভিজ্যুয়াল ডিজাইন'],
    goalsEn:
      'Build resilient, fast, and visually memorable digital products that unite precision engineering with human-centered design.',
    goalsBn:
      'নিখুঁত ইঞ্জিনিয়ারিং এবং মানবকেন্দ্রিক ডিজাইনের সমন্বয়ে দ্রুত, নিরাপদ ও স্মরণীয় ডিজিটাল অভিজ্ঞতা তৈরি করা।',
  },
  skills: [
    {
      id: 'skill-web',
      titleEn: 'Web Development',
      titleBn: 'ওয়েব ডেভেলপমেন্ট',
      descriptionEn:
        'Full-stack web applications engineered for responsiveness, clean architecture, accessibility, and fast loading across desktop and mobile.',
      descriptionBn:
        'আধুনিক, দ্রুত এবং রেসপনসিভ ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন নির্মাণ, যা ডেস্কটপ ও মোবাইলে সমানভাবে কার্যকর।',
      iconKey: 'code',
      focusAreasEn: ['React & TypeScript', 'Full-Stack APIs', 'Performance'],
      sortOrder: 1,
    },
    {
      id: 'skill-app',
      titleEn: 'App Development',
      titleBn: 'অ্যাপ ডেভেলপমেন্ট',
      descriptionEn:
        'Android and cross-platform mobile applications designed for fluid touch ergonomics, offline resilience, and dependable performance.',
      descriptionBn:
        'অ্যান্ড্রয়েড এবং ক্রস-প্ল্যাটফর্ম মোবাইল অ্যাপ্লিকেশন তৈরি, যা সহজ ব্যবহার ও নির্ভরযোগ্য পারফরম্যান্স নিশ্চিত করে।',
      iconKey: 'smartphone',
      focusAreasEn: ['Android Workflows', 'Mobile-First UX', 'Cloud Sync'],
      sortOrder: 2,
    },
    {
      id: 'skill-uiux',
      titleEn: 'UI/UX Design',
      titleBn: 'ইউআই/ইউএক্স ডিজাইন',
      descriptionEn:
        'Structured design systems, clear visual hierarchy, interactive prototyping, and tactile dark-mode interfaces crafted for readability.',
      descriptionBn:
        'সুবিন্যস্ত ডিজাইন সিস্টেম, স্পষ্ট ভিজ্যুয়াল হায়ারার্কি এবং পরিচ্ছন্ন ব্যবহারবান্ধব ইন্টারফেস ডিজাইন।',
      iconKey: 'layout',
      focusAreasEn: ['Design Systems', 'Prototyping', 'Interaction'],
      sortOrder: 3,
    },
    {
      id: 'skill-ai',
      titleEn: 'Artificial Intelligence',
      titleBn: 'কৃত্রিম বুদ্ধিমত্তা',
      descriptionEn:
        'Practical integration of intelligent workflows, automation pipelines, and next-generation AI tools into real-world digital products.',
      descriptionBn:
        'বাস্তব ডিজিটাল পণ্যে স্মার্ট অটোমেশন ও আধুনিক কৃত্রিম বুদ্ধিমত্তাভিত্তিক সমাধানের কার্যকর প্রয়োগ।',
      iconKey: 'cpu',
      focusAreasEn: ['AI Workflows', 'Automation', 'Applied ML'],
      sortOrder: 4,
    },
    {
      id: 'skill-creative',
      titleEn: 'Creative Design',
      titleBn: 'ক্রিয়েটিভ ডিজাইন',
      descriptionEn:
        'Brand direction, spatial 3D scenes, motion choreography, and cohesive visual identity systems with unmistakable character.',
      descriptionBn:
        'ব্র্যান্ড আইডেন্টিটি, ৩ডি ভিজ্যুয়াল কম্পোজিশন, মোশন এবং স্বতন্ত্র সৃজনশীল ডিজাইন নির্দেশনা।',
      iconKey: 'palette',
      focusAreasEn: ['Brand Identity', '3D Visuals', 'Motion Design'],
      sortOrder: 5,
    },
    {
      id: 'skill-digital',
      titleEn: 'Digital Technology',
      titleBn: 'ডিজিটাল টেকনোলজি',
      descriptionEn:
        'Cloud architecture, database security, SEO fundamentals, and modern deployment pipelines from repository to live production.',
      descriptionBn:
        'ক্লাউড আর্কিটেকচার, ডাটাবেস নিরাপত্তা, এসইও এবং আধুনিক ডিপ্লয়মেন্ট ওয়ার্কফ্লো ব্যবস্থাপনা।',
      iconKey: 'globe',
      focusAreasEn: ['Cloud & Security', 'SEO & Web Standards', 'CI/CD'],
      sortOrder: 6,
    },
  ],
  projects: [
    {
      id: 'proj-polytechnic-hub',
      titleEn: 'Polytechnic Hub — Learn • Practice • Achieve',
      titleBn: 'Polytechnic Hub — পলিটেকনিক শিক্ষার্থীদের শিক্ষা প্ল্যাটফর্ম',
      thumbnailUrl: ASSET_PATHS.projectPolytechnicHub,
      descriptionEn:
        'A dedicated study platform built for Bangladesh Polytechnic (Diploma in Engineering) students featuring a personal PDF library, Physics & Math Formula Hub, AI Tutor, BTEB Result access, MCQ & Model Tests, Study Routine, Study Timer, Power & Engineering Tools, and Student Community.',
      descriptionBn:
        'বাংলাদেশের পলিটেকনিক (ডিপ্লোমা ইঞ্জিনিয়ারিং) শিক্ষার্থীদের পড়াশোনার জন্য তৈরি সম্পূর্ণ শিক্ষা প্ল্যাটফর্ম — ব্যক্তিগত PDF লাইব্রেরি, পদার্থবিজ্ঞান ও গণিত ফর্মুলা হাব, এআই টিউটর, BTEB রেজাল্ট, MCQ ও মডেল টেস্ট, স্টাডি রুটিন, টাইমার, ইঞ্জিনিয়ারিং টুলস এবং স্টুডেন্ট কমিউনিটিসহ।',
      category: 'websites',
      technologies: ['Web Platform', 'PWA', 'AI Tutor', 'Formula Hub', 'Bilingual EN/বাংলা', 'Vercel'],
      liveDemoUrl: 'https://polytechnic-hub-alpha.vercel.app/',
      githubUrl: '',
      status: 'live',
      featured: true,
      isPlaceholder: false,
      sortOrder: 1,
    },
  ],
  gallery: [],
  socialLinks: [
    {
      id: 'social-facebook',
      platform: 'facebook',
      label: 'Facebook',
      url: 'https://www.facebook.com/profile.php?id=61595567000911',
      visible: true,
      sortOrder: 1,
    },
    {
      id: 'social-instagram',
      platform: 'instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/reivonvale?dlrf=MWN3cHV0cDZxaGV5OA==',
      visible: true,
      sortOrder: 2,
    },
    {
      id: 'social-tiktok',
      platform: 'tiktok',
      label: 'TikTok',
      url: 'https://www.tiktok.com/@reivon.vale',
      visible: true,
      sortOrder: 3,
    },
    {
      id: 'social-telegram',
      platform: 'telegram',
      label: 'Telegram',
      url: 'https://t.me/reivonvale',
      visible: true,
      sortOrder: 4,
    },
  ],
  siteSettings: {
    id: 'main',
    brandName: 'REIVON VALE',
    logoText: 'REIVON VALE',
    logoImageUrl: '',
    productionUrl: '',
    seoTitle: 'REIVON VALE — Creative Digital Explorer | Web Developer | Future Creator',
    seoDescription:
      'REIVON VALE futuristic personal portfolio featuring interactive 3D visuals, web applications, mobile experiences, UI/UX design, and creative technology.',
    seoKeywords: 'REIVON VALE, Portfolio, Creative Digital Explorer, Web Developer, Future Creator, 3D Web, UI/UX Design',
    ogImageUrl: ASSET_PATHS.projectWeb,
    footerNoteEn: 'REIVON VALE. Creative Digital Explorer & Future Creator.',
    footerNoteBn: 'REIVON VALE — ক্রিয়েটিভ ডিজিটাল এক্সপ্লোরার ও ফিউচার ক্রিয়েটর।',
  },
};
