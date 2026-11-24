import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Upload, Save, Check } from 'lucide-react';
import { SafeImage } from '../SafeImage';
import { processAndUploadImage } from '../../lib/imageUpload';
import { saveProfile, saveSiteSettings } from '../../lib/portfolioService';
import { parseTagInput } from '../../utils/validators';
import type { ProfileData, SiteSettingsData } from '../../types/portfolio';
import type { TranslationDictionary } from '../../data/translations';

interface ProfileTabProps {
  profile: ProfileData;
  t: TranslationDictionary;
  onSaved: () => Promise<void>;
}

export function AdminProfileTab({ profile, t, onSaved }: ProfileTabProps) {
  const [form, setForm] = useState({
    ...profile,
    interestsEnRaw: profile.interestsEn.join(', '),
    interestsBnRaw: profile.interestsBn.join(', '),
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorMsg(null);
    setUploading(true);
    try {
      const url = await processAndUploadImage(file, 'profiles', 900);
      setForm((prev) => ({ ...prev, profileImageUrl: url }));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setStatusMsg(null);
    try {
      await saveProfile({
        fullName: form.fullName,
        fullNameBn: form.fullNameBn,
        profileImageUrl: form.profileImageUrl,
        taglineEn: form.taglineEn,
        taglineBn: form.taglineBn,
        introEn: form.introEn,
        introBn: form.introBn,
        bioEn: form.bioEn,
        bioBn: form.bioBn,
        locationEn: form.locationEn,
        locationBn: form.locationBn,
        institutionEn: form.institutionEn,
        institutionBn: form.institutionBn,
        academicYearEn: form.academicYearEn,
        academicYearBn: form.academicYearBn,
        currentSemesterEn: form.currentSemesterEn,
        currentSemesterBn: form.currentSemesterBn,
        departmentEn: form.departmentEn,
        departmentBn: form.departmentBn,
        interestsEn: parseTagInput(form.interestsEnRaw, 12),
        interestsBn: parseTagInput(form.interestsBnRaw, 12),
        goalsEn: form.goalsEn,
        goalsBn: form.goalsBn,
      });
      await onSaved();
      setStatusMsg(t.admin.saved);
      window.setTimeout(() => setStatusMsg(null), 2500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-white">{t.admin.tabs.profile}</h2>
        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-electric inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
        >
          {statusMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saving ? t.admin.saving : statusMsg || t.admin.saveChanges}</span>
        </button>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/30 text-sm text-rose-200">
          {errorMsg}
        </div>
      )}

      {/* Profile Image Upload & Preview */}
      <div className="glass-panel rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
        <div className="w-24 h-24 rounded-2xl overflow-hidden border border-sky-400/25 shrink-0 bg-[#040814]">
          <SafeImage src={form.profileImageUrl} alt={form.fullName} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 w-full space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer">
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{uploading ? 'Uploading...' : 'Upload Profile Picture'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleImageUpload}
                className="sr-only"
              />
            </label>
          </div>
          <input
            type="text"
            value={form.profileImageUrl}
            onChange={(e) => setForm((p) => ({ ...p, profileImageUrl: e.target.value }))}
            placeholder="Or paste HTTPS image URL"
            aria-label="Profile image URL"
            className="w-full px-3.5 py-2 rounded-lg bg-[#040814] border border-sky-400/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name (EN)</label>
          <input
            type="text"
            required
            maxLength={120}
            value={form.fullName}
            onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name (বাংলা)</label>
          <input
            type="text"
            required
            maxLength={120}
            value={form.fullNameBn}
            onChange={(e) => setForm((p) => ({ ...p, fullNameBn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tagline (EN)</label>
          <input
            type="text"
            required
            maxLength={180}
            value={form.taglineEn}
            onChange={(e) => setForm((p) => ({ ...p, taglineEn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Tagline (বাংলা)</label>
          <input
            type="text"
            required
            maxLength={180}
            value={form.taglineBn}
            onChange={(e) => setForm((p) => ({ ...p, taglineBn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location (EN, optional)</label>
          <input
            type="text"
            maxLength={120}
            value={form.locationEn}
            onChange={(e) => setForm((p) => ({ ...p, locationEn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Location (বাংলা, optional)</label>
          <input
            type="text"
            maxLength={120}
            value={form.locationBn}
            onChange={(e) => setForm((p) => ({ ...p, locationBn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="md:col-span-2 pt-3 border-t border-sky-400/10">
          <h3 className="text-sm font-semibold text-cyan-400">Academic Identity (Optional)</h3>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Institute (EN)</label>
          <input
            type="text"
            maxLength={160}
            value={form.institutionEn}
            onChange={(e) => setForm((p) => ({ ...p, institutionEn: e.target.value }))}
            placeholder="Bogra Polytechnic Institute"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Institute (বাংলা)</label>
          <input
            type="text"
            maxLength={160}
            value={form.institutionBn}
            onChange={(e) => setForm((p) => ({ ...p, institutionBn: e.target.value }))}
            placeholder="বগুড়া সরকারি পলিটেকনিক ইনস্টিটিউট"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Student Status / Year (EN)</label>
          <input
            type="text"
            maxLength={100}
            value={form.academicYearEn}
            onChange={(e) => setForm((p) => ({ ...p, academicYearEn: e.target.value }))}
            placeholder="1st Year Student"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Student Status / Year (বাংলা)</label>
          <input
            type="text"
            maxLength={100}
            value={form.academicYearBn}
            onChange={(e) => setForm((p) => ({ ...p, academicYearBn: e.target.value }))}
            placeholder="১ম বর্ষের ছাত্র"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Semester (EN)</label>
          <input
            type="text"
            maxLength={100}
            value={form.currentSemesterEn}
            onChange={(e) => setForm((p) => ({ ...p, currentSemesterEn: e.target.value }))}
            placeholder="1st Semester"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Semester (বাংলা)</label>
          <input
            type="text"
            maxLength={100}
            value={form.currentSemesterBn}
            onChange={(e) => setForm((p) => ({ ...p, currentSemesterBn: e.target.value }))}
            placeholder="১ম সেমিস্টার"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Major / Department (EN)</label>
          <input
            type="text"
            maxLength={100}
            value={form.departmentEn}
            onChange={(e) => setForm((p) => ({ ...p, departmentEn: e.target.value }))}
            placeholder="Power Department"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Major / Department (বাংলা)</label>
          <input
            type="text"
            maxLength={100}
            value={form.departmentBn}
            onChange={(e) => setForm((p) => ({ ...p, departmentBn: e.target.value }))}
            placeholder="পাওয়ার ডিপার্টমেন্ট"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Introduction (EN)</label>
          <textarea
            rows={3}
            required
            maxLength={800}
            value={form.introEn}
            onChange={(e) => setForm((p) => ({ ...p, introEn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Introduction (বাংলা)</label>
          <textarea
            rows={3}
            required
            maxLength={800}
            value={form.introBn}
            onChange={(e) => setForm((p) => ({ ...p, introBn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Personal Biography (EN)</label>
          <textarea
            rows={4}
            required
            maxLength={2400}
            value={form.bioEn}
            onChange={(e) => setForm((p) => ({ ...p, bioEn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Personal Biography (বাংলা)</label>
          <textarea
            rows={4}
            required
            maxLength={2400}
            value={form.bioBn}
            onChange={(e) => setForm((p) => ({ ...p, bioBn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Interests (EN, comma-separated)</label>
          <input
            type="text"
            value={form.interestsEnRaw}
            onChange={(e) => setForm((p) => ({ ...p, interestsEnRaw: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Interests (বাংলা, comma-separated)</label>
          <input
            type="text"
            value={form.interestsBnRaw}
            onChange={(e) => setForm((p) => ({ ...p, interestsBnRaw: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Goals (EN)</label>
          <textarea
            rows={3}
            maxLength={1200}
            value={form.goalsEn}
            onChange={(e) => setForm((p) => ({ ...p, goalsEn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Goals (বাংলা)</label>
          <textarea
            rows={3}
            maxLength={1200}
            value={form.goalsBn}
            onChange={(e) => setForm((p) => ({ ...p, goalsBn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>
    </form>
  );
}

interface SettingsTabProps {
  settings: SiteSettingsData;
  t: TranslationDictionary;
  onSaved: () => Promise<void>;
}

export function AdminSettingsTab({ settings, t, onSaved }: SettingsTabProps) {
  const [form, setForm] = useState({ ...settings });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErrorMsg(null);
    try {
      const url = await processAndUploadImage(file, 'branding', 512);
      setForm((prev) => ({ ...prev, logoImageUrl: url }));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Logo upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      await saveSiteSettings({
        brandName: form.brandName,
        logoText: form.logoText,
        logoImageUrl: form.logoImageUrl,
        productionUrl: form.productionUrl,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        seoKeywords: form.seoKeywords,
        ogImageUrl: form.ogImageUrl,
        footerNoteEn: form.footerNoteEn,
        footerNoteBn: form.footerNoteBn,
      });
      await onSaved();
      setStatusMsg(t.admin.saved);
      window.setTimeout(() => setStatusMsg(null), 2500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-white">{t.admin.tabs.settings}</h2>
        <button
          type="submit"
          disabled={saving || uploading}
          className="btn-electric inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60"
        >
          {statusMsg ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saving ? t.admin.saving : statusMsg || t.admin.saveChanges}</span>
        </button>
      </div>

      {errorMsg && (
        <div role="alert" className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/30 text-sm text-rose-200">
          {errorMsg}
        </div>
      )}

      <div className="glass-panel rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Brand Name</label>
          <input
            type="text"
            required
            maxLength={80}
            value={form.brandName}
            onChange={(e) => setForm((p) => ({ ...p, brandName: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Header Logo Text</label>
          <input
            type="text"
            required
            maxLength={40}
            value={form.logoText}
            onChange={(e) => setForm((p) => ({ ...p, logoText: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Custom Logo Image (optional — leave blank for RV monogram)
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer">
              <Upload className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{uploading ? 'Uploading...' : 'Upload Logo'}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleLogoUpload}
                className="sr-only"
              />
            </label>
            <input
              type="text"
              value={form.logoImageUrl}
              onChange={(e) => setForm((p) => ({ ...p, logoImageUrl: e.target.value }))}
              placeholder="HTTPS logo image URL"
              className="flex-1 min-w-[220px] px-3.5 py-2 rounded-lg bg-[#040814] border border-sky-400/20 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Live Production URL (updates Dynamic QR Code automatically — leave empty for auto-detect)
          </label>
          <input
            type="url"
            maxLength={300}
            value={form.productionUrl}
            onChange={(e) => setForm((p) => ({ ...p, productionUrl: e.target.value }))}
            placeholder="https://reivonvale.vercel.app"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="md:col-span-2 pt-3 border-t border-sky-400/10">
          <h3 className="text-sm font-semibold text-cyan-400 mb-3">SEO & Metadata</h3>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">SEO Page Title</label>
          <input
            type="text"
            required
            maxLength={120}
            value={form.seoTitle}
            onChange={(e) => setForm((p) => ({ ...p, seoTitle: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">SEO Meta Description</label>
          <textarea
            rows={2}
            required
            maxLength={320}
            value={form.seoDescription}
            onChange={(e) => setForm((p) => ({ ...p, seoDescription: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">SEO Keywords</label>
          <input
            type="text"
            maxLength={300}
            value={form.seoKeywords}
            onChange={(e) => setForm((p) => ({ ...p, seoKeywords: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Open Graph Preview Image URL</label>
          <input
            type="text"
            value={form.ogImageUrl}
            onChange={(e) => setForm((p) => ({ ...p, ogImageUrl: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Footer Note (EN)</label>
          <input
            type="text"
            maxLength={240}
            value={form.footerNoteEn}
            onChange={(e) => setForm((p) => ({ ...p, footerNoteEn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Footer Note (বাংলা)</label>
          <input
            type="text"
            maxLength={240}
            value={form.footerNoteBn}
            onChange={(e) => setForm((p) => ({ ...p, footerNoteBn: e.target.value }))}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>
    </form>
  );
}
