import { useState, type FormEvent } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import { SocialIcon } from './SocialIcons';
import { Magnetic } from './MagneticWrapper';
import {
  validateContactForm,
  checkSpamCooldown,
  extractSocialHandle,
  isSafeHttpUrl,
} from '../utils/validators';
import { submitContactMessage } from '../lib/portfolioService';
import type { SocialLinkItem } from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';

interface ContactSectionProps {
  t: TranslationDictionary;
  socialLinks: SocialLinkItem[];
}

export function ContactSection({ t, socialLinks }: ContactSectionProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number | null>(null);

  const visibleSocials = socialLinks.filter((s) => s.visible && isSafeHttpUrl(s.url));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!checkSpamCooldown(lastSubmittedAt, Date.now(), 20000)) {
      setSubmitError(t.contact.errors.cooldown);
      return;
    }

    const validation = validateContactForm({ name, email, subject, message, honeypot });
    if (!validation.valid) {
      setErrors(validation.errors);
      if (validation.errors.spam) {
        setSubmitError(t.contact.errors.spam_detected);
      }
      return;
    }

    setErrors({});
    setSubmitting(true);
    try {
      await submitContactMessage({ name, email, subject, message });
      setLastSubmittedAt(Date.now());
      setSubmitted(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch {
      setSubmitError(t.contact.errors.submit_failed);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-16 py-20 sm:py-28 bg-[#0A0A16]/75 overflow-hidden">
      <div aria-hidden="true" className="chrome-divider h-px w-full absolute top-0 inset-x-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(116,27,255,0.16),transparent_50%),radial-gradient(ellipse_at_15%_85%,rgba(0,217,255,0.12),transparent_48%)]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#00D9FF] mb-2.5">
            {t.contact.sectionLabel}
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-chrome tracking-tight">
            {t.contact.heading}
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-[#C8C8D8] leading-relaxed">
            {t.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Futuristic Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-7 glass-chrome rounded-3xl p-6 sm:p-8"
          >
            {submitted ? (
              <div
                data-testid="contact-success"
                role="status"
                className="py-10 text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#00D9FF]/15 border border-[#00D9FF]/40 flex items-center justify-center text-[#00D9FF] mb-4">
                  <CheckCircle2 className="w-8 h-8" aria-hidden="true" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white">
                  {t.contact.successTitle}
                </h3>
                <p className="mt-2.5 text-sm text-[#C8C8D8] max-w-md">{t.contact.successBody}</p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="btn-electric mt-6 px-6 py-3 rounded-xl text-sm font-semibold text-white"
                >
                  {t.contact.sendAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Hidden Honeypot Anti-Spam Trap */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input
                    id="contact-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                {submitError && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/35 text-rose-200 text-sm"
                  >
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-semibold text-[#C8C8D8] mb-2">
                      {t.contact.nameLabel}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                      }}
                      placeholder={t.contact.namePlaceholder}
                      aria-invalid={Boolean(errors.name)}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#080810] border border-[#C8C8D8]/18 text-sm text-white placeholder:text-[#C8C8D8]/40 focus:outline-none focus:border-[#00D9FF] transition-colors"
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-rose-300">
                        {t.contact.errors.invalid_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-semibold text-[#C8C8D8] mb-2">
                      {t.contact.emailLabel}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      maxLength={160}
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                      }}
                      placeholder={t.contact.emailPlaceholder}
                      aria-invalid={Boolean(errors.email)}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#080810] border border-[#C8C8D8]/18 text-sm text-white placeholder:text-[#C8C8D8]/40 focus:outline-none focus:border-[#00D9FF] transition-colors"
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs text-rose-300">
                        {t.contact.errors.invalid_email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-semibold text-[#C8C8D8] mb-2">
                    {t.contact.subjectLabel}
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    maxLength={180}
                    value={subject}
                    onChange={(e) => {
                      setSubject(e.target.value);
                      if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }));
                    }}
                    placeholder={t.contact.subjectPlaceholder}
                    aria-invalid={Boolean(errors.subject)}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#080810] border border-[#C8C8D8]/18 text-sm text-white placeholder:text-[#C8C8D8]/40 focus:outline-none focus:border-[#00D9FF] transition-colors"
                  />
                  {errors.subject && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      {t.contact.errors.invalid_subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-semibold text-[#C8C8D8] mb-2">
                    {t.contact.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    required
                    maxLength={3000}
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (errors.message) setErrors((prev) => ({ ...prev, message: '' }));
                    }}
                    placeholder={t.contact.messagePlaceholder}
                    aria-invalid={Boolean(errors.message)}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#080810] border border-[#C8C8D8]/18 text-sm text-white placeholder:text-[#C8C8D8]/40 focus:outline-none focus:border-[#00D9FF] transition-colors resize-y"
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs text-rose-300">
                      {t.contact.errors.invalid_message}
                    </p>
                  )}
                </div>

                <Magnetic>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-electric inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white disabled:opacity-60 w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4" aria-hidden="true" />
                    <span>{submitting ? t.contact.sending : t.contact.sendButton}</span>
                  </button>
                </Magnetic>
              </form>
            )}
          </motion.div>

          {/* Direct Official Social Channels */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="lg:col-span-5 glass-chrome rounded-3xl p-6 sm:p-8"
          >
            <h3 className="font-display text-lg font-bold text-white mb-5">
              {t.contact.socialHeading}
            </h3>

            <div className="space-y-3.5">
              {visibleSocials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-[#0B0B17] hover:bg-[#141428] border border-[#C8C8D8]/14 hover:border-[#00D9FF]/45 transition-all group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="w-11 h-11 rounded-xl bg-[#131326] border border-[#C8C8D8]/18 flex items-center justify-center shrink-0">
                      <SocialIcon platform={social.platform} brandColored className="w-6 h-6" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white">{social.label}</p>
                      <p className="text-xs text-[#C8C8D8]/80 font-mono-tabular truncate max-w-[200px] sm:max-w-[240px]">
                        {extractSocialHandle(social.url, social.label)}
                      </p>
                    </div>
                  </div>
                  <ExternalLink
                    className="w-4 h-4 text-[#C8C8D8]/70 group-hover:text-[#00D9FF] shrink-0 transition-colors"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
