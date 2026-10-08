import React from 'react';
import { motion } from 'motion/react';
import { SlidersHorizontal } from 'lucide-react';
import { useVillage } from '../context/VillageContext';

export const AboutAndStatsSection: React.FC = () => {
  const { data, openAdminAt, isAdminAuthenticated } = useVillage();
  const { about, statistics } = data;

  return (
    <section
      id="about"
      className="py-20 sm:py-28 border-b border-stone-200 dark:border-white/10 bg-[#FAF7F0] dark:bg-[#071318] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header + Editorial Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
              01 &nbsp;·&nbsp; Village Identity & Gazetteer
            </p>
            <h2
              className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 dark:text-[#F4F1EA] leading-tight"
              style={{ textWrap: 'balance' }}
            >
              About Merha Village (मेड़ा गांव का परिचय)
            </h2>
            <blockquote className="mt-6 pl-4 border-l-2 border-amber-500/70 italic text-base sm:text-lg font-hindi text-stone-700 dark:text-amber-200/90 leading-relaxed">
              “{about.narrativeQuote}”
            </blockquote>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <p className="text-base sm:text-lg text-stone-700 dark:text-stone-300 leading-relaxed max-w-2xl">
              {about.overview}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
              <span>
                Official Administrative Hierarchy &nbsp;·&nbsp; Banka District, Bihar
              </span>
              {isAdminAuthenticated && (
                <button
                  type="button"
                  onClick={() => openAdminAt('overview')}
                  className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 hover:underline font-medium cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Customize Gazetteer Details</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Premium Information Cards (Village, Panchayat, Block, District, State, Country) */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {about.facts.map((fact, idx) => (
            <motion.div
              key={fact.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="p-6 rounded-2xl border border-stone-200/90 dark:border-white/10 bg-white dark:bg-[#0D1E25]/80 backdrop-blur-sm flex flex-col justify-between hover:border-amber-500/40 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span className="uppercase tracking-wider font-medium">{fact.labelEn}</span>
                  <span className="font-hindi text-amber-700 dark:text-amber-400">{fact.labelHi}</span>
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]">
                    {fact.valueEn}
                  </h3>
                  <span className="text-lg sm:text-xl font-hindi text-stone-700 dark:text-stone-200">
                    {fact.valueHi}
                  </span>
                </div>
              </div>
              <p className="mt-4 pt-3 border-t border-stone-100 dark:border-white/5 text-xs text-stone-500 dark:text-stone-400">
                {fact.detail}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Configurable Village Statistics Counter Bar */}
        <div className="mt-16 pt-12 border-t border-stone-200 dark:border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-medium">
                Key Village Figures &nbsp;·&nbsp; Configurable Indicators
              </p>
              <h3 className="mt-1 text-2xl sm:text-3xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]">
                Merha at a Glance (एक नज़र में मेड़ा गांव)
              </h3>
            </div>
            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => openAdminAt('statistics')}
                className="text-xs text-amber-700 dark:text-amber-400 hover:underline self-start sm:self-auto cursor-pointer"
              >
                Edit Statistical Counters →
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {statistics.map((stat, idx) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.06 }}
                className="p-5 rounded-xl border border-stone-200/80 dark:border-white/10 bg-stone-100/70 dark:bg-white/[0.03]"
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold font-mono-tabular text-amber-600 dark:text-amber-400">
                    {String(stat.value).padStart(2, '0')}
                  </span>
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">
                    {stat.suffix}
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-stone-900 dark:text-stone-100">
                  {stat.label}
                </p>
                <p className="text-xs font-hindi text-stone-600 dark:text-stone-300 mt-0.5">
                  {stat.labelHi}
                </p>
                <p className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">
                  {stat.note}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
