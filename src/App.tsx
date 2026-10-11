/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { VillageProvider, useVillage } from './context/VillageContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutAndStatsSection } from './components/AboutAndStatsSection';
import { HighlightsAndPlacesSection } from './components/HighlightsAndPlacesSection';
import { EducationAndCultureSection } from './components/EducationAndCultureSection';
import { GallerySection } from './components/GallerySection';
import { WardsAndAdminSection } from './components/WardsAndAdminSection';
import { MapSection } from './components/MapSection';
import { NewsAndContactSection } from './components/NewsAndContactSection';
import { SEOFaqSection } from './components/SEOFaqSection';
import { Footer } from './components/Footer';
import { AdminSplitStudio } from './components/AdminSplitStudio';

const VillageWebsiteContent: React.FC = () => (
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
      <SEOFaqSection />
    </main>
    <Footer />
  </div>
);

const AppContent: React.FC = () => {
  const { isAdminRoute } = useVillage();

  if (isAdminRoute) {
    return (
      <AdminSplitStudio>
        <VillageWebsiteContent />
      </AdminSplitStudio>
    );
  }

  return <VillageWebsiteContent />;
};

export default function App() {
  return (
    <VillageProvider>
      <AppContent />
    </VillageProvider>
  );
}
