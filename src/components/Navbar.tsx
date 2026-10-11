import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Sun, Moon, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useVillage } from '../context/VillageContext';
import { PWAInstallButton } from './PWAInstallButton';

const PRIMARY_NAV = [
  { label: 'About', href: '#about' },
  { label: 'Places', href: '#places' },
  { label: 'Education', href: '#education' },
  { label: 'Culture', href: '#culture' },
  { label: 'Gallery', href: '#gallery' },
];

const MORE_NAV = [
  { label: 'Home', href: '#home' },
  { label: 'Village Map', href: '#map' },
  { label: 'Wards & Admin', href: '#governance' },
  { label: 'Updates', href: '#updates' },
  { label: 'Contact', href: '#contact' },
];

const ALL_MOBILE_NAV = [
  { label: 'Home', labelHi: 'मुख्य पृष्ठ', href: '#home' },
  { label: 'About', labelHi: 'परिचय', href: '#about' },
  { label: 'Places', labelHi: 'प्रमुख स्थान', href: '#places' },
  { label: 'Education', labelHi: 'शिक्षा', href: '#education' },
  { label: 'Culture', labelHi: 'संस्कृति', href: '#culture' },
  { label: 'Gallery', labelHi: 'गैलरी', href: '#gallery' },
  { label: 'Map', labelHi: 'मानचित्र', href: '#map' },
  { label: 'Updates', labelHi: 'सूचनाएं', href: '#updates' },
  { label: 'Contact', labelHi: 'संपर्क', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const { theme, toggleTheme, openAdminWorkspace, isAdminAuthenticated, logoutAdmin } = useVillage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-stone-200/80 dark:border-white/10 bg-[#FAF7F0]/90 dark:bg-[#071318]/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Logo & Wordmark */}
        <a
          href="#home"
          className="inline-flex items-center gap-2.5 text-xl sm:text-2xl font-bold tracking-tight font-display text-stone-900 dark:text-[#F4F1EA] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
        >
          <img
            src="/Gemini_Generated_Image_4k9nnx4k9nnx4k9n.png"
            alt="Merha Village Official Logo"
            referrerPolicy="no-referrer"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-amber-500/40 shadow-sm shrink-0"
          />
          <span>MERHA VILLAGE</span>
        </a>

        {/* Zone 2: Clean Text Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-600 dark:text-stone-300"
        >
          {PRIMARY_NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-amber-700 dark:hover:text-amber-400 transition-colors whitespace-nowrap py-1 border-b-2 border-transparent hover:border-amber-500/60"
            >
              {item.label}
            </a>
          ))}

          {/* More dropdown for items 6+ */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setMoreDropdownOpen((prev) => !prev)}
              aria-expanded={moreDropdownOpen}
              className="inline-flex items-center gap-1 hover:text-amber-700 dark:hover:text-amber-400 transition-colors whitespace-nowrap py-1 cursor-pointer"
            >
              <span>Explore</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl border border-stone-200 dark:border-white/15 bg-white dark:bg-[#0D1E25] py-2 shadow-xl">
                {MORE_NAV.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-stone-700 dark:text-stone-200 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Zone 3: 1-2 Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="hidden sm:block">
            <PWAInstallButton variant="compact" />
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to White (Light) mode' : 'Switch to Dark mode'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 dark:border-white/15 bg-white/80 dark:bg-white/[0.06] text-xs font-medium text-stone-800 dark:text-stone-200 hover:border-amber-500/50 transition-colors cursor-pointer whitespace-nowrap"
            title={theme === 'dark' ? 'Switch to White Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-stone-700" />
                <span>Dark</span>
              </>
            )}
          </button>

          {isAdminAuthenticated && (
            <div className="hidden md:flex items-center gap-2">
              <button
                type="button"
                onClick={openAdminWorkspace}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg bg-amber-600 hover:bg-amber-500 text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>/admin Studio</span>
              </button>
              <button
                type="button"
                onClick={logoutAdmin}
                className="px-2.5 py-2 text-xs font-medium rounded-lg border border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 transition-colors whitespace-nowrap cursor-pointer"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Hamburger Trigger */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-stone-200 dark:border-white/10 bg-[#FAF7F0] dark:bg-[#09181F] px-4 pt-3 pb-6 shadow-2xl">
          <nav className="grid grid-cols-2 gap-2" aria-label="Mobile Navigation">
            {ALL_MOBILE_NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg border border-stone-200/70 dark:border-white/5 bg-white/70 dark:bg-white/[0.03] text-sm font-medium text-stone-800 dark:text-stone-200 hover:border-amber-500/40 transition-colors"
              >
                <span>{item.label}</span>
                <span className="text-xs text-stone-500 dark:text-stone-400 font-hindi">{item.labelHi}</span>
              </a>
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-stone-200 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
            <PWAInstallButton variant="full" />
            {isAdminAuthenticated && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAdminWorkspace();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-medium rounded-lg bg-amber-600 text-white hover:bg-amber-500 transition-colors cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutAdmin();
                  }}
                  className="px-3 py-2.5 text-xs font-medium rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
