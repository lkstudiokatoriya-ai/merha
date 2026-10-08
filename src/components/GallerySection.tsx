import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Maximize2, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useVillage } from '../context/VillageContext';
import { GalleryCategory } from '../types/village';
import { ResilientImage } from './ResilientImage';

const CATEGORIES: GalleryCategory[] = [
  'All',
  'Village',
  'River',
  'Bridge',
  'Nature',
  'Hills',
  'Fields',
  'Festivals',
  'School',
];

export const GallerySection: React.FC = () => {
  const { data, openAdminAt, isAdminAuthenticated } = useVillage();
  const { gallery } = data;
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredGallery =
    activeCategory === 'All'
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % filteredGallery.length
        );
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + filteredGallery.length) % filteredGallery.length
        );
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredGallery.length]);

  const currentLightboxItem =
    lightboxIndex !== null ? filteredGallery[lightboxIndex] : null;

  return (
    <section
      id="gallery"
      className="py-20 sm:py-28 border-b border-stone-200 dark:border-white/10 bg-[#F3EFE6] dark:bg-[#09181F] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              06 &nbsp;·&nbsp; Visual Archive & Landscapes
            </p>
            <h2
              className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
              style={{ textWrap: 'balance' }}
            >
              Merha Village Gallery (ग्राम चित्र दीर्घा)
            </h2>
            <p className="mt-3 text-base text-stone-600 dark:text-stone-300">
              Explore visual perspectives of Merha Village, the Kurar River, bridge, Katoria hills, agricultural fields, festivals, and school life. Every photo URL can be updated or expanded in the Content Studio.
            </p>
          </div>

          {isAdminAuthenticated && (
            <button
              type="button"
              onClick={() => openAdminAt('gallery')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 dark:border-white/15 text-xs font-medium text-stone-700 dark:text-stone-200 hover:border-amber-500/50 transition-colors self-start lg:self-auto cursor-pointer whitespace-nowrap"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              <span>Add / Replace Photos</span>
            </button>
          )}
        </div>

        {/* Interactive Category Filter Bar (Functional Segmented Buttons) */}
        <div
          role="tablist"
          aria-label="Gallery categories"
          className="mt-8 flex items-center gap-1.5 overflow-x-auto pb-2 no-scrollbar"
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setActiveCategory(category);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                    : 'bg-white/70 dark:bg-white/[0.04] text-stone-700 dark:text-stone-300 hover:bg-stone-200/70 dark:hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Photo Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredGallery.map((item, idx) => (
            <motion.figure
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              onClick={() => setLightboxIndex(idx)}
              className={`group relative rounded-2xl overflow-hidden border border-stone-200 dark:border-white/10 bg-stone-900 cursor-pointer ${
                idx === 0 && activeCategory === 'All'
                  ? 'sm:col-span-2 sm:row-span-2 min-h-[320px] sm:min-h-[440px]'
                  : 'h-64'
              }`}
            >
              <ResilientImage
                src={item.image}
                alt={item.title}
                fallbackLabel={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 backdrop-blur-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>

              <figcaption className="absolute bottom-4 left-4 right-4 text-left">
                <p className="text-[11px] uppercase tracking-wider text-amber-300 font-medium">
                  {item.category}
                </p>
                <h3 className="text-lg font-bold font-display text-white leading-snug mt-0.5">
                  {item.title}
                </h3>
                <p className="text-xs font-hindi text-stone-300 mt-0.5">
                  {item.titleHi}
                </p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>

      {/* Full-Screen Lightbox Modal */}
      <AnimatePresence>
        {currentLightboxItem && lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-label={currentLightboxItem.title}
            onClick={() => setLightboxIndex(null)}
          >
            <div
              className="relative max-w-5xl w-full bg-[#0A181E] border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative h-[55vh] sm:h-[68vh] bg-black flex items-center justify-center">
                <ResilientImage
                  src={currentLightboxItem.image}
                  alt={currentLightboxItem.title}
                  fallbackLabel={currentLightboxItem.title}
                  className="max-h-full max-w-full object-contain"
                  containerClassName="w-full h-full"
                />

                {/* Prev / Next Controls */}
                {filteredGallery.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex(
                          (lightboxIndex - 1 + filteredGallery.length) %
                            filteredGallery.length
                        )
                      }
                      aria-label="Previous image"
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setLightboxIndex((lightboxIndex + 1) % filteredGallery.length)
                      }
                      aria-label="Next image"
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => setLightboxIndex(null)}
                  aria-label="Close full-screen view"
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white border border-white/15 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-amber-400">
                    <span>{currentLightboxItem.category}</span>
                    <span>·</span>
                    <span className="font-mono-tabular">
                      {lightboxIndex + 1} / {filteredGallery.length}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white mt-1">
                    {currentLightboxItem.title} &nbsp;
                    <span className="text-base font-hindi text-amber-300 font-normal">
                      ({currentLightboxItem.titleHi})
                    </span>
                  </h3>
                  <p className="text-sm text-stone-300 mt-1">
                    {currentLightboxItem.caption}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
