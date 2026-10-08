import React from 'react';
import { motion } from 'motion/react';
import { BookOpen, SlidersHorizontal } from 'lucide-react';
import { useVillage } from '../context/VillageContext';
import { ResilientImage } from './ResilientImage';

export const EducationAndCultureSection: React.FC = () => {
  const { data, openAdminAt, isAdminAuthenticated } = useVillage();
  const { education, culture } = data;

  return (
    <div className="bg-[#FAF7F0] dark:bg-[#071318] transition-colors">
      {/* EDUCATION SECTION */}
      <section
        id="education"
        className="py-20 sm:py-28 border-b border-stone-200 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
                04 &nbsp;·&nbsp; Learning & Youth Empowerment
              </p>
              <h2
                className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
                style={{ textWrap: 'balance' }}
              >
                Village Education & Schools (शिक्षा एवं विद्यालय)
              </h2>
              <p className="mt-4 text-base sm:text-lg text-stone-600 dark:text-stone-300 leading-relaxed">
                {education.summary}
              </p>

              {/* Prominent Required CTA Banner */}
              <div className="mt-8 p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent">
                <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-700 dark:text-amber-300 font-semibold">
                  <BookOpen className="w-4 h-4" />
                  <span>Village Education Charter</span>
                </div>
                <p className="mt-2 text-2xl sm:text-3xl font-bold font-display text-stone-900 dark:text-white">
                  “{education.ctaQuote}”
                </p>
                <p className="mt-1 text-base font-hindi text-amber-800 dark:text-amber-300">
                  {education.ctaQuoteHi}
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-white/15 shadow-xl">
                <div className="relative h-72 sm:h-80">
                  <ResilientImage
                    src="/src/assets/images/village_school_education_1791458769892.jpg"
                    alt="Merha Village School & Education"
                    fallbackLabel="Merha Village Education"
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071318] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <p className="text-xs uppercase tracking-wider text-amber-300">
                      Academic Foundation &nbsp;·&nbsp; Jamdhaha & Merha
                    </p>
                    <p className="text-lg font-display font-semibold mt-0.5">
                      Nurturing the Next Generation of Scholars & Citizens
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Education Pillars */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {education.pillars.map((pillar, idx) => (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="p-6 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#0D1E25] flex flex-col justify-between"
              >
                <div>
                  <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    0{idx + 1} &nbsp;·&nbsp; {pillar.level}
                  </p>
                  <h3 className="mt-2 text-xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]">
                    {pillar.titleEn}
                  </h3>
                  <p className="text-sm font-hindi text-stone-600 dark:text-stone-300 mt-0.5">
                    {pillar.titleHi}
                  </p>
                  <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <p className="mt-4 pt-3 border-t border-stone-100 dark:border-white/5 text-[11px] text-stone-500 dark:text-stone-400">
                  {pillar.statusNote}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CULTURE & COMMUNITY SECTION */}
      <section
        id="culture"
        className="py-20 sm:py-28 border-b border-stone-200 dark:border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-medium">
                05 &nbsp;·&nbsp; Heritage, Devotion & Brotherhood
              </p>
              <h2
                className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
                style={{ textWrap: 'balance' }}
              >
                Culture & Community Life (संस्कृति एवं सामुदायिक जीवन)
              </h2>
              <p className="mt-3 text-base text-stone-600 dark:text-stone-300 leading-relaxed">
                {culture.intro}
              </p>
            </div>

            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => openAdminAt('overview')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 dark:border-white/15 text-xs font-medium text-stone-700 dark:text-stone-200 hover:border-amber-500/50 transition-colors self-start lg:self-auto cursor-pointer whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                <span>Edit Cultural Notes</span>
              </button>
            )}
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {culture.items.map((item, idx) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-6 rounded-2xl border border-stone-200/90 dark:border-white/10 bg-white dark:bg-[#0D1E25]/90 flex flex-col justify-between hover:border-amber-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="text-2xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]">
                      {item.titleEn}
                    </h3>
                    <span className="text-xs font-mono-tabular text-stone-400">
                      0{idx + 1}
                    </span>
                  </div>
                  <p className="text-sm font-hindi text-amber-700 dark:text-amber-400 mt-1">
                    {item.titleHi}
                  </p>
                  <p className="mt-3 text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-white/5 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
                  <span>{item.editableNote}</span>
                  <span className="text-emerald-700 dark:text-emerald-400">Merha</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
