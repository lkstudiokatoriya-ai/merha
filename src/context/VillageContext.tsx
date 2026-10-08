import React, { createContext, useContext, useEffect, useState } from 'react';
import defaultVillageData from '../data/village.json';
import { ContactSubmission, VillageData } from '../types/village';

const STORAGE_KEY = 'merha_village_cms_data_v1';
const SUBMISSIONS_KEY = 'merha_village_contact_submissions_v1';
const THEME_KEY = 'merha_village_theme_v1';
const ADMIN_AUTH_KEY = 'merha_village_admin_auth_v1';

const ADMIN_EMAIL = 'lalankumarbnk17@gmail.com';
const ADMIN_PASS = '@Lala9973';
const SECRET_LOGIN_PATH = `/email-${ADMIN_EMAIL}/pass-${ADMIN_PASS}/login`;

interface VillageContextType {
  data: VillageData;
  updateData: (newData: VillageData) => void;
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
  isAdminAuthenticated: boolean;
  isLoginRouteActive: boolean;
  loginAdmin: (email: string, pass: string) => boolean;
  logoutAdmin: () => void;
  closeLoginPrompt: () => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  activeAdminTab: string;
  setActiveAdminTab: (tab: string) => void;
  openAdminAt: (tab: string) => void;
}

const VillageContext = createContext<VillageContextType | undefined>(undefined);

export const VillageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    } catch (e) {
      console.error('Failed to read submissions:', e);
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

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [isLoginRouteActive, setIsLoginRouteActive] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('overview');

  useEffect(() => {
    const checkSecretUrl = () => {
      const currentPath = decodeURIComponent(window.location.pathname);
      const currentHash = decodeURIComponent(window.location.hash);

      // Direct secret auto-login URL: /email-lalankumarbnk17@gmail.com/pass-@Lala9973/login
      if (
        currentPath.includes(SECRET_LOGIN_PATH) ||
        currentHash.includes(SECRET_LOGIN_PATH)
      ) {
        setIsAdminAuthenticated(true);
        setIsAdminOpen(true);
        setIsLoginRouteActive(false);
        try {
          sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
        } catch {
          // ignore
        }
        // Clean URL back to root so credentials don't stay visible in the address bar
        window.history.replaceState({}, '', '/');
        return;
      }

      // Also support manual login form if someone visits /login or #/login
      if (
        currentPath === '/login' ||
        currentPath === '/admin' ||
        currentHash === '#/login' ||
        currentHash === '#login'
      ) {
        setIsLoginRouteActive(true);
      }
    };

    checkSecretUrl();
    window.addEventListener('hashchange', checkSecretUrl);
    window.addEventListener('popstate', checkSecretUrl);
    return () => {
      window.removeEventListener('hashchange', checkSecretUrl);
      window.removeEventListener('popstate', checkSecretUrl);
    };
  }, []);

  const loginAdmin = (email: string, pass: string): boolean => {
    if (
      email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() &&
      pass === ADMIN_PASS
    ) {
      setIsAdminAuthenticated(true);
      setIsLoginRouteActive(false);
      setIsAdminOpen(true);
      try {
        sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
      } catch {
        // ignore
      }
      window.history.replaceState({}, '', '/');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setIsAdminOpen(false);
    setIsLoginRouteActive(false);
    try {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {
      // ignore
    }
    window.history.replaceState({}, '', '/');
  };

  const closeLoginPrompt = () => {
    setIsLoginRouteActive(false);
    window.history.replaceState({}, '', '/');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const updateData = (newData: VillageData) => {
    setData(newData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData));
    } catch (e) {
      console.error('Failed to save village data to localStorage:', e);
    }
  };

  const resetData = () => {
    setData(defaultVillageData as VillageData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to clear village data from localStorage:', e);
    }
  };

  const exportDataJson = () => {
    return JSON.stringify(data, null, 2);
  };

  const importDataJson = (rawJson: string): { success: boolean; error?: string } => {
    try {
      const parsed = JSON.parse(rawJson) as VillageData;
      if (!parsed.identity || !parsed.about || !Array.isArray(parsed.highlights)) {
        return {
          success: false,
          error: 'Invalid JSON structure: missing core village sections (identity, about, highlights).',
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
  ): Promise<{ savedLocally: boolean; sentToEndpoint: boolean; error?: string }> => {
    const newEntry: ContactSubmission = {
      ...sub,
      id: `sub-${Date.now()}`,
      createdAt: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };

    const updated = [newEntry, ...submissions];
    setSubmissions(updated);
    try {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save submission locally:', e);
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
          error: err instanceof Error ? err.message : 'Custom API endpoint unreachable; saved locally.',
        };
      }
    }

    return { savedLocally: true, sentToEndpoint };
  };

  const clearSubmissions = () => {
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

  const openAdminAt = (tab: string) => {
    if (!isAdminAuthenticated) return;
    setActiveAdminTab(tab);
    setIsAdminOpen(true);
  };

  return (
    <VillageContext.Provider
      value={{
        data,
        updateData,
        resetData,
        exportDataJson,
        importDataJson,
        submissions,
        addSubmission,
        clearSubmissions,
        theme,
        toggleTheme,
        isAdminAuthenticated,
        isLoginRouteActive,
        loginAdmin,
        logoutAdmin,
        closeLoginPrompt,
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
