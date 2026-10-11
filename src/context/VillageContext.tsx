import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import defaultVillageData from '../data/village.json';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import { ContactSubmission, VillageData } from '../types/village';

const STORAGE_KEY = 'merha_village_cms_data_v1';
const SUBMISSIONS_KEY = 'merha_village_contact_submissions_v1';
const THEME_KEY = 'merha_village_theme_v1';
const ADMIN_AUTH_KEY = 'merha_village_admin_auth_v1';

const ADMIN_EMAIL = 'lalankumarbnk17@gmail.com';
const OWNER_EMAIL = 'vishwanathmandalbnk99@gmail.com';
const ADMIN_PASS = '@Lala9973';
const SECRET_LOGIN_PATH = `/email-${ADMIN_EMAIL}/pass-${ADMIN_PASS}/login`;

interface VillageContextType {
  data: VillageData;
  updateData: (newData: VillageData) => void;
  saveToFirebase: (customData?: VillageData) => Promise<{
    savedToCloud: boolean;
    message: string;
  }>;
  hasUnsavedChanges: boolean;
  isSavingCloud: boolean;
  resetData: () => void;
  exportDataJson: () => string;
  importDataJson: (rawJson: string) => { success: boolean; error?: string };
  submissions: ContactSubmission[];
  addSubmission: (sub: Omit<ContactSubmission, 'id' | 'createdAt'>) => Promise<{
    savedLocally: boolean;
    sentToEndpoint: boolean;
    error?: string;
  }>;
  clearSubmissions: () => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  firebaseUser: User | null;
  isFirebaseAdmin: boolean;
  signInWithGoogleAdmin: () => Promise<{ success: boolean; error?: string }>;
  isAdminAuthenticated: boolean;
  isAdminRoute: boolean;
  isInlineEditMode: boolean;
  setIsInlineEditMode: (val: boolean) => void;
  isLoginRouteActive: boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => Promise<void>;
  closeLoginPrompt: () => void;
  openAdminWorkspace: () => void;
  exitAdminWorkspace: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  openAdminAt: (tab: string) => void;
}

const VillageContext = createContext<VillageContextType | undefined>(undefined);

