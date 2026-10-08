export interface VillageFact {
  id: string;
  labelEn: string;
  labelHi: string;
  valueEn: string;
  valueHi: string;
  detail: string;
}

export interface VillageStatistic {
  id: string;
  label: string;
  labelHi: string;
  value: number;
  suffix: string;
  note: string;
}

export interface VillageHighlight {
  id: string;
  titleEn: string;
  titleHi: string;
  category: string;
  description: string;
  image: string;
}

export interface ImportantPlace {
  id: string;
  nameEn: string;
  nameHi: string;
  relation: string;
  description: string;
  image: string;
  featured: boolean;
}

export interface EducationPillar {
  id: string;
  titleEn: string;
  titleHi: string;
  level: string;
  description: string;
  statusNote: string;
}

export interface CultureItem {
  id: string;
  titleEn: string;
  titleHi: string;
  description: string;
  editableNote: string;
}

export type GalleryCategory =
  | 'All'
  | 'Village'
  | 'River'
  | 'Bridge'
  | 'Nature'
  | 'Hills'
  | 'Fields'
  | 'Festivals'
  | 'School';

export interface GalleryItem {
  id: string;
  title: string;
  titleHi: string;
  category: Exclude<GalleryCategory, 'All'>;
  image: string;
  caption: string;
}

export interface WardInfo {
  id: string;
  titleEn: string;
  titleHi: string;
  areaLabel: string;
  representativeTitle: string;
  representativeName: string;
  highlights: string[];
  notes: string;
}

export interface AdministrationEntry {
  id: string;
  roleEn: string;
  roleHi: string;
  jurisdiction: string;
  holderName: string;
  contactInfo: string;
}

export interface NewsUpdate {
  id: string;
  title: string;
  titleHi: string;
  category: string;
  date: string;
  summary: string;
  priority: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  contact: string;
  topic: string;
  message: string;
  createdAt: string;
}

export interface VillageData {
  identity: {
    nameEn: string;
    nameHi: string;
    fullLocationHi: string;
    fullLocationEn: string;
    taglineHi: string;
    taglineEn: string;
    heroImage: string;
    description: string;
  };
  about: {
    overview: string;
    narrativeQuote: string;
    facts: VillageFact[];
  };
  statistics: VillageStatistic[];
  highlights: VillageHighlight[];
  importantPlaces: ImportantPlace[];
  education: {
    ctaQuote: string;
    ctaQuoteHi: string;
    summary: string;
    pillars: EducationPillar[];
  };
  culture: {
    intro: string;
    items: CultureItem[];
  };
  gallery: GalleryItem[];
  wards: WardInfo[];
  administration: AdministrationEntry[];
  mapConfig: {
    locationQuery: string;
    displayAddress: string;
    embedUrl: string;
    externalMapsLink: string;
    nearbyReferencePoints: string[];
    note: string;
  };
  newsUpdates: NewsUpdate[];
  contactConfig: {
    mode: string;
    customEndpointUrl: string;
    recipientEmail: string;
    officeAddress: string;
    helpNote: string;
  };
}
