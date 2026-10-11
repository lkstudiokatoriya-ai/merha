import React from 'react';
import { motion } from 'motion/react';
import { useVillage } from '../context/VillageContext';
import { EditableText } from './EditableText';

export const WardsAndAdminSection: React.FC = () => {
  const { data, updateData } = useVillage();
  const { wards, administration } = data;

  return (
    <section
      id="governance"
      className="py-20 sm:py-28 border-b border-stone-200 dark:border-white/10 bg-[#FAF7F0] dark:bg-[#071318] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Part 1: Village Wards (Ward No. 1 & Ward No. 2) */}
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium">
            07 &nbsp;·&nbsp; Grassroots Structure & Wards
          </p>
          <h2
            className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
            style={{ textWrap: 'balance' }}
          >
            Village Wards (वार्ड संख्या १ एवं वार्ड संख्या २)
          </h2>
          <p className="mt-3 text-base text-stone-600 dark:text-stone-300">
            Merha Village is organized into dedicated Panchayat Wards to ensure transparent civic representation, rural infrastructure delivery, and community participation.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {wards.map((ward, idx) => (
            <motion.div
              key={ward.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="p-7 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#0D1E25] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
                  <span className="font-mono-tabular uppercase tracking-wider">
                    Jamdhaha Panchayat &nbsp;·&nbsp; Merha
                  </span>
                  <EditableText
                    value={ward.titleHi}
                    onChange={(val) => {
                      const next = [...wards];
                      next[idx] = { ...ward, titleHi: val };
                      updateData({ ...data, wards: next });
                    }}
                    className="font-hindi text-amber-700 dark:text-amber-400 font-medium"
                  />
                </div>

                <div className="mt-2">
                  <EditableText
                    as="h3"
                    value={ward.titleEn}
                    onChange={(val) => {
                      const next = [...wards];
                      next[idx] = { ...ward, titleEn: val };
                      updateData({ ...data, wards: next });
                    }}
                    className="text-2xl sm:text-3xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
                  />
                </div>
                <div className="mt-1">
                  <EditableText
                    as="p"
                    value={ward.areaLabel}
                    onChange={(val) => {
                      const next = [...wards];
                      next[idx] = { ...ward, areaLabel: val };
                      updateData({ ...data, wards: next });
                    }}
                    className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 font-medium"
                  />
                </div>

                <div className="mt-5 p-4 rounded-xl bg-stone-100/80 dark:bg-white/[0.03] border border-stone-200/70 dark:border-white/5">
                  <EditableText
                    as="p"
                    value={ward.representativeTitle}
                    onChange={(val) => {
                      const next = [...wards];
                      next[idx] = { ...ward, representativeTitle: val };
                      updateData({ ...data, wards: next });
                    }}
                    className="text-xs text-stone-500 dark:text-stone-400"
                  />
                  <div className="mt-0.5">
                    <EditableText
                      as="p"
                      value={ward.representativeName}
                      onChange={(val) => {
                        const next = [...wards];
                        next[idx] = { ...ward, representativeName: val };
                        updateData({ ...data, wards: next });
                      }}
                      className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100"
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium mb-2.5">
                    Civic Focus & Amenities
                  </p>
                  <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-300">
                    {ward.highlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-amber-500 font-bold leading-5">·</span>
                        <EditableText
                          value={hl}
                          onChange={(val) => {
                            const nextWards = [...wards];
                            const nextHl = [...ward.highlights];
                            nextHl[i] = val;
                            nextWards[idx] = { ...ward, highlights: nextHl };
                            updateData({ ...data, wards: nextWards });
                          }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 dark:border-white/5">
                <EditableText
                  as="p"
                  value={ward.notes}
                  onChange={(val) => {
                    const next = [...wards];
                    next[idx] = { ...ward, notes: val };
                    updateData({ ...data, wards: next });
                  }}
                  className="text-xs text-stone-500 dark:text-stone-400"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Part 2: Local Administration Roster */}
        <div className="mt-20 pt-16 border-t border-stone-200 dark:border-white/10">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-widest text-emerald-700 dark:text-emerald-400 font-medium">
              08 &nbsp;·&nbsp; Public Administration & Representation
            </p>
            <h3 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]">
              Local Administration & Jurisdiction (स्थानीय प्रशासन एवं जनप्रतिनिधि)
            </h3>
            <p className="mt-2 text-sm sm:text-base text-stone-600 dark:text-stone-300">
              Official administrative directory for Merha Village.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#0D1E25]">
            <div className="divide-y divide-stone-200 dark:divide-white/10">
              {administration.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-stone-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                      <span className="font-mono-tabular">0{idx + 1}</span>
                      <span>·</span>
                      <EditableText
                        value={entry.roleHi}
                        onChange={(val) => {
                          const next = [...administration];
                          next[idx] = { ...entry, roleHi: val };
                          updateData({ ...data, administration: next });
                        }}
                        className="font-hindi text-amber-700 dark:text-amber-400"
                      />
                    </div>
                    <div className="mt-0.5">
                      <EditableText
                        as="h4"
                        value={entry.roleEn}
                        onChange={(val) => {
                          const next = [...administration];
                          next[idx] = { ...entry, roleEn: val };
                          updateData({ ...data, administration: next });
                        }}
                        className="text-lg font-bold font-display text-stone-900 dark:text-stone-100"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-4">
                    <p className="text-xs text-stone-500 dark:text-stone-400">Jurisdiction</p>
                    <div className="mt-0.5">
                      <EditableText
                        as="p"
                        value={entry.jurisdiction}
                        onChange={(val) => {
                          const next = [...administration];
                          next[idx] = { ...entry, jurisdiction: val };
                          updateData({ ...data, administration: next });
                        }}
                        className="text-sm font-semibold text-stone-800 dark:text-stone-200"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col justify-between gap-1">
                    <EditableText
                      as="p"
                      value={entry.holderName}
                      onChange={(val) => {
                        const next = [...administration];
                        next[idx] = { ...entry, holderName: val };
                        updateData({ ...data, administration: next });
                      }}
                      className="text-sm font-medium text-emerald-700 dark:text-emerald-400"
                    />
                    <EditableText
                      as="p"
                      value={entry.contactInfo}
                      onChange={(val) => {
                        const next = [...administration];
                        next[idx] = { ...entry, contactInfo: val };
                        updateData({ ...data, administration: next });
                      }}
                      className="text-xs text-stone-500 dark:text-stone-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
