# REIVON VALE — Premium Personal Portfolio

A production-ready, dark-mode + 3D personal portfolio platform for **REIVON VALE** (*"Creating Digital Experiences."*), built with **React, TypeScript, Vite, Tailwind CSS, Motion, Three.js**, live **Firebase Firestore & Auth** (pre-configured for instant hosted operation), and a complete **Supabase PostgreSQL + RLS + Storage** deployment package ready for GitHub and Vercel.

---

## Key Features

- **3D Interactive Hero**: Procedural 8-part Three.js kinetic polyhedral sculpture with PBR reflections (`RoomEnvironment`), instanced starfield dust, pointer parallax damping, `prefers-reduced-motion` support, and automatic software-WebGL / mobile optimization.
- **Bilingual Interface (`English` & `বাংলা`)**: Instant navigation switcher persisted in `localStorage`, translating UI copy and supporting bilingual admin-managed content.
- **Editable About Me & Skills**: Full Name, Profile Picture, Intro, Biography, Location, Interests, Goals, and 6 domain skill cards (with zero fake skill percentages or invented achievements).
- **Filterable Projects Showcase**: Browse by *Websites*, *Android Applications*, *AI Projects*, *UI/UX Designs*, and *Other Creative Projects* with featured ordering and detail modals.
- **Visual Gallery & Fullscreen Lightbox**: Category filtering, keyboard-accessible fullscreen viewer (`ESC`, `←`, `→`), validated image uploads, and client-side WebP/JPEG compression.
- **Dynamic Live QR Code**: Generates a scannable QR code directly from the real production URL (auto-updating whenever changed in Admin Settings or `VITE_SITE_URL`) with one-click PNG download.
- **Working Contact System**: Validation, honeypot anti-spam trap, cooldown throttling, and strict PII isolation (public create-only, owner-only read/manage).
- **Separate Secure Admin Dashboard (`/admin`)**: Owner-only authentication enforced by database security rules — public visitors cannot create admin accounts or modify content.
- **SEO & Production Ready**: Semantic HTML, dynamic title/meta sync, Open Graph tags, JSON-LD `Person` schema, `public/robots.txt`, `public/sitemap.xml`, custom SVG favicon, and `vercel.json`.

---

## Project Structure

```text
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql   # Full PostgreSQL tables, RLS policies & Storage bucket
├── src/
│   ├── components/
│   │   ├── admin/                   # Secure Owner Admin Dashboard & CMS Tabs
│   │   ├── AboutSection.tsx
│   │   ├── ContactSection.tsx
│   │   ├── Footer.tsx
│   │   ├── GallerySection.tsx
│   │   ├── HeroCanvas3D.tsx         # Three.js procedural 3D sculpture
│   │   ├── HeroSection.tsx
│   │   ├── Navbar.tsx
│   │   ├── Preloader.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── QrCodeSection.tsx
│   │   ├── SafeImage.tsx
│   │   └── SkillsSection.tsx
│   ├── data/
│   │   ├── defaults.ts              # Clearly marked editable placeholders & official social links
│   │   └── translations.ts          # English & বাংলা dictionary
│   ├── lib/
│   │   ├── firebase.ts              # Firebase Auth + Firestore setup
│   │   ├── imageUpload.ts           # Validated image optimization & Storage upload
│   │   ├── portfolioService.ts      # Live CRUD repository
│   │   └── supabase.ts              # Supabase client & Storage bucket adapter
│   ├── types/portfolio.ts
│   └── utils/
│       ├── validators.ts            # Pure validation, URL safety & filtering
│       └── validators.test.ts       # Automated unit tests
├── firestore.rules                  # Hardened Firestore Security Rules
├── firebase-blueprint.json          # Schema blueprint
├── vercel.json                      # Vercel SPA routing & security headers
└── .env.example                     # Safe environment variable template
```

---

## Local Development

```bash
npm install
cp .env.example .env
npm run dev
```

Run unit tests and production build verification:

```bash
npx --yes tsx --test src/utils/validators.test.ts
npm run lint
npm run build
```

---

## Beginner Setup & Deployment Guide (From an Android Smartphone)

You can publish and manage **REIVON VALE** completely from your Android phone using Chrome (no PC required):

### Step 1: Create Your GitHub Repository
1. Open [github.com](https://github.com) in Chrome on your Android phone and sign in (or create a free account).
2. Tap **+** → **New repository**, name it `reivon-vale`, and tap **Create repository**.
3. Export or upload this project folder into your new GitHub repository.

### Step 2: Set Up Supabase (Optional for Standalone PostgreSQL + Storage)
1. Open [supabase.com](https://supabase.com) in Chrome and tap **New Project**.
2. Choose a strong database password and wait ~2 minutes for provisioning.
3. Open **SQL Editor** → **New query**, copy the entire contents of `supabase/migrations/001_initial_schema.sql`, and tap **Run**.
4. Open **Authentication** → **Users** → **Add user** and create your single owner login account (email + strong password).
5. Open **Authentication** → **Providers** → **Email** and turn **OFF** *"Allow new users to sign up"* so visitors can never register admin accounts.
6. Copy your new user's **UUID** from **Authentication → Users**, return to **SQL Editor**, and run:
   ```sql
   insert into public.admin_users (user_id, email)
   values ('PASTE-YOUR-USER-UUID-HERE', 'your-email@example.com');
   ```
7. Go to **Project Settings** → **API** and copy your **Project URL** and **anon public key** (never copy the `service_role` secret into frontend variables!).

### Step 3: Deploy Live to Vercel
1. Open [vercel.com](https://vercel.com) in Chrome and sign in with GitHub.
2. Tap **Add New** → **Project** → import your `reivon-vale` repository.
3. Under **Environment Variables**, add:
   - `VITE_SITE_URL` = your live Vercel URL (e.g. `https://reivon-vale.vercel.app`)
   - `VITE_SUPABASE_URL` = your Supabase Project URL (if using Supabase)
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon public key (if using Supabase)
4. Tap **Deploy**. Within ~60 seconds your live website is online with HTTPS!

### Step 4: Customize Your Portfolio from Your Phone
1. Open your live site and tap **Admin** in the navigation menu (or visit `/admin`).
2. Sign in with your authorized owner account.
3. Click **Sync Starter Data to Database** once, then edit your **About Me**, **Profile Picture**, **Skills**, **Projects**, **Gallery**, **Social Links**, and **Settings & SEO** directly from your mobile browser.
4. Your **Direct Portfolio QR** section will automatically reflect your live production URL and let you download a print-ready PNG anytime.