export const VillageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<VillageData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) as VillageData;
      }
    } catch (e) {
      console.error('Failed to read local village data:', e);
    }
    return defaultVillageData as VillageData;
  });

  const [submissions, setSubmissions] = useState<ContactSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(SUBMISSIONS_KEY);
      if (saved) {
        return JSON.parse(saved) as ContactSubmission[];
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const savedTheme = localStorage.getItem(THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        return savedTheme;
      }
    } catch {
      // ignore
    }
    return 'dark';
  });

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [localPassAuthenticated, setLocalPassAuthenticated] = useState<boolean>(
    () => {
      try {
        return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
      } catch {
        return false;
      }
    }
  );

  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [isInlineEditMode, setIsInlineEditMode] = useState(false);
  const [isLoginRouteActive, setIsLoginRouteActive] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSavingCloud, setIsSavingCloud] = useState(false);

  const isFirebaseAdmin = Boolean(
    firebaseUser &&
      firebaseUser.emailVerified &&
      (firebaseUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
        firebaseUser.email?.toLowerCase() === OWNER_EMAIL.toLowerCase())
  );

  const isAdminAuthenticated = isFirebaseAdmin || localPassAuthenticated;

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Listen to live Firestore /village_portal/main document
  useEffect(() => {
    const docRef = doc(db, 'village_portal', 'main');
    const unsub = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const cloudData = snap.data() as Partial<VillageData>;
          if (cloudData.identity && cloudData.about && cloudData.highlights) {
            const merged: VillageData = {
              identity: cloudData.identity,
              about: cloudData.about,
              statistics: cloudData.statistics || defaultVillageData.statistics,
              highlights: cloudData.highlights,
              importantPlaces:
                cloudData.importantPlaces || defaultVillageData.importantPlaces,
              education: cloudData.education || defaultVillageData.education,
              culture: cloudData.culture || defaultVillageData.culture,
              gallery:
                (cloudData.gallery as VillageData['gallery']) ||
                (defaultVillageData.gallery as VillageData['gallery']),
              wards: cloudData.wards || defaultVillageData.wards,
              administration:
                cloudData.administration || defaultVillageData.administration,
              mapConfig: cloudData.mapConfig || defaultVillageData.mapConfig,
              newsUpdates:
                cloudData.newsUpdates || defaultVillageData.newsUpdates,
              contactConfig:
                cloudData.contactConfig || defaultVillageData.contactConfig,
            };
            setData(merged);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {
              // ignore
            }
          }
        }
      },
      (err) => {
        console.warn('Firestore live listener notice:', err);
      }
    );
    return () => unsub();
  }, []);

  // Listen to Firestore /contact_suggestions when authenticated as Admin
  useEffect(() => {
    if (!authReady || !isAdminAuthenticated) return;
    const colRef = collection(db, 'contact_suggestions');
    const unsub = onSnapshot(
      colRef,
      (snap) => {
        const list: ContactSubmission[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          list.push({
            id: docSnap.id,
            name: d.name || '',
            contact: d.contact || '',
            topic: d.topic || '',
            message: d.message || '',
            createdAt: d.createdAt?.toDate
              ? d.createdAt.toDate().toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })
              : 'Recent',
          });
        });
        setSubmissions(list);
      },
      (err) => {
        console.warn('Could not read contact_suggestions from Firestore:', err);
      }
    );
    return () => unsub();
  }, [authReady, isAdminAuthenticated]);

  // Check URL for /admin or secret login route
  useEffect(() => {
    const checkRoutes = () => {
      const currentPath = decodeURIComponent(window.location.pathname);
      const currentHash = decodeURIComponent(window.location.hash);

      if (
        currentPath.includes(SECRET_LOGIN_PATH) ||
        currentHash.includes(SECRET_LOGIN_PATH)
      ) {
        setLocalPassAuthenticated(true);
        setIsAdminRoute(true);
        setIsInlineEditMode(true);
        setIsLoginRouteActive(false);
        try {
          sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        } catch {
          // ignore
        }
        window.history.replaceState({}, '', '/admin');
        return;
      }

      if (
        currentPath === '/admin' ||
        currentPath.startsWith('/admin/') ||
        currentHash === '#/admin' ||
        currentHash === '#admin'
      ) {
        setIsAdminRoute(true);
        setIsInlineEditMode(true);
        return;
      }

      if (
        currentPath === '/login' ||
        currentHash === '#/login' ||
        currentHash === '#login'
      ) {
        setIsAdminRoute(true);
        setIsInlineEditMode(true);
      }
    };

    checkRoutes();
    window.addEventListener('hashchange', checkRoutes);
    window.addEventListener('popstate', checkRoutes);
    return () => {
      window.removeEventListener('hashchange', checkRoutes);
      window.removeEventListener('popstate', checkRoutes);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        'content',
        theme === 'dark' ? '#071318' : '#FAF7F0'
      );
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const updateData = (newData: VillageData) => {
    setData(newData);
    setHasUnsavedChanges(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save village data to localStorage:', e);
    }
  };

  const saveToFirebase = async (
    customData?: VillageData
  ): Promise<{ savedToCloud: boolean; message: string }> => {
    const payloadData = customData || data;
    setIsSavingCloud(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payloadData));
    } catch {
      // ignore
    }

    const path = 'village_portal/main';
    try {
      await setDoc(doc(db, 'village_portal', 'main'), {
        identity: payloadData.identity,
        about: payloadData.about,
        statistics: payloadData.statistics.slice(0, 25),
        highlights: payloadData.highlights.slice(0, 30),
        importantPlaces: payloadData.importantPlaces.slice(0, 30),
        education: payloadData.education,
        culture: payloadData.culture,
        gallery: payloadData.gallery.slice(0, 100),
        wards: payloadData.wards.slice(0, 25),
        administration: payloadData.administration.slice(0, 30),
        mapConfig: payloadData.mapConfig,
        newsUpdates: payloadData.newsUpdates.slice(0, 100),
        contactConfig: payloadData.contactConfig,
        updatedAt: serverTimestamp(),
        updatedBy: auth.currentUser?.uid || ADMIN_EMAIL,
      });
      setHasUnsavedChanges(false);
      setIsSavingCloud(false);
      return {
        savedToCloud: true,
        message: 'Saved live to Firebase (merha-d99f3) & LocalStorage!',
      };
    } catch (err) {
      setIsSavingCloud(false);
      console.warn('Firebase cloud write notice:', err);
      return {
        savedToCloud: false,
        message:
          'Saved locally! (Note: Ensure Firestore Database is created & rules allow write in your Firebase Console for project "merha-d99f3", or sign in with Google Admin.)',
      };
    }
  };

  const resetData = () => {
    const def = defaultVillageData as VillageData;
    setData(def);
    setHasUnsavedChanges(true);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const exportDataJson = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (
    rawJson: string
  ): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(rawJson) as VillageData;
      if (
        !parsed.identity ||
        !parsed.about ||
        !Array.isArray(parsed.highlights)
      ) {
        return {
          success: false,
          error:
            'Invalid JSON structure: missing core village sections (identity, about, highlights).',
        };
      }
      updateData(parsed);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Invalid JSON syntax',
      };
    }
  };

  const addSubmission = async (
    sub: Omit<ContactSubmission, 'id' | 'createdAt'>
  ): Promise<{
    savedLocally: boolean;
    sentToEndpoint: boolean;
    error?: string;
  }> => {
    const cleanId = `sub-${Date.now()}`;
    const newEntry: ContactSubmission = {
      name: sub.name.trim().slice(0, 120),
      contact: sub.contact.trim().slice(0, 120),
      topic: sub.topic.trim().slice(0, 120),
      message: sub.message.trim().slice(0, 2000),
      id: cleanId,
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    const updated = [newEntry, ...submissions];
    setSubmissions(updated);
    try {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }

    // Also save to Firebase Firestore /contact_suggestions/{id}
    try {
      await setDoc(doc(db, 'contact_suggestions', cleanId), {
        name: newEntry.name,
        contact: newEntry.contact,
        topic: newEntry.topic,
        message: newEntry.message,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore suggestion write notice:', err);
    }

    let sentToEndpoint = false;
    const endpoint = data.contactConfig.customEndpointUrl?.trim();
    if (endpoint) {
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            village: 'Merha Village (मेड़ा गांव)',
            ...newEntry,
          }),
        });
        sentToEndpoint = res.ok;
      } catch (err) {
        return {
          savedLocally: true,
          sentToEndpoint: false,
          error:
            err instanceof Error
              ? err.message
              : 'Saved to Firebase & LocalStorage.',
        };
      }
    }

    return { savedLocally: true, sentToEndpoint: true };
  };

  const clearSubmissions = async () => {
    if (isFirebaseAdmin) {
      for (const item of submissions) {
        try {
          await deleteDoc(doc(db, 'contact_suggestions', item.id));
        } catch {
          // ignore
        }
      }
    }
    setSubmissions([]);
    try {
      localStorage.removeItem(SUBMISSIONS_KEY);
    } catch {
      // ignore
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const signInWithGoogleAdmin = async (): Promise<{
    success: boolean;
    error?: string;
  }> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email?.toLowerCase() || '';
      if (
        email === ADMIN_EMAIL.toLowerCase() ||
        email === OWNER_EMAIL.toLowerCase()
      ) {
        setIsAdminRoute(true);
        setIsInlineEditMode(true);
        setIsLoginRouteActive(false);
        return { success: true };
      } else {
        await signOut(auth);
        return {
          success: false,
          error: `Access denied for ${email}. Only authorized village admin accounts (${ADMIN_EMAIL} / ${OWNER_EMAIL}) can edit.`,
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Google Sign-In failed.',
      };
    }
  };

  const loginAdmin = (email: string, pass: string): boolean => {
    if (
      (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
        email.trim().toLowerCase() === OWNER_EMAIL.toLowerCase()) &&
      pass === ADMIN_PASS
    ) {
      setLocalPassAuthenticated(true);
      setIsAdminRoute(true);
      setIsInlineEditMode(true);
      setIsLoginRouteActive(false);
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch {
        // ignore
      }
      window.history.replaceState({}, '', '/admin');
      return true;
    }
    return false;
  };

  const logoutAdmin = async () => {
    setLocalPassAuthenticated(false);
    setIsAdminOpen(false);
    setIsAdminRoute(false);
    setIsInlineEditMode(false);
    setIsLoginRouteActive(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
      if (auth.currentUser) {
        await signOut(auth);
      }
    } catch {
      // ignore
    }
    window.history.replaceState({}, '', '/');
  };

  const closeLoginPrompt = () => {
    setIsLoginRouteActive(false);
    setIsAdminRoute(false);
    setIsInlineEditMode(false);
    window.history.replaceState({}, '', '/');
  };

  const openAdminWorkspace = () => {
    setIsAdminRoute(true);
    setIsInlineEditMode(true);
    window.history.pushState({}, '', '/admin');
  };

  const exitAdminWorkspace = () => {
    setIsAdminRoute(false);
    setIsInlineEditMode(false);
    window.history.pushState({}, '', '/');
  };

  const openAdminAt = (tab: string) => {
    if (!isAdminAuthenticated) return;
    setActiveAdminTab(tab);
    setIsAdminRoute(true);
    setIsInlineEditMode(true);
  };

  return (
    <VillageContext.Provider
      value={{
        data,
        updateData,
        saveToFirebase,
        hasUnsavedChanges,
        isSavingCloud,
        resetData,
        exportDataJson,
        importDataJson,
        submissions,
        addSubmission,
        clearSubmissions,
        theme,
        toggleTheme,
        firebaseUser,
        isFirebaseAdmin,
        signInWithGoogleAdmin,
        isAdminAuthenticated,
        isAdminRoute,
        isInlineEditMode,
        setIsInlineEditMode,
        isLoginRouteActive,
        loginAdmin,
        logoutAdmin,
        closeLoginPrompt,
        openAdminWorkspace,
        exitAdminWorkspace,
        isAdminOpen,
        setIsAdminOpen,
        activeAdminTab,
        setActiveAdminTab,
        openAdminAt,
      }}
    >
      {children}
    </VillageContext.Provider>
  );
};

export const useVillage = () => {
  const context = useContext(VillageContext);
  if (!context) {
    throw new Error('useVillage must be used within a VillageProvider');
  }
  return context;
};
