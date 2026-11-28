import type { Language, ProjectCategory, ProjectStatus, GalleryCategory } from '../types/portfolio';

export interface TranslationDictionary {
  preloader: {
    skipIntro: string;
    subtitle: string;
  };
  nav: {
    social: string;
    about: string;
    skills: string;
    projects: string;
    gallery: string;
    contact: string;
    admin: string;
    menuOpen: string;
    menuClose: string;
  };
  hero: {
    subtitle: string;
    exploreWork: string;
    contactMe: string;
    scrollCue: string;
    interactiveScene: string;
  };
  socialHub: {
    sectionLabel: string;
    heading: string;
    subtitle: string;
    openProfile: string;
    platformNotes: Record<string, string>;
  };
  about: {
    sectionLabel: string;
    heading: string;
    fullNameLabel: string;
    locationLabel: string;
    academicHeading: string;
    institutionLabel: string;
    academicYearLabel: string;
    currentSemesterLabel: string;
    activeLearningLabel: string;
    departmentLabel: string;
    biographyLabel: string;
    interestsLabel: string;
    goalsLabel: string;
    editableHint: string;
    statLabels: {
      projects: string;
      gallery: string;
      skills: string;
    };
  };
  skills: {
    sectionLabel: string;
    heading: string;
    subtitle: string;
    emptyState: string;
  };
  projects: {
    sectionLabel: string;
    heading: string;
    subtitle: string;
    allCategories: string;
    featuredLabel: string;
    placeholderLabel: string;
    liveDemo: string;
    github: string;
    viewDetails: string;
    closeDetails: string;
    technologiesLabel: string;
    techStackLabel: string;
    filteringByTech: string;
    clearTechFilter: string;
    showMoreTech: string;
    showLessTech: string;
    briefSummaryLabel: string;
    hoverHint: string;
    toggleSummary: string;
    emptyCategory: string;
    categories: Record<ProjectCategory, string>;
    statuses: Record<ProjectStatus, string>;
    activity: {
      eyebrow: string;
      heading: string;
      subtitleAcademic: string;
      subtitleGithub: string;
      githubLiveBadge: string;
      academicModeBadge: string;
      viewGithubProfile: string;
      statLiveProjects: string;
      statTechCount: string;
      statActiveDays: string;
      statStreak: string;
      statPublicRepos: string;
      statRecentEvents: string;
      daysUnit: string;
      sessionsUnit: string;
      eventsUnit: string;
      heatmapTitle: string;
      lessLabel: string;
      moreLabel: string;
      hoverHint: string;
      noActivityDay: string;
      techFootprintLabel: string;
      connectGithubHint: string;
    };
  };
  gallery: {
    sectionLabel: string;
    heading: string;
    subtitle: string;
    allCategories: string;
    openFullscreen: string;
    closeViewer: string;
    previousImage: string;
    nextImage: string;
    emptyCategory: string;
    categories: Record<GalleryCategory, string>;
  };
  qr: {
    sectionLabel: string;
    heading: string;
    subtitle: string;
    liveUrlLabel: string;
    downloadPng: string;
    copyUrl: string;
    copied: string;
    scanHint: string;
  };
  contact: {
    sectionLabel: string;
    heading: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendButton: string;
    sending: string;
    successTitle: string;
    successBody: string;
    sendAnother: string;
    socialHeading: string;
    errors: {
      invalid_name: string;
      invalid_email: string;
      invalid_subject: string;
      invalid_message: string;
      spam_detected: string;
      cooldown: string;
      submit_failed: string;
    };
  };
  footer: {
    adminPortal: string;
    backToTop: string;
  };
  admin: {
    title: string;
    subtitle: string;
    backToSite: string;
    signInWithGoogle: string;
    signOut: string;
    unauthorizedTitle: string;
    unauthorizedDesc: string;
    ownerOnlyNotice: string;
    allowedAccountLabel: string;
    rejectedAccountPrefix: string;
    tabs: {
      overview: string;
      profile: string;
      skills: string;
      projects: string;
      gallery: string;
      social: string;
      messages: string;
      settings: string;
    };
    saveChanges: string;
    saving: string;
    saved: string;
    addNew: string;
    edit: string;
    delete: string;
    cancel: string;
    confirmDelete: string;
    seedDefaults: string;
  };
}

