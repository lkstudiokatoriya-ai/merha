import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useVillage } from '../context/VillageContext';
import { ResilientImage } from './ResilientImage';
import { EditableText } from './EditableText';

export const HighlightsAndPlacesSection: React.FC = () => {
  const { data, updateData } = useVillage();
  const { highlights, importantPlaces } = data;
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>(
    importantPlaces[0]?.id || ''
  );

  const activePlaceIndex = Math.max(
    0,
    importantPlaces.findIndex((p) => p.id === selectedPlaceId)
  );
  const activePlace = importantPlaces[activePlaceIndex] || importantPlaces[0];

  return (
    <section
      id="places"
      className="py-20 sm:py-28 border-b border-stone-200 dark:border-white/10 bg-[#F3EFE6] dark:bg-[#09181F] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Part 1: Village Highlights (8 Signature Cards) */}
        <div className="max-w-3xl">
          <EditableText
            as="p"
            labelKey="highlights_kicker"
            defaultText="02 · Natural & Social Pillars"
            className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium"
          />
          <div className="mt-2">
            <EditableText
              as="h2"
              labelKey="highlights_heading"
              defaultText="Village Highlights (मेड़ा गांव की विशेषताएं)"
              className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
              style={{ textWrap: 'balance' }}
            />
          </div>
          <div className="mt-3">
            <EditableText
              as="p"
              multiline
              labelKey="highlights_intro"
              defaultText="From the life-giving waters of the Kurar River and its bridge to the forested hills of Katoria, discover the elements that shape daily life in Merha."
              className="text-base text-stone-600 dark:text-stone-300 leading-relaxed"
            />
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
              className="group rounded-2xl border border-stone-200/90 dark:border-white/10 bg-white dark:bg-[#0D1E25] overflow-hidden flex flex-col justify-between hover:border-amber-500/50 transition-all"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <ResilientImage
                    src={item.image}
                    alt={item.titleEn}
                    fallbackLabel={item.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-[11px] uppercase tracking-wider text-amber-300 font-medium">
                    {String(index + 1).padStart(2, '0')} &nbsp;·&nbsp;{' '}
                    <EditableText
                      value={item.category}
                      onChange={(val) => {
                        const next = [...highlights];
                        next[index] = { ...item, category: val };
                        updateData({ ...data, highlights: next });
                      }}
                    />
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <EditableText
                      as="h3"
                      value={item.titleEn}
                      onChange={(val) => {
                        const next = [...highlights];
                        next[index] = { ...item, titleEn: val };
                        updateData({ ...data, highlights: next });
                      }}
                      className="text-xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
                    />
                    <EditableText
                      value={item.titleHi}
                      onChange={(val) => {
                        const next = [...highlights];
                        next[index] = { ...item, titleHi: val };
                        updateData({ ...data, highlights: next });
                      }}
                      className="text-sm font-hindi text-amber-700 dark:text-amber-400 shrink-0"
                    />
                  </div>
                  <div className="mt-2.5">
                    <EditableText
                      as="p"
                      multiline
                      value={item.description}
                      onChange={(val) => {
                        const next = [...highlights];
                        next[index] = { ...item, description: val };
                        updateData({ ...data, highlights: next });
                      }}
                      className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="px-5 pb-4 pt-2 border-t border-stone-100 dark:border-white/5 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
                <span>Merha Heritage</span>
                <a
                  href="#gallery"
                  className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 hover:underline font-medium"
                >
                  <span>View Photos</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Part 2: Important Places in & Around Merha */}
        <div className="mt-24 pt-16 border-t border-stone-200 dark:border-white/10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <EditableText
                as="p"
                labelKey="places_kicker"
                defaultText="03 · Regional Geography & Connectivity"
                className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-medium"
              />
              <div className="mt-2">
                <EditableText
                  as="h2"
                  labelKey="places_heading"
                  defaultText="Important Places & Neighboring Belt (प्रमुख स्थान एवं पड़ोसी क्षेत्र)"
                  className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
                  style={{ textWrap: 'balance' }}
                />
              </div>
              <div className="mt-3">
                <EditableText
                  as="p"
                  multiline
                  labelKey="places_intro"
                  defaultText="Explore Merha Village alongside its vital river crossings, Panchayat headquarters in Jamdhaha, and neighboring localities of Domuhan, Manija, and Karjhausa."
                  className="text-base text-stone-600 dark:text-stone-300"
                />
              </div>
            </div>

            <a
              href="#map"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-white/15 text-xs font-medium text-stone-800 dark:text-stone-200 hover:border-amber-500/50 transition-colors self-start lg:self-auto whitespace-nowrap"
            >
              <EditableText
                labelKey="places_map_cta"
                defaultText="Locate on Interactive Map"
              />
              <ArrowUpRight className="w-4 h-4 text-amber-500" />
            </a>
          </div>

          {/* Interactive Spotlight + Cards Grid */}
          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Selector List */}
            <div className="lg:col-span-5 space-y-2.5">
              {importantPlaces.map((place, idx) => {
                const isSelected = place.id === activePlace?.id;
                return (
                  <div
                    key={place.id}
                    onClick={() => setSelectedPlaceId(place.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/15 shadow-sm'
                        : 'border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-[#0D1E25]/60 hover:border-amber-500/40'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <span className="font-mono-tabular">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <span>·</span>
                        <EditableText
                          value={place.relation}
                          onChange={(val) => {
                            const next = [...importantPlaces];
                            next[idx] = { ...place, relation: val };
                            updateData({ ...data, importantPlaces: next });
                          }}
                        />
                      </div>
                      <div className="mt-1 flex items-baseline gap-2.5">
                        <EditableText
                          value={place.nameEn}
                          onChange={(val) => {
                            const next = [...importantPlaces];
                            next[idx] = { ...place, nameEn: val };
                            updateData({ ...data, importantPlaces: next });
                          }}
                          className="text-lg font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
                        />
                        <EditableText
                          value={place.nameHi}
                          onChange={(val) => {
                            const next = [...importantPlaces];
                            next[idx] = { ...place, nameHi: val };
                            updateData({ ...data, importantPlaces: next });
                          }}
                          className="text-sm font-hindi text-amber-700 dark:text-amber-400"
                        />
                      </div>
                    </div>
                    <ArrowUpRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected
                          ? 'text-amber-500 translate-x-0.5 -translate-y-0.5'
                          : 'text-stone-400'
                      }`}
                    />
                  </div>
                );
              })}
            </div>

            {/* Right Visual Showcase Card for Selected Place + Full Overview Grid */}
            <div className="lg:col-span-7 space-y-6">
              {activePlace && (
                <div className="rounded-2xl border border-stone-200 dark:border-white/15 bg-white dark:bg-[#0D1E25] overflow-hidden shadow-lg">
                  <div className="relative h-64 sm:h-80">
                    <ResilientImage
                      src={activePlace.image}
                      alt={activePlace.nameEn}
                      fallbackLabel={activePlace.nameEn}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071318] via-[#071318]/30 to-transparent" />
                    <div className="absolute bottom-5 left-6 right-6">
                      <EditableText
                        as="p"
                        value={activePlace.relation}
                        onChange={(val) => {
                          const next = [...importantPlaces];
                          next[activePlaceIndex] = {
                            ...activePlace,
                            relation: val,
                          };
                          updateData({ ...data, importantPlaces: next });
                        }}
                        className="text-xs uppercase tracking-widest text-amber-300 font-medium"
                      />
                      <div className="mt-1 flex flex-wrap items-baseline gap-3">
                        <EditableText
                          as="h3"
                          value={activePlace.nameEn}
                          onChange={(val) => {
                            const next = [...importantPlaces];
                            next[activePlaceIndex] = {
                              ...activePlace,
                              nameEn: val,
                            };
                            updateData({ ...data, importantPlaces: next });
                          }}
                          className="text-3xl sm:text-4xl font-bold font-display text-white"
                        />
                        <EditableText
                          value={activePlace.nameHi}
                          onChange={(val) => {
                            const next = [...importantPlaces];
                            next[activePlaceIndex] = {
                              ...activePlace,
                              nameHi: val,
                            };
                            updateData({ ...data, importantPlaces: next });
                          }}
                          className="text-xl sm:text-2xl font-hindi text-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-6 sm:p-8">
                    <EditableText
                      as="p"
                      multiline
                      value={activePlace.description}
                      onChange={(val) => {
                        const next = [...importantPlaces];
                        next[activePlaceIndex] = {
                          ...activePlace,
                          description: val,
                        };
                        updateData({ ...data, importantPlaces: next });
                      }}
                      className="text-base sm:text-lg text-stone-700 dark:text-stone-200 leading-relaxed"
                    />
                    <div className="mt-6 pt-4 border-t border-stone-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
                      <EditableText
                        labelKey="places_card_footer"
                        defaultText="Jamdhaha Panchayat · Katoria Block · Banka, Bihar"
                      />
                      <a
                        href="#map"
                        className="text-amber-700 dark:text-amber-400 font-medium hover:underline"
                      >
                        <EditableText
                          labelKey="places_card_link"
                          defaultText="View in Regional Map →"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Compact Quick-Scan Grid of All Places */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {importantPlaces.map((place, pIdx) => (
                  <div
                    key={`card-${place.id}`}
                    onClick={() => setSelectedPlaceId(place.id)}
                    className="p-4 rounded-xl border border-stone-200/80 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] hover:border-amber-500/40 transition-colors cursor-pointer"
                  >
                    <div className="flex items-baseline justify-between gap-2">
                      <EditableText
                        as="h4"
                        value={place.nameEn}
                        onChange={(val) => {
                          const next = [...importantPlaces];
                          next[pIdx] = { ...place, nameEn: val };
                          updateData({ ...data, importantPlaces: next });
                        }}
                        className="text-base font-bold font-display text-stone-900 dark:text-stone-100"
                      />
                      <EditableText
                        value={place.nameHi}
                        onChange={(val) => {
                          const next = [...importantPlaces];
                          next[pIdx] = { ...place, nameHi: val };
                          updateData({ ...data, importantPlaces: next });
                        }}
                        className="text-xs font-hindi text-amber-700 dark:text-amber-400"
                      />
                    </div>
                    <div className="mt-1.5">
                      <EditableText
                        as="p"
                        multiline
                        value={place.description}
                        onChange={(val) => {
                          const next = [...importantPlaces];
                          next[pIdx] = { ...place, description: val };
                          updateData({ ...data, importantPlaces: next });
                        }}
                        className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
