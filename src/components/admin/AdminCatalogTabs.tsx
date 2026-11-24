import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Upload, Save, X } from 'lucide-react';
import { SafeImage } from '../SafeImage';
import { TechStackBadges } from '../TechStackBadges';
import { processAndUploadImage } from '../../lib/imageUpload';
import {
  saveSkill,
  deleteSkill,
  saveProject,
  deleteProject,
  saveGalleryItem,
  deleteGalleryItem,
  createSafeDocId,
} from '../../lib/portfolioService';
import { parseTagInput } from '../../utils/validators';
import { resolveProjectTechStack } from '../../utils/techStack';
import type {
  SkillIconKey,
  SkillItem,
  ProjectCategory,
  ProjectItem,
  ProjectStatus,
  GalleryCategory,
  GalleryItem,
} from '../../types/portfolio';
import type { TranslationDictionary } from '../../data/translations';

const SKILL_ICONS: SkillIconKey[] = [
  'code',
  'smartphone',
  'layout',
  'cpu',
  'palette',
  'globe',
  'layers',
  'shield',
];

export function AdminSkillsTab({
  skills,
  t,
  onSaved,
}: {
  skills: SkillItem[];
  t: TranslationDictionary;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<SkillItem | null>(null);
  const [focusRaw, setFocusRaw] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setEditing({
      id: createSafeDocId('skill'),
      titleEn: '',
      titleBn: '',
      descriptionEn: '',
      descriptionBn: '',
      iconKey: 'code',
      focusAreasEn: [],
      sortOrder: skills.length + 1,
    });
    setFocusRaw('');
    setError(null);
  };

  const openEdit = (item: SkillItem) => {
    setEditing({ ...item });
    setFocusRaw(item.focusAreasEn.join(', '));
    setError(null);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await saveSkill({
        ...editing,
        focusAreasEn: parseTagInput(focusRaw, 6),
      });
      await onSaved();
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save skill.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteSkill(id);
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete skill.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-white">{t.admin.tabs.skills}</h2>
        <button
          type="button"
          onClick={openNew}
          className="btn-electric inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.addNew}</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-sm text-rose-200">
          {error}
        </div>
      )}

      {editing && (
        <form onSubmit={handleSave} className="glass-panel rounded-2xl p-6 space-y-4 border-cyan-400/30">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-cyan-300">Edit Skill</h3>
            <button type="button" onClick={() => setEditing(null)} aria-label={t.admin.cancel} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Skill Title (EN)"
              value={editing.titleEn}
              onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <input
              type="text"
              required
              placeholder="Skill Title (বাংলা)"
              value={editing.titleBn}
              onChange={(e) => setEditing({ ...editing, titleBn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <textarea
              rows={2}
              required
              placeholder="Description (EN)"
              value={editing.descriptionEn}
              onChange={(e) => setEditing({ ...editing, descriptionEn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <textarea
              rows={2}
              required
              placeholder="Description (বাংলা)"
              value={editing.descriptionBn}
              onChange={(e) => setEditing({ ...editing, descriptionBn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <select
              value={editing.iconKey}
              onChange={(e) => setEditing({ ...editing, iconKey: e.target.value as SkillIconKey })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            >
              {SKILL_ICONS.map((icon) => (
                <option key={icon} value={icon}>
                  Icon: {icon}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Focus areas (comma-separated, up to 6)"
              value={focusRaw}
              onChange={(e) => setFocusRaw(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-electric inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? t.admin.saving : t.admin.saveChanges}</span>
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#0b152c]"
            >
              {t.admin.cancel}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {skills.map((skill) => (
          <div key={skill.id} className="glass-panel rounded-2xl p-5 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="font-display text-sm font-bold text-white">{skill.titleEn}</p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{skill.descriptionEn}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openEdit(skill)}
                aria-label={`Edit ${skill.titleEn}`}
                className="p-2 rounded-lg bg-[#0b152c] hover:bg-blue-600/30 text-sky-300"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(skill.id)}
                aria-label={`Delete ${skill.titleEn}`}
                className="p-2 rounded-lg bg-[#0b152c] hover:bg-rose-600/30 text-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminProjectsTab({
  projects,
  t,
  onSaved,
}: {
  projects: ProjectItem[];
  t: TranslationDictionary;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [techRaw, setTechRaw] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setIsNew(true);
    setEditing({
      id: createSafeDocId('proj'),
      titleEn: '',
      titleBn: '',
      thumbnailUrl: '',
      descriptionEn: '',
      descriptionBn: '',
      category: 'websites',
      technologies: [],
      liveDemoUrl: '',
      githubUrl: '',
      status: 'in_progress',
      featured: false,
      isPlaceholder: false,
      sortOrder: projects.length + 1,
    });
    setTechRaw('');
    setError(null);
  };

  const openEdit = (item: ProjectItem) => {
    setIsNew(false);
    setEditing({ ...item });
    setTechRaw(item.technologies.join(', '));
    setError(null);
  };

  const handleThumbUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    setError(null);
    try {
      const url = await processAndUploadImage(file, 'projects', 1200);
      setEditing({ ...editing, thumbnailUrl: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Thumbnail upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await saveProject(
        {
          ...editing,
          technologies: parseTagInput(techRaw, 12),
        },
        isNew
      );
      await onSaved();
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save project.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteProject(id);
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete project.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-white">{t.admin.tabs.projects}</h2>
        <button
          type="button"
          onClick={openNew}
          className="btn-electric inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.addNew}</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-sm text-rose-200">
          {error}
        </div>
      )}

      {editing && (
        <form onSubmit={handleSave} className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-cyan-300">
              {isNew ? 'Add Project' : 'Edit Project'}
            </h3>
            <button type="button" onClick={() => setEditing(null)} aria-label={t.admin.cancel} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Project Title (EN)"
              value={editing.titleEn}
              onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <input
              type="text"
              required
              placeholder="Project Title (বাংলা)"
              value={editing.titleBn}
              onChange={(e) => setEditing({ ...editing, titleBn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <select
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value as ProjectCategory })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            >
              <option value="websites">Websites</option>
              <option value="ai">Web Applications</option>
              <option value="android">Mobile Apps</option>
              <option value="uiux">UI/UX Designs</option>
              <option value="other">Creative Projects</option>
            </select>
            <select
              value={editing.status}
              onChange={(e) => setEditing({ ...editing, status: e.target.value as ProjectStatus })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            >
              <option value="live">Live</option>
              <option value="in_progress">In Progress</option>
              <option value="concept">Concept</option>
              <option value="archived">Archived</option>
            </select>

            <textarea
              rows={3}
              required
              placeholder="Description (EN)"
              value={editing.descriptionEn}
              onChange={(e) => setEditing({ ...editing, descriptionEn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <textarea
              rows={3}
              required
              placeholder="Description (বাংলা)"
              value={editing.descriptionBn}
              onChange={(e) => setEditing({ ...editing, descriptionBn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />

            <div className="md:col-span-2 space-y-2">
              <input
                type="text"
                placeholder="Technologies (comma-separated, e.g. React, Firebase, Tailwind)"
                value={techRaw}
                onChange={(e) => setTechRaw(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
              />
              <TechStackBadges
                badges={resolveProjectTechStack({
                  ...editing,
                  technologies: parseTagInput(techRaw, 12),
                })}
                heading={t.projects.techStackLabel}
                variant="preview"
              />
            </div>

            <input
              type="url"
              placeholder="Live Demo URL (https://...)"
              value={editing.liveDemoUrl}
              onChange={(e) => setEditing({ ...editing, liveDemoUrl: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <input
              type="url"
              placeholder="GitHub URL (https://github.com/...)"
              value={editing.githubUrl}
              onChange={(e) => setEditing({ ...editing, githubUrl: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />

            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Upload Thumbnail'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleThumbUpload}
                  className="sr-only"
                />
              </label>
              <input
                type="text"
                placeholder="Or paste Thumbnail URL"
                value={editing.thumbnailUrl}
                onChange={(e) => setEditing({ ...editing, thumbnailUrl: e.target.value })}
                className="flex-1 min-w-[200px] px-3.5 py-2 rounded-lg bg-[#040814] border border-sky-400/20 text-xs text-slate-200"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={(e) => setEditing({ ...editing, featured: e.target.checked })}
                className="accent-cyan-400"
              />
              <span>Featured Project</span>
            </label>

            <label className="inline-flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
              <input
                type="checkbox"
                checked={editing.isPlaceholder}
                onChange={(e) => setEditing({ ...editing, isPlaceholder: e.target.checked })}
                className="accent-cyan-400"
              />
              <span>Mark as Editable Placeholder</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-electric inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? t.admin.saving : t.admin.saveChanges}</span>
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#0b152c]"
            >
              {t.admin.cancel}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project) => (
          <div key={project.id} className="glass-panel rounded-2xl p-4 flex items-center gap-4">
            <div className="w-20 h-16 rounded-xl overflow-hidden bg-[#040814] shrink-0">
              <SafeImage src={project.thumbnailUrl} alt={project.titleEn} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm font-bold text-white truncate">{project.titleEn}</p>
              <p className="text-xs text-slate-400 mt-0.5">
                {project.category} · {project.status} {project.featured ? '· Featured' : ''}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => openEdit(project)}
                aria-label={`Edit ${project.titleEn}`}
                className="p-2 rounded-lg bg-[#0b152c] hover:bg-blue-600/30 text-sky-300"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(project.id)}
                aria-label={`Delete ${project.titleEn}`}
                className="p-2 rounded-lg bg-[#0b152c] hover:bg-rose-600/30 text-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AdminGalleryTab({
  items,
  t,
  onSaved,
}: {
  items: GalleryItem[];
  t: TranslationDictionary;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<GalleryItem | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setIsNew(true);
    setEditing({
      id: createSafeDocId('gal'),
      titleEn: '',
      titleBn: '',
      captionEn: '',
      captionBn: '',
      imageUrl: '',
      category: 'design',
      isPlaceholder: false,
      sortOrder: items.length + 1,
    });
    setError(null);
  };

  const openEdit = (item: GalleryItem) => {
    setIsNew(false);
    setEditing({ ...item });
    setError(null);
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    setError(null);
    try {
      const url = await processAndUploadImage(file, 'gallery', 1280);
      setEditing({ ...editing, imageUrl: url });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing || !editing.imageUrl.trim()) {
      setError('Please upload an image or provide an image URL.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveGalleryItem(editing, isNew);
      await onSaved();
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save gallery item.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteGalleryItem(id);
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete gallery item.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-white">{t.admin.tabs.gallery}</h2>
        <button
          type="button"
          onClick={openNew}
          className="btn-electric inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
        >
          <Plus className="w-4 h-4" />
          <span>{t.admin.addNew}</span>
        </button>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-sm text-rose-200">
          {error}
        </div>
      )}

      {editing && (
        <form onSubmit={handleSave} className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-cyan-300">
              {isNew ? 'Upload Gallery Image' : 'Edit Gallery Image'}
            </h3>
            <button type="button" onClick={() => setEditing(null)} aria-label={t.admin.cancel} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              required
              placeholder="Title (EN)"
              value={editing.titleEn}
              onChange={(e) => setEditing({ ...editing, titleEn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <input
              type="text"
              required
              placeholder="Title (বাংলা)"
              value={editing.titleBn}
              onChange={(e) => setEditing({ ...editing, titleBn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <input
              type="text"
              placeholder="Caption (EN)"
              value={editing.captionEn}
              onChange={(e) => setEditing({ ...editing, captionEn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <input
              type="text"
              placeholder="Caption (বাংলা)"
              value={editing.captionBn}
              onChange={(e) => setEditing({ ...editing, captionBn: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <select
              value={editing.category}
              onChange={(e) => setEditing({ ...editing, category: e.target.value as GalleryCategory })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            >
              <option value="design">Design</option>
              <option value="development">Development</option>
              <option value="3d">3D & Spatial</option>
              <option value="photography">Photography</option>
              <option value="other">Other</option>
            </select>

            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/90 hover:bg-blue-500 text-xs font-semibold text-white cursor-pointer">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Uploading...' : 'Select Image'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleUpload}
                  className="sr-only"
                />
              </label>
              <input
                type="text"
                placeholder="Or paste Image URL"
                value={editing.imageUrl}
                onChange={(e) => setEditing({ ...editing, imageUrl: e.target.value })}
                className="flex-1 min-w-[180px] px-3.5 py-2 rounded-lg bg-[#040814] border border-sky-400/20 text-xs text-slate-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="btn-electric inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? t.admin.saving : t.admin.saveChanges}</span>
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#0b152c]"
            >
              {t.admin.cancel}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="glass-panel rounded-2xl overflow-hidden flex flex-col">
            <div className="aspect-[4/3] bg-[#040814]">
              <SafeImage src={item.imageUrl} alt={item.titleEn} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">{item.titleEn}</p>
                <p className="text-xs text-slate-400">{item.category}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label={`Edit ${item.titleEn}`}
                  className="p-2 rounded-lg bg-[#0b152c] hover:bg-blue-600/30 text-sky-300"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Delete ${item.titleEn}`}
                  className="p-2 rounded-lg bg-[#0b152c] hover:bg-rose-600/30 text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
