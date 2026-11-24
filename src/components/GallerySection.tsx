import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { SafeImage } from './SafeImage';
import { filterGalleryByCategory } from '../utils/validators';
import type { GalleryCategory, GalleryItem, Language } from '../types/portfolio';
import type { TranslationDictionary } from '../data/translations';

interface GallerySectionProps {
  lang: Language;
  t: TranslationDictionary;
  items: GalleryItem[];
}

const GALLERY_CATEGORIES: Array<GalleryCategory | 'all'> = [
  'all',
  'design',
  'development',
  '3d',
  'photography',
  'other',
];

export function GallerySection({ lang, t, items }: GallerySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory | 'all'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const publishedItems = items.filter((item) => !item.isPlaceholder);
  const visibleItems = filterGalleryByCategory(publishedItems, selectedCategory);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % visibleItems.length));
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev - 1 + visibleItems.length) % visibleItems.length
        );
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIndex, visibleItems.length]);

  const activeItem = lightboxIndex !== null ? visibleItems[lightboxIndex] : null;

  return (
    <section id="gallery" className="relative scroll-mt-16 py-20 sm:py-28 bg-[#0A0A16]/70">
      <div aria-hidden="true" className="chrome-divider h-px w-full absolute top-0 inset-x-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#00D9FF] mb-2.5">
              {t.gallery.sectionLabel}
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-chrome tracking-tight">
              {t.gallery.heading}
            </h2>
            <p className="mt-3.5 text-sm sm:text-base text-[#C8C8D8] leading-relaxed">
              {t.gallery.subtitle}
            </p>
          </div>

          {publishedItems.length > 0 && (
            <div className="overflow-x-auto pb-1 -mx-1 px-1">
              <div
                role="tablist"
                aria-label={t.gallery.heading}
                className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-[#101020] border border-[#C8C8D8]/16"
              >
                {GALLERY_CATEGORIES.map((cat) => {
                  const label = cat === 'all' ? t.gallery.allCategories : t.gallery.categories[cat];
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setLightboxIndex(null);
                      }}
                      className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF] ${
                        active
                          ? 'bg-gradient-to-r from-[#741BFF] to-[#267BFF] text-white'
                          : 'text-[#C8C8D8]/80 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {visibleItems.length === 0 ? (
          <div className="glass-panel rounded-3xl p-12 text-center text-sm text-[#C8C8D8]">
            {t.gallery.emptyCategory}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visibleItems.map((item, idx) => {
              const title = lang === 'bn' ? item.titleBn : item.titleEn;
              const caption = lang === 'bn' ? item.captionBn : item.captionEn;

              return (
                <motion.figure
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.42, delay: idx * 0.05 }}
                  className="group glass-chrome glass-panel-hover rounded-3xl overflow-hidden flex flex-col"
                >
                  <button
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={`${t.gallery.openFullscreen}: ${title}`}
                    className="relative aspect-[4/3] w-full overflow-hidden bg-[#0B0B17] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00D9FF]"
                  >
                    <SafeImage
                      src={item.imageUrl}
                      alt={title}
                      fallbackTitle={title}
                      className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-[#080810]/85 border border-[#C8C8D8]/25 text-white flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:border-[#00D9FF]/60 transition-all">
                      <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                    </span>
                  </button>
                  <figcaption className="p-4 flex-1 flex flex-col">
                    <p className="text-xs text-[#00D9FF] font-semibold mb-1">
                      {t.gallery.categories[item.category]}
                    </p>
                    <p className="font-display text-sm font-bold text-white">{title}</p>
                    {caption && (
                      <p className="mt-1.5 text-xs text-[#C8C8D8]/80 leading-relaxed line-clamp-2">
                        {caption}
                      </p>
                    )}
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Viewer */}
      {activeItem && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lang === 'bn' ? activeItem.titleBn : activeItem.titleEn}
          className="fixed inset-0 z-50 bg-black/92 flex flex-col items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label={t.gallery.closeViewer}
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-[#111124] border border-[#C8C8D8]/30 text-white flex items-center justify-center hover:border-[#00D9FF] hover:bg-[#741BFF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {visibleItems.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex - 1 + visibleItems.length) % visibleItems.length);
                }}
                aria-label={t.gallery.previousImage}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#111124]/90 border border-[#C8C8D8]/30 text-white flex items-center justify-center hover:bg-[#741BFF] transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex((lightboxIndex + 1) % visibleItems.length);
                }}
                aria-label={t.gallery.nextImage}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#111124]/90 border border-[#C8C8D8]/30 text-white flex items-center justify-center hover:bg-[#741BFF] transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          <div
            className="max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-h-[74vh] w-full flex items-center justify-center overflow-hidden rounded-3xl border border-[#C8C8D8]/20 bg-[#080810]">
              <SafeImage
                src={activeItem.imageUrl}
                alt={lang === 'bn' ? activeItem.titleBn : activeItem.titleEn}
                fallbackTitle={activeItem.titleEn}
                loading="eager"
                className="max-h-[74vh] w-auto object-contain"
              />
            </div>

            <div className="mt-4 text-center max-w-2xl">
              <p className="text-xs text-[#00D9FF] font-semibold font-mono-tabular">
                {t.gallery.categories[activeItem.category]} · {lightboxIndex + 1} / {visibleItems.length}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold text-white">
                {lang === 'bn' ? activeItem.titleBn : activeItem.titleEn}
              </h3>
              {(lang === 'bn' ? activeItem.captionBn : activeItem.captionEn) && (
                <p className="mt-1.5 text-sm text-[#C8C8D8]">
                  {lang === 'bn' ? activeItem.captionBn : activeItem.captionEn}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
