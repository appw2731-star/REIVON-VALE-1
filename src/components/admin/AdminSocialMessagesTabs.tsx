import { useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Save, X, MailOpen, CheckCheck } from 'lucide-react';
import {
  saveSocialLink,
  deleteSocialLink,
  updateContactMessageStatus,
  deleteContactMessage,
  createSafeDocId,
} from '../../lib/portfolioService';
import type {
  SocialLinkItem,
  SocialPlatform,
  ContactMessageItem,
  MessageStatus,
} from '../../types/portfolio';
import type { TranslationDictionary } from '../../data/translations';

const PLATFORMS: SocialPlatform[] = [
  'facebook',
  'instagram',
  'tiktok',
  'telegram',
  'github',
  'linkedin',
  'youtube',
  'x',
  'custom',
];

export function AdminSocialTab({
  links,
  t,
  onSaved,
}: {
  links: SocialLinkItem[];
  t: TranslationDictionary;
  onSaved: () => Promise<void>;
}) {
  const [editing, setEditing] = useState<SocialLinkItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const openNew = () => {
    setEditing({
      id: createSafeDocId('social'),
      platform: 'custom',
      label: '',
      url: 'https://',
      visible: true,
      sortOrder: links.length + 1,
    });
    setError(null);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.url.startsWith('https://')) {
      setError('Social URL must begin with https://');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await saveSocialLink(editing);
      await onSaved();
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save social link.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    try {
      await deleteSocialLink(id);
      await onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete social link.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-white">{t.admin.tabs.social}</h2>
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
            <h3 className="font-display text-base font-bold text-cyan-300">Edit Social Link</h3>
            <button type="button" onClick={() => setEditing(null)} aria-label={t.admin.cancel} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={editing.platform}
              onChange={(e) => setEditing({ ...editing, platform: e.target.value as SocialPlatform })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <input
              type="text"
              required
              placeholder="Display Label"
              value={editing.label}
              onChange={(e) => setEditing({ ...editing, label: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
            <input
              type="url"
              required
              placeholder="https://..."
              value={editing.url}
              onChange={(e) => setEditing({ ...editing, url: e.target.value })}
              className="px-3.5 py-2.5 rounded-xl bg-[#040814] border border-sky-400/20 text-sm text-white"
            />
          </div>
          <label className="inline-flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
            <input
              type="checkbox"
              checked={editing.visible}
              onChange={(e) => setEditing({ ...editing, visible: e.target.checked })}
              className="accent-cyan-400"
            />
            <span>Visible on public website</span>
          </label>
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

      <div className="space-y-3">
        {links.map((link) => (
          <div key={link.id} className="glass-panel rounded-2xl p-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white">
                {link.label}{' '}
                <span className="text-xs font-normal text-slate-400">
                  · {link.visible ? 'Visible' : 'Hidden'}
                </span>
              </p>
              <p className="text-xs text-cyan-300/80 truncate">{link.url}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setEditing({ ...link })}
                aria-label={`Edit ${link.label}`}
                className="p-2 rounded-lg bg-[#0b152c] hover:bg-blue-600/30 text-sky-300"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(link.id)}
                aria-label={`Delete ${link.label}`}
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

export function AdminMessagesTab({
  messages,
  t,
  onReloadMessages,
}: {
  messages: ContactMessageItem[];
  t: TranslationDictionary;
  onReloadMessages: () => Promise<void>;
}) {
  const [error, setError] = useState<string | null>(null);

  const setStatus = async (id: string, status: MessageStatus) => {
    setError(null);
    try {
      await updateContactMessageStatus(id, status);
      await onReloadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update message status.');
    }
  };

  const remove = async (id: string) => {
    setError(null);
    try {
      await deleteContactMessage(id);
      await onReloadMessages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete message.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-white">{t.admin.tabs.messages}</h2>
        <span className="text-xs font-mono-tabular text-slate-400">
          {messages.length} total
        </span>
      </div>

      {error && (
        <div role="alert" className="p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-sm text-rose-200">
          {error}
        </div>
      )}

      {messages.length === 0 ? (
        <div className="glass-panel rounded-2xl p-10 text-center text-sm text-slate-400">
          No contact messages received yet.
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <article key={msg.id} className="glass-panel rounded-2xl p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className={msg.status === 'unread' ? 'text-cyan-400 font-semibold' : 'text-slate-400'}>
                      {msg.status}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{msg.email}</span>
                    {msg.createdAt && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono-tabular">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="font-display text-base font-bold text-white">{msg.subject}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">From: {msg.name}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {msg.status !== 'read' && (
                    <button
                      type="button"
                      onClick={() => setStatus(msg.id, 'read')}
                      aria-label={`Mark ${msg.subject} as read`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b152c] hover:bg-blue-600/30 text-xs text-sky-300"
                    >
                      <MailOpen className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>
                  )}
                  {msg.status !== 'replied' && (
                    <button
                      type="button"
                      onClick={() => setStatus(msg.id, 'replied')}
                      aria-label={`Mark ${msg.subject} as replied`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0b152c] hover:bg-cyan-600/30 text-xs text-cyan-300"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Replied</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(msg.id)}
                    aria-label={`Delete message from ${msg.name}`}
                    className="p-2 rounded-lg bg-[#0b152c] hover:bg-rose-600/30 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="mt-4 pt-4 border-t border-sky-400/10 text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {msg.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
