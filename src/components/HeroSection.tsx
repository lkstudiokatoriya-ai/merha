import React from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Images, Compass } from 'lucide-react';
import { useVillage } from '../context/VillageContext';
import { ResilientImage } from './ResilientImage';
import { EditableText } from './EditableText';

export const HeroSection: React.FC = () => {
  const { data, updateData } = useVillage();
  const { identity } = data;

  const updateIdentity = (key: keyof typeof identity, val: string) => {
    updateData({
      ...data,
      identity: {
        ...identity,
        [key]: val,
      },
    });
  };

  return (
    <section
      id="home"
      className="relative min-h-[88vh] flex items-end lg:items-center overflow-hidden border-b border-stone-200 dark:border-white/10"
    >
      {/* Full-bleed Rural Bihar Landscape Background */}
      <div className="absolute inset-0 z-0">
        <ResilientImage
          src={identity.heroImage}
          alt="Merha Village, Kurar River, green fields and Katoria hills at golden hour"
          fallbackLabel="Merha Village Landscape • Kurar River & Hills"
          className="w-full h-full object-cover object-center scale-[1.02] transition-transform duration-1000"
          containerClassName="w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071318] via-[#071318]/75 to-[#071318]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071318]/90 via-[#071318]/50 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          {/* Official Village Emblem / Logo + Administrative Metadata Line */}
          <div className="flex items-center gap-3.5 mb-5">
            <img
              src="/Gemini_Generated_Image_4k9nnx4k9nnx4k9n.png"
              alt="Merha Village (मेड़ा गांव) Official Emblem"
              referrerPolicy="no-referrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-400/60 shadow-xl shadow-black/40 shrink-0"
            />
            <p className="text-xs sm:text-sm tracking-widest uppercase text-amber-300/95 font-medium leading-relaxed">
              Jamdhaha Panchayat &nbsp;·&nbsp; Katoria Block &nbsp;·&nbsp; Banka District &nbsp;·&nbsp; Bihar
            </p>
          </div>

          {/* Primary English & Hindi Title (Inline Editable in /admin) */}
          <EditableText
            as="h1"
            value={identity.nameEn}
            onChange={(val) => updateIdentity('nameEn', val)}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F4F1EA] font-display leading-[1.06]"
            style={{ textWrap: 'balance' }}
          />

          <div className="mt-3">
            <EditableText
              as="p"
              value={identity.fullLocationHi}
              onChange={(val) => updateIdentity('fullLocationHi', val)}
              className="text-2xl sm:text-3xl lg:text-4xl font-hindi text-amber-400 font-medium tracking-wide"
            />
          </div>

          {/* Subtitle / Cultural Motto */}
          <div className="mt-6 pt-5 border-t border-white/15 inline-block w-full max-w-xl">
            <EditableText
              as="p"
              value={identity.taglineHi}
              onChange={(val) => updateIdentity('taglineHi', val)}
              className="text-lg sm:text-xl font-hindi text-stone-100 tracking-wide"
            />
            <div className="mt-1">
              <EditableText
                as="p"
                value={identity.taglineEn}
                onChange={(val) => updateIdentity('taglineEn', val)}
                className="text-xs sm:text-sm text-stone-300/80"
              />
            </div>
          </div>

          <div className="mt-5 max-w-2xl">
            <EditableText
              as="p"
              multiline
              value={identity.description}
              onChange={(val) => updateIdentity('description', val)}
              className="text-base sm:text-lg text-stone-200/90 leading-relaxed"
            />
          </div>

          {/* Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3.5">
            <a
              href="#places"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Village</span>
            </a>

            <a
              href="#gallery"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-white/25 bg-white/10 hover:bg-white/15 backdrop-blur-md text-[#F4F1EA] font-medium text-sm transition-all whitespace-nowrap"
            >
              <Images className="w-4 h-4 text-amber-300" />
              <span>Village Gallery</span>
            </a>

            <a
              href="#about"
              className="inline-flex items-center gap-1.5 px-5 py-3.5 rounded-xl border border-transparent hover:border-white/15 text-stone-200 hover:text-amber-300 font-medium text-sm transition-colors whitespace-nowrap"
            >
              <span>About Merha</span>
              <ArrowDownRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Bottom Landscape Context Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35, duration: 0.8 }}
          className="mt-14 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6 text-left"
        >
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-400">Primary River</p>
            <p className="text-sm sm:text-base font-medium text-stone-100 mt-0.5">
              Kurar River (कुरार नदी)
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-400">Geography</p>
            <p className="text-sm sm:text-base font-medium text-stone-100 mt-0.5">
              Hills, Sal Forest & Green Fields
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-400">Gram Panchayat</p>
            <p className="text-sm sm:text-base font-medium text-stone-100 mt-0.5">
              Jamdhaha (जमदाहा)
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-stone-400">Block & District</p>
            <p className="text-sm sm:text-base font-medium text-stone-100 mt-0.5">
              Katoria · Banka, Bihar
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
