import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, QrCode } from 'lucide-react';
import { Magnetic } from './MagneticWrapper';
import { resolveProductionUrl } from '../utils/validators';
import type { SiteSettingsData } from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';

interface QrCodeSectionProps {
  t: TranslationDictionary;
  siteSettings: SiteSettingsData;
}

export function QrCodeSection({ t, siteSettings }: QrCodeSectionProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const liveUrl = resolveProductionUrl(
    siteSettings.productionUrl,
    import.meta.env.VITE_SITE_URL as string | undefined,
    typeof window !== 'undefined' ? window.location.origin : ''
  );

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(liveUrl, {
      width: 512,
      margin: 2,
      errorCorrectionLevel: 'H',
      color: {
        dark: '#080810',
        light: '#FFFFFF',
      },
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch((err) => {
        console.error('QR generation failed:', err);
      });

    return () => {
      active = false;
    };
  }, [liveUrl]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${(siteSettings.brandName || 'reivon-vale').toLowerCase().replace(/\s+/g, '-')}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(liveUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard denied in non-secure context
    }
  };

  return (
    <section id="qr" className="relative py-20 sm:py-24">
      <div aria-hidden="true" className="chrome-divider h-px w-full absolute top-0 inset-x-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-chrome rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#00D9FF] mb-2.5">
              {t.qr.sectionLabel}
            </p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-chrome tracking-tight">
              {t.qr.heading}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#C8C8D8] leading-relaxed max-w-xl">
              {t.qr.subtitle}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-[#080810] border border-[#C8C8D8]/16">
              <p className="text-xs text-[#C8C8D8]/70 mb-1">{t.qr.liveUrlLabel}</p>
              <p
                data-testid="qr-live-url"
                className="font-mono-tabular text-xs sm:text-sm text-[#00D9FF] break-all"
              >
                {liveUrl}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <Magnetic>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={!qrDataUrl}
                  className="btn-electric inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-50 whitespace-nowrap shrink-0"
                >
                  <Download className="w-4 h-4" aria-hidden="true" />
                  <span>{t.qr.downloadPng}</span>
                </button>
              </Magnetic>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="btn-chrome inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white whitespace-nowrap shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#00D9FF]" aria-hidden="true" />
                    <span>{t.qr.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#00D9FF]" aria-hidden="true" />
                    <span>{t.qr.copyUrl}</span>
                  </>
                )}
              </button>
            </div>

            <p className="mt-4 text-xs text-[#C8C8D8]/70">{t.qr.scanHint}</p>
          </div>

          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="p-[2px] rounded-3xl bg-gradient-to-br from-[#00D9FF] via-[#C8C8D8] to-[#741BFF] shadow-[0_20px_54px_-14px_rgba(116,27,255,0.65)]">
              <div className="p-4 rounded-[22px] bg-white">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Code for ${liveUrl}`}
                    data-testid="qr-preview-img"
                    className="w-48 h-48 sm:w-56 sm:h-56 block"
                  />
                ) : (
                  <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-slate-100 text-slate-500">
                    <QrCode className="w-10 h-10" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>
            <p className="mt-3.5 text-xs font-semibold tracking-[0.26em] text-[#C8C8D8]">
              {siteSettings.brandName}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
