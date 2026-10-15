import React from 'react';
import { ExternalLink, SlidersHorizontal, Navigation } from 'lucide-react';
import { useVillage } from '../context/VillageContext';
import { EditableText } from './EditableText';

export const MapSection: React.FC = () => {
  const { data, updateData, openAdminAt, isAdminAuthenticated } = useVillage();
  const { mapConfig } = data;

  return (
    <section
      id="map"
      className="py-20 sm:py-28 border-b border-stone-200 dark:border-white/10 bg-[#F3EFE6] dark:bg-[#09181F] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <EditableText
              as="p"
              labelKey="map_kicker"
              defaultText="09 · Geographic Location & Regional Access"
              className="text-xs uppercase tracking-widest text-amber-700 dark:text-amber-400 font-medium"
            />
            <div className="mt-2">
              <EditableText
                as="h2"
                labelKey="map_heading"
                defaultText="Village Map & Directions (मेड़ा गांव का मानचित्र)"
                className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
                style={{ textWrap: 'balance' }}
              />
            </div>
            <div className="mt-3">
              <EditableText
                as="p"
                multiline
                labelKey="map_intro"
                defaultText="Approximate regional view of Merha, Jamdhaha, Katoria, Banka, Bihar. No unverified coordinates are hardcoded—village administrators can refine the map query or embed URL at any time."
                className="text-base text-stone-600 dark:text-stone-300"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isAdminAuthenticated && (
              <button
                type="button"
                onClick={() => openAdminAt('map')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 dark:border-white/15 text-xs font-medium text-stone-700 dark:text-stone-200 hover:border-amber-500/50 transition-colors cursor-pointer whitespace-nowrap"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                <span>Configure Map Query</span>
              </button>
            )}

            <a
              href={mapConfig.externalMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs transition-colors whitespace-nowrap"
            >
              <Navigation className="w-3.5 h-3.5" />
              <EditableText
                labelKey="map_btn_open"
                defaultText="Open in Google Maps"
              />
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Interactive Map Embed */}
          <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-stone-200 dark:border-white/15 bg-stone-900 min-h-[380px] sm:min-h-[460px] relative shadow-lg">
            <iframe
              title="Approximate Location of Merha, Jamdhaha, Katoria, Banka, Bihar"
              src={mapConfig.embedUrl}
              className="w-full h-full min-h-[380px] sm:min-h-[460px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Geographic Directory & Reference Landmarks */}
          <div className="lg:col-span-4 rounded-2xl border border-stone-200 dark:border-white/10 bg-white dark:bg-[#0D1E25] p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <EditableText
                as="p"
                labelKey="map_addr_kicker"
                defaultText="Postal & Administrative Address"
                className="text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 font-medium"
              />
              <div className="mt-2">
                <EditableText
                  as="h3"
                  labelKey="map_addr_title"
                  defaultText="Merha (मेड़ा गांव)"
                  className="text-2xl font-bold font-display text-stone-900 dark:text-[#F4F1EA]"
                />
              </div>
              <div className="mt-2">
                <EditableText
                  as="p"
                  multiline
                  value={mapConfig.displayAddress}
                  onChange={(val) =>
                    updateData({
                      ...data,
                      mapConfig: { ...mapConfig, displayAddress: val },
                    })
                  }
                  className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed"
                />
              </div>

              <div className="mt-6 pt-5 border-t border-stone-200 dark:border-white/10">
                <EditableText
                  as="p"
                  labelKey="map_ref_heading"
                  defaultText="Key Surrounding Reference Points"
                  className="text-xs uppercase tracking-wider text-stone-500 dark:text-stone-400 font-medium mb-3"
                />
                <ul className="space-y-2.5 text-sm text-stone-700 dark:text-stone-200">
                  {mapConfig.nearbyReferencePoints.map((pt, i) => (
                    <li key={i} className="flex items-center justify-between gap-2">
                      <EditableText
                        value={pt}
                        onChange={(val) => {
                          const next = [...mapConfig.nearbyReferencePoints];
                          next[i] = val;
                          updateData({
                            ...data,
                            mapConfig: {
                              ...mapConfig,
                              nearbyReferencePoints: next,
                            },
                          });
                        }}
                      />
                      <span className="text-xs font-mono-tabular text-stone-400">
                        0{i + 1}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100 dark:border-white/5">
              <EditableText
                as="p"
                multiline
                value={mapConfig.note}
                onChange={(val) =>
                  updateData({
                    ...data,
                    mapConfig: { ...mapConfig, note: val },
                  })
                }
                className="text-xs text-stone-500 dark:text-stone-400 leading-relaxed"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
