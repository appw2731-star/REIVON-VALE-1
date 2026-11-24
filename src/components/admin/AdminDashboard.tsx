import { useCallback, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import {
  ArrowLeft,
  LogOut,
  ShieldCheck,
  ShieldAlert,
  LayoutDashboard,
  UserCircle2,
  Cpu,
  FolderKanban,
  Images,
  Share2,
  Inbox,
  Settings,
  Database,
} from 'lucide-react';
import { auth, googleProvider, OWNER_EMAIL } from '../../lib/firebase';
import { isAuthorizedOwnerAccount } from '../../utils/adminAuth';
import { fetchContactMessages, seedDefaultsToDatabase } from '../../lib/portfolioService';
import { AdminProfileTab, AdminSettingsTab } from './AdminProfileSettingsTabs';
import { AdminSkillsTab, AdminProjectsTab, AdminGalleryTab } from './AdminCatalogTabs';
import { AdminSocialTab, AdminMessagesTab } from './AdminSocialMessagesTabs';
import type { ContactMessageItem, PortfolioSnapshot } from '../../types/portfolio';
import type { TranslationDictionary } from '../../data/translations';

type AdminTab =
  | 'overview'
  | 'profile'
  | 'skills'
  | 'projects'
  | 'gallery'
  | 'social'
  | 'messages'
  | 'settings';

interface AdminDashboardProps {
  t: TranslationDictionary;
  data: PortfolioSnapshot;
  onRefreshData: () => Promise<void>;
  onBackToSite: () => void;
}

export function AdminDashboard({
  t,
  data,
  onRefreshData,
  onBackToSite,
}: AdminDashboardProps) {
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [rejectedEmail, setRejectedEmail] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [seeding, setSeeding] = useState(false);
  const [seedDone, setSeedDone] = useState(false);

  const loadMessages = useCallback(async () => {
    try {
      const list = await fetchContactMessages();
      setMessages(list);
    } catch {
      setMessages([]);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setIsAuthorized(false);
        setAuthLoading(false);
        return;
      }

      if (isAuthorizedOwnerAccount(currentUser)) {
        setUser(currentUser);
        setIsAuthorized(true);
        setRejectedEmail(null);
        setAuthError(null);
        setAuthLoading(false);
        return;
      }

      // Immediately revoke session for any account other than verified webrokib@gmail.com
      const attemptedEmail = currentUser.email ?? 'Unknown account';
      setRejectedEmail(attemptedEmail);
      setIsAuthorized(false);
      setUser(null);
      setMessages([]);
      setAuthLoading(false);
      try {
        await signOut(auth);
      } catch {
        // Ignore signOut cleanup errors; user remains unauthorized in UI and Firestore rules
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      void loadMessages();
    }
  }, [isAuthorized, loadMessages]);

  const handleGoogleSignIn = async () => {
    setAuthError(null);
    setRejectedEmail(null);
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      if (!isAuthorizedOwnerAccount(credential.user)) {
        const attemptedEmail = credential.user.email ?? 'Unknown account';
        setRejectedEmail(attemptedEmail);
        setIsAuthorized(false);
        setUser(null);
        setMessages([]);
        await signOut(auth);
      }
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Sign-in failed.');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setMessages([]);
    setIsAuthorized(false);
    setRejectedEmail(null);
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    setSeedDone(false);
    try {
      await seedDefaultsToDatabase();
      await onRefreshData();
      setSeedDone(true);
      window.setTimeout(() => setSeedDone(false), 3000);
    } finally {
      setSeeding(false);
    }
  };

  // Auth Gate (Loading / Unauthenticated / Unauthorized)
  if (authLoading || !user || !isAuthorized) {
    return (
      <div className="min-h-screen bg-[#080810] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-chrome rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <span className="font-display text-sm font-bold tracking-[0.2em] text-[#00D9FF]">
              {data.siteSettings.brandName}
            </span>
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#C8C8D8] hover:text-white"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t.admin.backToSite}</span>
            </button>
          </div>

          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-5 ${
              rejectedEmail
                ? 'bg-rose-500/15 border-rose-400/35 text-rose-300'
                : 'bg-[#741BFF]/20 border-[#C8C8D8]/25 text-[#00D9FF]'
            }`}
          >
            {rejectedEmail ? (
              <ShieldAlert className="w-6 h-6" aria-hidden="true" />
            ) : (
              <ShieldCheck className="w-6 h-6" aria-hidden="true" />
            )}
          </div>

          <h1 className="font-display text-2xl font-bold text-white">
            {rejectedEmail ? t.admin.unauthorizedTitle : t.admin.title}
          </h1>

          <p className="mt-2.5 text-sm text-[#C8C8D8] leading-relaxed">
            {authLoading
              ? 'Verifying authorization...'
              : rejectedEmail
              ? t.admin.unauthorizedDesc
              : t.admin.ownerOnlyNotice}
          </p>

          <div
            data-testid="admin-owner-lock-notice"
            className="mt-4 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-[#C8C8D8]/16 text-xs text-[#C8C8D8] flex items-center justify-between gap-2"
          >
            <span>{t.admin.allowedAccountLabel}</span>
            <span className="font-mono-tabular font-semibold text-[#00D9FF] truncate">
              {OWNER_EMAIL}
            </span>
          </div>

          {rejectedEmail && (
            <div
              role="alert"
              data-testid="admin-rejected-alert"
              className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-xs text-rose-200 leading-relaxed"
            >
              {t.admin.rejectedAccountPrefix}{' '}
              <span className="font-mono-tabular font-semibold text-white">{rejectedEmail}</span>
            </div>
          )}

          {authError && (
            <div role="alert" className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-400/30 text-xs text-rose-200">
              {authError}
            </div>
          )}

          <div className="mt-6 space-y-3">
            {!authLoading && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="btn-electric w-full py-3 px-5 rounded-xl text-sm font-semibold text-white"
              >
                {t.admin.signInWithGoogle}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  const tabs: Array<{ id: AdminTab; label: string; icon: typeof LayoutDashboard; count?: number }> = [
    { id: 'overview', label: t.admin.tabs.overview, icon: LayoutDashboard },
    { id: 'profile', label: t.admin.tabs.profile, icon: UserCircle2 },
    { id: 'skills', label: t.admin.tabs.skills, icon: Cpu, count: data.skills.length },
    { id: 'projects', label: t.admin.tabs.projects, icon: FolderKanban, count: data.projects.length },
    { id: 'gallery', label: t.admin.tabs.gallery, icon: Images, count: data.gallery.length },
    { id: 'social', label: t.admin.tabs.social, icon: Share2, count: data.socialLinks.length },
    { id: 'messages', label: t.admin.tabs.messages, icon: Inbox, count: unreadCount },
    { id: 'settings', label: t.admin.tabs.settings, icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#080810] text-white">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 h-16 bg-[#080810]/95 border-b border-[#C8C8D8]/14">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#C8C8D8] hover:text-[#00D9FF] whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.admin.backToSite}</span>
            </button>
            <span className="text-[#C8C8D8]/40 hidden sm:inline" aria-hidden="true">/</span>
            <h1 className="font-display text-sm sm:text-base font-bold text-white truncate">
              {t.admin.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="hidden md:inline text-xs text-[#C8C8D8]/75 font-mono-tabular">
              {user.email}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="btn-chrome inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.admin.signOut}</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-3">
          <nav aria-label="Admin sections" className="glass-panel rounded-2xl p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-gradient-to-r from-[#741BFF] to-[#267BFF] text-white'
                      : 'text-[#C8C8D8] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </span>
                  {typeof tab.count === 'number' && tab.count > 0 && (
                    <span className="font-mono-tabular text-xs opacity-80">{tab.count}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Active Panel */}
        <main className="lg:col-span-9 min-w-0">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-white">
                    {t.admin.tabs.overview}
                  </h2>
                  <p className="text-sm text-slate-400 mt-1">{t.admin.subtitle}</p>
                </div>

                <button
                  type="button"
                  onClick={handleSeedDefaults}
                  disabled={seeding}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-200 bg-[#0b152c] hover:bg-[#122245] border border-sky-400/25 disabled:opacity-60"
                >
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>{seeding ? 'Syncing...' : seedDone ? 'Starter Data Synced' : t.admin.seedDefaults}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="glass-panel rounded-2xl p-5">
                  <p className="text-xs text-slate-400">Skills</p>
                  <p className="mt-2 font-mono-tabular text-3xl font-bold text-white">
                    {data.skills.length}
                  </p>
                </div>
                <div className="glass-panel rounded-2xl p-5">
                  <p className="text-xs text-slate-400">Projects</p>
                  <p className="mt-2 font-mono-tabular text-3xl font-bold text-white">
                    {data.projects.length}
                  </p>
                </div>
                <div className="glass-panel rounded-2xl p-5">
                  <p className="text-xs text-slate-400">Gallery Images</p>
                  <p className="mt-2 font-mono-tabular text-3xl font-bold text-white">
                    {data.gallery.length}
                  </p>
                </div>
                <div className="glass-panel rounded-2xl p-5">
                  <p className="text-xs text-slate-400">Unread Messages</p>
                  <p className="mt-2 font-mono-tabular text-3xl font-bold text-cyan-400">
                    {unreadCount}
                  </p>
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-6">
                <h3 className="font-display text-base font-bold text-white mb-2">
                  Owner Security Status
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Authenticated as <span className="font-mono-tabular text-cyan-300">{user.email}</span>.
                  All administrative mutations are verified server-side by Firestore Security Rules.
                  Contact submissions are strictly private to your admin inbox.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <AdminProfileTab profile={data.profile} t={t} onSaved={onRefreshData} />
          )}

          {activeTab === 'skills' && (
            <AdminSkillsTab skills={data.skills} t={t} onSaved={onRefreshData} />
          )}

          {activeTab === 'projects' && (
            <AdminProjectsTab projects={data.projects} t={t} onSaved={onRefreshData} />
          )}

          {activeTab === 'gallery' && (
            <AdminGalleryTab items={data.gallery} t={t} onSaved={onRefreshData} />
          )}

          {activeTab === 'social' && (
            <AdminSocialTab links={data.socialLinks} t={t} onSaved={onRefreshData} />
          )}

          {activeTab === 'messages' && (
            <AdminMessagesTab messages={messages} t={t} onReloadMessages={loadMessages} />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab settings={data.siteSettings} t={t} onSaved={onRefreshData} />
          )}
        </main>
      </div>
    </div>
  );
}