export const TRANSLATIONS: Record<Language, TranslationDictionary> = {
  en: {
    preloader: {
      skipIntro: 'Skip Intro',
      subtitle: 'Digital Universe',
    },
    nav: {
      social: 'Social Hub',
      about: 'About',
      skills: 'Skills',
      projects: 'Creative World',
      gallery: 'Gallery',
      contact: 'Contact',
      admin: 'Admin',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
    hero: {
      subtitle: 'Creative Digital Explorer | Web Developer | Future Creator',
      exploreWork: 'Explore My World',
      contactMe: 'Contact Me',
      scrollCue: 'Enter Social Hub',
      interactiveScene: 'Interactive 3D Digital Universe',
    },
    socialHub: {
      sectionLabel: '01. Connected Presence',
      heading: 'Social Media 3D Hub',
      subtitle: 'Connect with REIVON VALE across official platforms — interactive 3D glass & chrome gateways.',
      openProfile: 'Open Official Profile',
      platformNotes: {
        facebook: 'Community updates, releases & creative milestones',
        instagram: 'Visual identity, 3D stills & design direction',
        tiktok: 'Short-form motion, web craft & behind-the-scenes',
        telegram: 'Direct channel & fastest personal connection',
      },
    },
    about: {
      sectionLabel: '02. Personal Identity',
      heading: 'About Me',
      fullNameLabel: 'Identity',
      locationLabel: 'Location',
      academicHeading: 'Academic Profile',
      institutionLabel: 'Institute',
      academicYearLabel: 'Student Status',
      currentSemesterLabel: 'Current Semester',
      activeLearningLabel: 'Active Learning',
      departmentLabel: 'Major',
      biographyLabel: 'Personal Biography',
      interestsLabel: 'Creative Interests',
      goalsLabel: 'Future Vision',
      editableHint: 'All personal details are dynamically managed via the Owner Admin Dashboard.',
      statLabels: {
        projects: 'Published Projects',
        gallery: 'Visual Works',
        skills: 'Core Disciplines',
      },
    },
    skills: {
      sectionLabel: '03. Capabilities',
      heading: 'Skills & Technologies',
      subtitle: 'Focused disciplines uniting engineering precision, spatial 3D aesthetics, and modern digital technology.',
      emptyState: 'No skill cards published yet.',
    },
    projects: {
      sectionLabel: '04. Project Showcase',
      heading: 'My Creative World',
      subtitle: 'Curated showcase across websites, web applications, mobile apps, UI/UX designs, and creative digital experiments.',
      allCategories: 'All',
      featuredLabel: 'Featured',
      placeholderLabel: 'Editable Slot',
      liveDemo: 'Live Demo',
      github: 'Source Code',
      viewDetails: 'View Details',
      closeDetails: 'Close project details',
      technologiesLabel: 'Technologies',
      techStackLabel: 'Tech Stack',
      filteringByTech: 'Filtered by tech:',
      clearTechFilter: 'Clear filter',
      showMoreTech: 'more',
      showLessTech: 'Less',
      briefSummaryLabel: 'Brief Overview',
      hoverHint: 'Hover for overview',
      toggleSummary: 'Toggle brief overview',
      emptyCategory: 'No projects published in this category yet.',
      categories: {
        websites: 'Websites',
        ai: 'Web Applications',
        android: 'Mobile Apps',
        uiux: 'UI/UX Designs',
        other: 'Creative Projects',
      },
      statuses: {
        live: 'Live',
        in_progress: 'In Progress',
        concept: 'Concept',
        archived: 'Archived',
      },
      activity: {
        eyebrow: 'Coding Consistency',
        heading: 'Developer Activity & Project Stats',
        subtitleAcademic: 'Tracking hands-on web development, study tools, and engineering builds alongside polytechnic coursework.',
        subtitleGithub: 'Live public contribution timeline and repository metrics synced from GitHub.',
        githubLiveBadge: 'GitHub Live Sync',
        academicModeBadge: 'Polytechnic Build Log',
        viewGithubProfile: 'Open GitHub',
        statLiveProjects: 'Live Deployments',
        statTechCount: 'Stack Technologies',
        statActiveDays: 'Active Build Days',
        statStreak: 'Longest Streak',
        statPublicRepos: 'Public Repos',
        statRecentEvents: 'Recent GitHub Activity',
        daysUnit: 'days',
        sessionsUnit: 'build updates',
        eventsUnit: 'contributions',
        heatmapTitle: 'Coding Activity Graph (Last 36 Weeks)',
        lessLabel: 'Less',
        moreLabel: 'More',
        hoverHint: 'Hover or tap any day to inspect activity',
        noActivityDay: 'Rest / study day',
        techFootprintLabel: 'Project Tech Stack Footprint',
        connectGithubHint: 'Add a GitHub link in Admin → Social Links to auto-sync live commits.',
      },
    },
    gallery: {
      sectionLabel: '05. Visual Archive',
      heading: 'Visual Gallery',
      subtitle: 'Architectural lighting studies, spatial 3D compositions, interface frames, and design captures.',
      allCategories: 'All',
      openFullscreen: 'View full screen',
      closeViewer: 'Close image viewer',
      previousImage: 'Previous image',
      nextImage: 'Next image',
      emptyCategory: 'No gallery images uploaded yet.',
      categories: {
        design: 'Design',
        development: 'Development',
        '3d': '3D & Spatial',
        photography: 'Photography',
        other: 'Creative',
      },
    },
    qr: {
      sectionLabel: '06. Digital Identity Pass',
      heading: 'Direct Portfolio QR',
      subtitle: 'Scan to open this live REIVON VALE universe on any mobile device, or download the high-resolution PNG.',
      liveUrlLabel: 'Live URL',
      downloadPng: 'Download QR PNG',
      copyUrl: 'Copy URL',
      copied: 'Copied',
      scanHint: 'Updates automatically whenever the production URL changes.',
    },
    contact: {
      sectionLabel: '07. Direct Transmission',
      heading: 'Contact Me',
      subtitle: 'Have an ambitious idea, project, or collaboration in mind? Send a message directly to REIVON VALE.',
      nameLabel: 'Your Name',
      namePlaceholder: 'Enter your full name',
      emailLabel: 'Email Address',
      emailPlaceholder: 'you@example.com',
      subjectLabel: 'Subject',
      subjectPlaceholder: 'Project or collaboration topic',
      messageLabel: 'Message',
      messagePlaceholder: 'Share details about your project, idea, or inquiry...',
      sendButton: 'Send Message',
      sending: 'Sending...',
      successTitle: 'Message Delivered',
      successBody: 'Thank you for reaching out. Your message has been securely saved to the REIVON VALE inbox.',
      sendAnother: 'Send Another Message',
      socialHeading: 'Official Channels',
      errors: {
        invalid_name: 'Please enter your name (at least 2 characters).',
        invalid_email: 'Please provide a valid email address.',
        invalid_subject: 'Please enter a subject (at least 2 characters).',
        invalid_message: 'Please write a message of at least 10 characters.',
        spam_detected: 'Submission blocked by spam filter.',
        cooldown: 'Please wait a few seconds before sending another message.',
        submit_failed: 'Could not send your message right now. Please try again.',
      },
    },
    footer: {
      adminPortal: 'Admin Portal',
      backToTop: 'Back to top',
    },
    admin: {
      title: 'REIVON VALE Admin',
      subtitle: 'Owner Dashboard & Content Manager',
      backToSite: 'Return to Portfolio',
      signInWithGoogle: 'Sign in with Owner Google Account',
      signOut: 'Sign Out',
      unauthorizedTitle: 'Access Denied — Owner Only',
      unauthorizedDesc: 'Only webrokib@gmail.com is allowed to log in as admin. Any other Google account is blocked and signed out automatically.',
      ownerOnlyNotice: 'Admin login is strictly restricted to webrokib@gmail.com and enforced server-side by Firestore Security Rules. No other ID can log in.',
      allowedAccountLabel: 'Authorized Admin Gmail',
      rejectedAccountPrefix: 'Blocked & signed out:',
      tabs: {
        overview: 'Overview',
        profile: 'About & Profile',
        skills: 'Skills',
        projects: 'Projects',
        gallery: 'Gallery',
        social: 'Social Links',
        messages: 'Messages',
        settings: 'Settings & SEO',
      },
      saveChanges: 'Save Changes',
      saving: 'Saving...',
      saved: 'Saved',
      addNew: 'Add New',
      edit: 'Edit',
      delete: 'Delete',
      cancel: 'Cancel',
      confirmDelete: 'Delete',
      seedDefaults: 'Sync Starter Data to Database',
    },
  },
  bn: {
    preloader: {
      skipIntro: 'ইন্ট্রো স্কিপ করুন',
      subtitle: 'ডিজিটাল ইউনিভার্স',
    },
    nav: {
      social: 'সোশ্যাল হাব',
      about: 'পরিচিতি',
      skills: 'দক্ষতা',
      projects: 'সৃজনশীল জগত',
      gallery: 'গ্যালারি',
      contact: 'যোগাযোগ',
      admin: 'অ্যাডমিন',
      menuOpen: 'মেনু খুলুন',
      menuClose: 'মেনু বন্ধ করুন',
    },
    hero: {
      subtitle: 'ক্রিয়েটিভ ডিজিটাল এক্সপ্লোরার | ওয়েব ডেভেলপার | ফিউচার ক্রিয়েটর',
      exploreWork: 'আমার জগত দেখুন',
      contactMe: 'যোগাযোগ করুন',
      scrollCue: 'সোশ্যাল হাবে যান',
      interactiveScene: 'ইন্টারেক্টিভ ৩ডি ডিজিটাল ইউনিভার্স',
    },
    socialHub: {
      sectionLabel: '০১. অফিসিয়াল সংযোগ',
      heading: 'সোশ্যাল মিডিয়া ৩ডি হাব',
      subtitle: 'সকল অফিসিয়াল প্ল্যাটফর্মে REIVON VALE-এর সাথে সরাসরি যুক্ত হোন।',
      openProfile: 'অফিসিয়াল প্রোফাইল খুলুন',
      platformNotes: {
        facebook: 'কমিউনিটি আপডেট, রিলিজ এবং সৃজনশীল পথচলা',
        instagram: 'ভিজ্যুয়াল আইডেন্টিটি, ৩ডি ডিজাইন ও ক্রিয়েটিভ স্টাডি',
        tiktok: 'শর্ট-ফর্ম মোশন, ওয়েব ক্র্যাফট ও বিহাইন্ড-দ্য-সিনস',
        telegram: 'সরাসরি চ্যানেল এবং দ্রুততম যোগাযোগের মাধ্যম',
      },
    },
    about: {
      sectionLabel: '০২. ব্যক্তিগত পরিচয়',
      heading: 'আমার সম্পর্কে',
      fullNameLabel: 'পরিচয়',
      locationLabel: 'অবস্থান',
      academicHeading: 'শিক্ষাগত পরিচয়',
      institutionLabel: 'প্রতিষ্ঠান',
      academicYearLabel: 'শিক্ষার্থী পরিচয়',
      currentSemesterLabel: 'চলমান সেমিস্টার',
      activeLearningLabel: 'সক্রিয় অধ্যয়ন',
      departmentLabel: 'মেজর / ডিপার্টমেন্ট',
      biographyLabel: 'ব্যক্তিগত জীবনবৃত্তান্ত',
      interestsLabel: 'সৃজনশীল আগ্রহ',
      goalsLabel: 'ভবিষ্যৎ দৃষ্টিভঙ্গি',
      editableHint: 'সমস্ত ব্যক্তিগত তথ্য অ্যাডমিন ড্যাশবোর্ড থেকে সহজেই সম্পাদনাযোগ্য।',
      statLabels: {
        projects: 'প্রকাশিত প্রজেক্ট',
        gallery: 'ভিজ্যুয়াল কাজ',
        skills: 'মূল দক্ষতা',
      },
    },
    skills: {
      sectionLabel: '০৩. দক্ষতাসমূহ',
      heading: 'দক্ষতা ও প্রযুক্তি',
      subtitle: 'ইঞ্জিনিয়ারিং নিখুঁততা, ৩ডি ভিজ্যুয়াল ডিজাইন এবং আধুনিক ডিজিটাল প্রযুক্তির মূল ক্ষেত্রসমূহ।',
      emptyState: 'এখনো কোনো দক্ষতা যুক্ত করা হয়নি।',
    },
    projects: {
      sectionLabel: '০৪. প্রজেক্ট প্রদর্শনী',
      heading: 'আমার সৃজনশীল জগত',
      subtitle: 'ওয়েবসাইট, ওয়েব অ্যাপ্লিকেশন, মোবাইল অ্যাপ, ইউআই/ইউএক্স ডিজাইন ও সৃজনশীল প্রজেক্টের সংগ্রহ।',
      allCategories: 'সবগুলো',
      featuredLabel: 'নির্বাচিত',
      placeholderLabel: 'সম্পাদনাযোগ্য স্লট',
      liveDemo: 'লাইভ ডেমো',
      github: 'সোর্স কোড',
      viewDetails: 'বিস্তারিত দেখুন',
      closeDetails: 'বিস্তারিত বন্ধ করুন',
      technologiesLabel: 'ব্যবহৃত প্রযুক্তি',
      techStackLabel: 'টেক স্ট্যাক',
      filteringByTech: 'প্রযুক্তি ফিল্টার:',
      clearTechFilter: 'ফিল্টার মুছুন',
      showMoreTech: 'আরও',
      showLessTech: 'কম দেখুন',
      briefSummaryLabel: 'সংক্ষিপ্ত বিবরণ',
      hoverHint: 'বিবরণ দেখতে হোভার করুন',
      toggleSummary: 'সংক্ষিপ্ত বিবরণ দেখুন',
      emptyCategory: 'এই বিভাগে এখনো কোনো প্রজেক্ট নেই।',
      categories: {
        websites: 'ওয়েবসাইট',
        ai: 'ওয়েব অ্যাপ্লিকেশন',
        android: 'মোবাইল অ্যাপ',
        uiux: 'ইউআই/ইউএক্স ডিজাইন',
        other: 'ক্রিয়েটিভ প্রজেক্ট',
      },
      statuses: {
        live: 'লাইভ',
        in_progress: 'চলমান',
        concept: 'কনসেপ্ট',
        archived: 'আর্কাইভড',
      },
      activity: {
        eyebrow: 'কোডিং ধারাবাহিকতা',
        heading: 'ডেভেলপার অ্যাক্টিভিটি ও প্রজেক্ট পরিসংখ্যান',
        subtitleAcademic: 'পলিটেকনিক পড়াশোনার পাশাপাশি নিয়মিত ওয়েব ডেভেলপমেন্ট, স্টাডি টুলস এবং প্রজেক্ট নির্মাণের ধারাবাহিকতা।',
        subtitleGithub: 'গিটহাব থেকে সরাসরি সিঙ্ক করা পাবলিক অ্যাক্টিভিটি গ্রাফ এবং রিপোজিটরি পরিসংখ্যান।',
        githubLiveBadge: 'গিটহাব লাইভ সিঙ্ক',
        academicModeBadge: 'পলিটেকনিক বিল্ড লগ',
        viewGithubProfile: 'গিটহাব দেখুন',
        statLiveProjects: 'লাইভ প্রজেক্ট',
        statTechCount: 'ব্যবহৃত প্রযুক্তি',
        statActiveDays: 'সক্রিয় কোডিং দিন',
        statStreak: 'সর্বোচ্চ স্ট্রিক',
        statPublicRepos: 'পাবলিক রিপো',
        statRecentEvents: 'সাম্প্রতিক কন্ট্রিবিউশন',
        daysUnit: 'দিন',
        sessionsUnit: 'বিল্ড আপডেট',
        eventsUnit: 'কন্ট্রিবিউশন',
        heatmapTitle: 'কোডিং অ্যাক্টিভিটি গ্রাফ (গত ৩৬ সপ্তাহ)',
        lessLabel: 'কম',
        moreLabel: 'বেশি',
        hoverHint: 'যেকোনো দিনের বিস্তারিত দেখতে হোভার বা ট্যাপ করুন',
        noActivityDay: 'বিশ্রাম / পড়াশোনার দিন',
        techFootprintLabel: 'প্রজেক্ট টেক স্ট্যাক বিন্যাস',
        connectGithubHint: 'লাইভ গিটহাব কমিট অটো-সিঙ্ক করতে অ্যাডমিন → সোশ্যাল লিংকে গিটহাব যুক্ত করুন।',
      },
    },
    gallery: {
      sectionLabel: '০৫. ভিজ্যুয়াল আর্কাইভ',
      heading: 'ভিজ্যুয়াল গ্যালারি',
      subtitle: 'ডিজাইন স্টাডি, ৩ডি ভিজ্যুয়াল, ইন্টারফেস ফ্রেম এবং সৃজনশীল চিত্রকর্ম।',
      allCategories: 'সবগুলো',
      openFullscreen: 'পূর্ণ পর্দায় দেখুন',
      closeViewer: 'ভিউয়ার বন্ধ করুন',
      previousImage: 'আগের ছবি',
      nextImage: 'পরের ছবি',
      emptyCategory: 'এখনো কোনো গ্যালারি ছবি যুক্ত করা হয়নি।',
      categories: {
        design: 'ডিজাইন',
        development: 'ডেভেলপমেন্ট',
        '3d': '৩ডি ও স্পেশাল',
        photography: 'ফটোগ্রাফি',
        other: 'সৃজনশীল',
      },
    },
    qr: {
      sectionLabel: '০৬. ডিজিটাল পরিচয় পাস',
      heading: 'সরাসরি পোর্টফোলিও কিউআর',
      subtitle: 'যেকোনো মোবাইল থেকে এই লাইভ REIVON VALE ওয়েবসাইটটি খুলতে স্ক্যান করুন অথবা PNG ডাউনলোড করুন।',
      liveUrlLabel: 'লাইভ ইউআরএল',
      downloadPng: 'QR PNG ডাউনলোড',
      copyUrl: 'লিংক কপি করুন',
      copied: 'কপি হয়েছে',
      scanHint: 'প্রোডাকশন ইউআরএল পরিবর্তন হলে কিউআর কোড স্বয়ংক্রিয়ভাবে আপডেট হয়।',
    },
    contact: {
      sectionLabel: '০৭. সরাসরি বার্তা',
      heading: 'যোগাযোগ করুন',
      subtitle: 'কোনো প্রজেক্ট, ধারণা বা কাজের জন্য REIVON VALE-কে সরাসরি বার্তা পাঠান।',
      nameLabel: 'আপনার নাম',
      namePlaceholder: 'আপনার পূর্ণ নাম লিখুন',
      emailLabel: 'ইমেইল ঠিকানা',
      emailPlaceholder: 'you@example.com',
      subjectLabel: 'বিষয়',
      subjectPlaceholder: 'প্রজেক্ট বা আলোচনার বিষয়',
      messageLabel: 'বার্তা',
      messagePlaceholder: 'আপনার প্রজেক্ট বা বার্তার বিস্তারিত লিখুন...',
      sendButton: 'বার্তা পাঠান',
      sending: 'পাঠানো হচ্ছে...',
      successTitle: 'বার্তা পাঠানো হয়েছে',
      successBody: 'যোগাযোগ করার জন্য ধন্যবাদ। আপনার বার্তাটি নিরাপদে REIVON VALE ইনবক্সে সংরক্ষিত হয়েছে।',
      sendAnother: 'আরেকটি বার্তা পাঠান',
      socialHeading: 'অফিসিয়াল চ্যানেলসমূহ',
      errors: {
        invalid_name: 'অনুগ্রহ করে আপনার নাম লিখুন (কমপক্ষে ২ অক্ষর)।',
        invalid_email: 'অনুগ্রহ করে একটি সঠিক ইমেইল ঠিকানা দিন।',
        invalid_subject: 'অনুগ্রহ করে বার্তার বিষয় লিখুন (কমপক্ষে ২ অক্ষর)।',
        invalid_message: 'অনুগ্রহ করে কমপক্ষে ১০ অক্ষরের বার্তা লিখুন।',
        spam_detected: 'স্প্যাম সুরক্ষার কারণে বার্তাটি আটকানো হয়েছে।',
        cooldown: 'নতুন বার্তা পাঠানোর আগে অনুগ্রহ করে কয়েক সেকেন্ড অপেক্ষা করুন।',
        submit_failed: 'এই মুহূর্তে বার্তা পাঠানো যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।',
      },
    },
    footer: {
      adminPortal: 'অ্যাডমিন পোর্টাল',
      backToTop: 'উপরে ফিরুন',
    },
    admin: {
      title: 'REIVON VALE অ্যাডমিন',
      subtitle: 'মালিক ড্যাশবোর্ড ও কনটেন্ট ম্যানেজার',
      backToSite: 'পোর্টফোলিওতে ফিরুন',
      signInWithGoogle: 'মালিকের গুগল অ্যাকাউন্টে লগইন',
      signOut: 'লগ আউট',
      unauthorizedTitle: 'প্রবেশাধিকার নেই — শুধুমাত্র অ্যাডমিন',
      unauthorizedDesc: 'শুধুমাত্র webrokib@gmail.com দিয়েই অ্যাডমিন লগইন করা যাবে। অন্য কোনো গুগল অ্যাকাউন্ট অনুমোদিত নয় এবং স্বয়ংক্রিয়ভাবে লগ আউট করা হয়েছে।',
      ownerOnlyNotice: 'অ্যাডমিন লগইন শুধুমাত্র webrokib@gmail.com-এর জন্য সংরক্ষিত এবং সার্ভার-সাইড Firestore সিকিউরিটি রুল দিয়ে সুরক্ষিত। অন্য কোনো আইডি দিয়ে লগইন করা যাবে না।',
      allowedAccountLabel: 'অনুমোদিত অ্যাডমিন জিমেইল',
      rejectedAccountPrefix: 'অননুমোদিত অ্যাকাউন্ট বাতিল করা হয়েছে:',
      tabs: {
        overview: 'সারাংশ',
        profile: 'পরিচিতি ও প্রোফাইল',
        skills: 'দক্ষতা',
        projects: 'প্রজেক্ট',
        gallery: 'গ্যালারি',
        social: 'সোশ্যাল লিংক',
        messages: 'বার্তাসমূহ',
        settings: 'সেটিংস ও এসইও',
      },
      saveChanges: 'পরিবর্তন সংরক্ষণ',
      saving: 'সংরক্ষণ হচ্ছে...',
      saved: 'সংরক্ষিত',
      addNew: 'নতুন যোগ করুন',
      edit: 'সম্পাদনা',
      delete: 'মুছুন',
      cancel: 'বাতিল',
      confirmDelete: 'মুছে ফেলুন',
      seedDefaults: 'প্রাথমিক ডেটা ডাটাবেসে সিঙ্ক করুন',
    },
  },
};
