/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VillageProvider } from './context/VillageContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutAndStatsSection } from './components/AboutAndStatsSection';
import { HighlightsAndPlacesSection } from './components/HighlightsAndPlacesSection';
import { EducationAndCultureSection } from './components/EducationAndCultureSection';
import { GallerySection } from './components/GallerySection';
import { WardsAndAdminSection } from './components/WardsAndAdminSection';
import { MapSection } from './components/MapSection';
import { NewsAndContactSection } from './components/NewsAndContactSection';
import { Footer } from './components/Footer';
import { AdminEditorModal } from './components/AdminEditorModal';
import { AdminLoginModal } from './components/AdminLoginModal';

export default function App() {
  return (
    <VillageProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF7F0] dark:bg-[#071318] text-stone-900 dark:text-[#F4F1EA] transition-colors">
        <Navbar />
        <main className="flex-1">
          <HeroSection />
          <AboutAndStatsSection />
          <HighlightsAndPlacesSection />
          <EducationAndCultureSection />
          <GallerySection />
          <WardsAndAdminSection />
          <MapSection />
          <NewsAndContactSection />
        </main>
        <Footer />
        <AdminEditorModal />
        <AdminLoginModal />
      </div>
    </VillageProvider>
  );
}
