-- =============================================================================
-- REIVON VALE — Complete Supabase PostgreSQL Schema, RLS Policies & Storage Setup
-- Run this SQL inside Supabase SQL Editor (Project -> SQL Editor -> New Query)
-- =============================================================================

create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. Authorized Admin Allowlist (Prevents Public Admin Self-Registration)
-- -----------------------------------------------------------------------------
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Helper function checked by all RLS write policies
create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

-- Only an admin can view their own row; nobody can insert/update/delete from client
create policy "admin_users_read_self"
  on public.admin_users for select
  to authenticated
  using (auth.uid() = user_id);

-- -----------------------------------------------------------------------------
-- 2. Profiles (Editable About Me & Hero Personal Information)
-- -----------------------------------------------------------------------------
create table if not exists public.profiles (
  id text primary key default 'main',
  owner_id uuid references public.admin_users(user_id) on delete set null,
  full_name text not null check (char_length(full_name) between 1 and 120),
  full_name_bn text not null default 'রেইভন ভেল' check (char_length(full_name_bn) between 1 and 120),
  profile_image_url text not null default '',
  tagline_en text not null default 'Creating Digital Experiences.',
  tagline_bn text not null default 'ডিজিটাল অভিজ্ঞতা তৈরি করছি।',
  intro_en text not null default '',
  intro_bn text not null default '',
  bio_en text not null default '',
  bio_bn text not null default '',
  location_en text not null default '',
  location_bn text not null default '',
  interests_en text[] not null default '{}',
  interests_bn text[] not null default '{}',
  goals_en text not null default '',
  goals_bn text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_public_read"
  on public.profiles for select
  using (true);

create policy "profiles_admin_write"
  on public.profiles for all
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

-- -----------------------------------------------------------------------------
-- 3. Skills (No Fake Percentages or Experience Bars)
-- -----------------------------------------------------------------------------
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  title_en text not null check (char_length(title_en) between 1 and 100),
  title_bn text not null check (char_length(title_bn) between 1 and 100),
  description_en text not null check (char_length(description_en) between 1 and 500),
  description_bn text not null check (char_length(description_bn) between 1 and 500),
  icon_key text not null default 'code'
    check (icon_key in ('code', 'smartphone', 'layout', 'cpu', 'palette', 'globe', 'layers', 'shield')),
  focus_areas_en text[] not null default '{}',
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.skills enable row level security;

create policy "skills_public_read"
  on public.skills for select
  using (true);

create policy "skills_admin_write"
  on public.skills for all
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

-- -----------------------------------------------------------------------------
-- 4. Projects Showcase
-- -----------------------------------------------------------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title_en text not null check (char_length(title_en) between 1 and 140),
  title_bn text not null check (char_length(title_bn) between 1 and 140),
  thumbnail_url text not null default '',
  description_en text not null check (char_length(description_en) between 1 and 1500),
  description_bn text not null check (char_length(description_bn) between 1 and 1500),
  category text not null check (category in ('websites', 'android', 'ai', 'uiux', 'other')),
  technologies text[] not null default '{}',
  live_demo_url text not null default '',
  github_url text not null default '',
  status text not null default 'in_progress'
    check (status in ('live', 'in_progress', 'concept', 'archived')),
  featured boolean not null default false,
  is_placeholder boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_projects_category on public.projects(category);
create index if not exists idx_projects_featured on public.projects(featured);

alter table public.projects enable row level security;

create policy "projects_public_read"
  on public.projects for select
  using (true);

create policy "projects_admin_write"
  on public.projects for all
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

-- -----------------------------------------------------------------------------
-- 5. Gallery (Backed by Supabase Storage Bucket)
-- -----------------------------------------------------------------------------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title_en text not null check (char_length(title_en) between 1 and 120),
  title_bn text not null check (char_length(title_bn) between 1 and 120),
  caption_en text not null default '' check (char_length(caption_en) <= 400),
  caption_bn text not null default '' check (char_length(caption_bn) <= 400),
  image_url text not null,
  storage_path text,
  category text not null default 'design'
    check (category in ('design', 'development', '3d', 'photography', 'other')),
  is_placeholder boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_gallery_category on public.gallery(category);

alter table public.gallery enable row level security;

create policy "gallery_public_read"
  on public.gallery for select
  using (true);

create policy "gallery_admin_write"
  on public.gallery for all
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

-- -----------------------------------------------------------------------------
-- 6. Social Links
-- -----------------------------------------------------------------------------
create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null
    check (platform in ('facebook', 'instagram', 'tiktok', 'telegram', 'github', 'linkedin', 'youtube', 'x', 'custom')),
  label text not null check (char_length(label) between 1 and 60),
  url text not null check (url ~ '^https://.+'),
  visible boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.social_links enable row level security;

create policy "social_links_public_read"
  on public.social_links for select
  using (true);

create policy "social_links_admin_write"
  on public.social_links for all
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

-- -----------------------------------------------------------------------------
-- 7. Contact Messages (Strict PII Isolation: Public Insert-Only, Admin Read/Manage)
-- -----------------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$'),
  subject text not null check (char_length(subject) between 2 and 180),
  message text not null check (char_length(message) between 10 and 3000),
  status text not null default 'unread' check (status in ('unread', 'read', 'replied')),
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_status on public.contact_messages(status);

alter table public.contact_messages enable row level security;

create policy "contact_messages_public_insert"
  on public.contact_messages for insert
  to anon, authenticated
  with check (status = 'unread');

create policy "contact_messages_admin_read"
  on public.contact_messages for select
  to authenticated
  using (public.is_site_admin());

create policy "contact_messages_admin_update"
  on public.contact_messages for update
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

create policy "contact_messages_admin_delete"
  on public.contact_messages for delete
  to authenticated
  using (public.is_site_admin());

-- -----------------------------------------------------------------------------
-- 8. Site Settings (Brand, Logo, Live Production URL for QR, SEO Metadata)
-- -----------------------------------------------------------------------------
create table if not exists public.site_settings (
  id text primary key default 'main',
  brand_name text not null default 'REIVON VALE',
  logo_text text not null default 'REIVON VALE',
  logo_image_url text not null default '',
  production_url text not null default '',
  seo_title text not null default 'REIVON VALE — Creating Digital Experiences',
  seo_description text not null default 'Personal digital portfolio of REIVON VALE.',
  seo_keywords text not null default 'REIVON VALE, Portfolio, Web Development, Android, AI, UI/UX',
  og_image_url text not null default '',
  footer_note_en text not null default 'REIVON VALE. Crafted with precision.',
  footer_note_bn text not null default 'রেইভন ভেল। যত্ন ও নিখুঁততায় নির্মিত।',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

create policy "site_settings_public_read"
  on public.site_settings for select
  using (true);

create policy "site_settings_admin_write"
  on public.site_settings for all
  to authenticated
  using (public.is_site_admin())
  with check (public.is_site_admin());

-- -----------------------------------------------------------------------------
-- 9. Supabase Storage Bucket & Policies (portfolio-media)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-media',
  'portfolio-media',
  true,
  5242880, -- 5 MB max upload
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do nothing;

create policy "portfolio_media_public_read"
  on storage.objects for select
  using (bucket_id = 'portfolio-media');

create policy "portfolio_media_admin_upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'portfolio-media' and public.is_site_admin());

create policy "portfolio_media_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_site_admin());

create policy "portfolio_media_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'portfolio-media' and public.is_site_admin());

-- -----------------------------------------------------------------------------
-- 10. Initial Seed Records (Official Social Links & Editable Placeholders)
-- -----------------------------------------------------------------------------
insert into public.social_links (platform, label, url, visible, sort_order)
values
  ('facebook', 'Facebook', 'https://www.facebook.com/profile.php?id=61595567000911', true, 1),
  ('instagram', 'Instagram', 'https://www.instagram.com/reivonvale?dlrf=MWN3cHV0cDZxaGV5OA==', true, 2),
  ('tiktok', 'TikTok', 'https://www.tiktok.com/@reivon.vale', true, 3),
  ('telegram', 'Telegram', 'https://t.me/reivonvale', true, 4)
on conflict do nothing;

-- IMPORTANT: After creating your single owner account in Supabase Auth -> Users,
-- disable "Allow new users to sign up" in Authentication -> Providers -> Email,
-- then register yourself as admin with:
--   insert into public.admin_users (user_id, email)
--   values ('YOUR-AUTH-USER-UUID', 'your-email@example.com');
