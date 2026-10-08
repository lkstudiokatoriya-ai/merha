import React, { useState, useEffect } from 'react';
import { ArrowUp, SlidersHorizontal, WifiOff } from 'lucide-react';
import { useVillage } from '../context/VillageContext';
import { PWAInstallButton } from './PWAInstallButton';

export const Footer: React.FC = () => {
  const { data, openAdminAt, isAdminAuthenticated } = useVillage();
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-200 dark:border-white/10 bg-[#F3EFE6] dark:bg-[#050E12] text-stone-700 dark:text-stone-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-200 dark:border-white/10">
          {/* Col 1: Brand & Identity */}
          <div className="md:col-span-5 space-y-3">
            <a
              href="#home"
              className="text-2xl font-bold font-display text-stone-900 dark:text-[#F4F1EA] tracking-tight"
            >
              MERHA VILLAGE &nbsp;·&nbsp; <span className="font-hindi text-amber-600 dark:text-amber-400">मेड़ा गांव</span>
            </a>
            <p className="text-sm font-hindi text-stone-600 dark:text-stone-300">
              “{data.identity.taglineHi}”
            </p>
            <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm leading-relaxed">
              {data.identity.fullLocationEn}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <PWAInstallButton variant="compact" />
              {isAdminAuthenticated && (
                <button
                  type="button"
                  onClick={() => openAdminAt('json')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-white/15 text-xs font-medium hover:border-amber-500/50 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                  <span>Manage Village Data (JSON / CMS)</span>
                </button>
              )}
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-2.5">
              <p className="uppercase tracking-wider text-stone-400 font-semibold">
                Explore
              </p>
              <ul className="space-y-2">
                <li><a href="#home" className="hover:text-amber-500 transition-colors">Home (मुख्य पृष्ठ)</a></li>
                <li><a href="#about" className="hover:text-amber-500 transition-colors">About Merha (परिचय)</a></li>
                <li><a href="#places" className="hover:text-amber-500 transition-colors">Places & River (प्रमुख स्थान)</a></li>
                <li><a href="#education" className="hover:text-amber-500 transition-colors">Education (शिक्षा)</a></li>
                <li><a href="#culture" className="hover:text-amber-500 transition-colors">Culture (संस्कृति)</a></li>
              </ul>
            </div>
            <div className="space-y-2.5">
              <p className="uppercase tracking-wider text-stone-400 font-semibold">
                Community
              </p>
              <ul className="space-y-2">
                <li><a href="#gallery" className="hover:text-amber-500 transition-colors">Gallery (गैलरी)</a></li>
                <li><a href="#governance" className="hover:text-amber-500 transition-colors">Wards 1 & 2 (वार्ड)</a></li>
                <li><a href="#map" className="hover:text-amber-500 transition-colors">Village Map (मानचित्र)</a></li>
                <li><a href="#updates" className="hover:text-amber-500 transition-colors">Updates (समाचार)</a></li>
                <li><a href="#contact" className="hover:text-amber-500 transition-colors">Contact (संपर्क)</a></li>
              </ul>
            </div>
          </div>

          {/* Col 3: Administrative Reference */}
          <div className="md:col-span-3 space-y-2 text-xs text-stone-500 dark:text-stone-400">
            <p className="uppercase tracking-wider text-stone-400 font-semibold">
              Administrative Jurisdiction
            </p>
            <p>Village: Merha (मेड़ा)</p>
            <p>Panchayat: Jamdhaha (जमदाहा)</p>
            <p>Block: Katoria (कटोरिया)</p>
            <p>District: Banka (बांका)</p>
            <p>State: Bihar, India</p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500 dark:text-stone-400">
          <p>
            © {new Date().getFullYear()} Merha Village (मेड़ा गांव, जमदाहा, बांका, बिहार). Community Digital Heritage Portal.
          </p>
          <p>
            Static & Local-First Architecture · Ready for Vercel, Netlify & GitHub Pages
          </p>
        </div>
      </div>

      {/* Offline Connectivity Indicator */}
      {!isOnline && (
        <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-600 px-3.5 py-2 text-xs font-medium text-white shadow-lg">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline Mode — Viewing cached Merha Village data</span>
        </div>
      )}

      {/* Back to Top Floating Button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-xl transition-transform hover:-translate-y-0.5 cursor-pointer"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </footer>
  );
};
