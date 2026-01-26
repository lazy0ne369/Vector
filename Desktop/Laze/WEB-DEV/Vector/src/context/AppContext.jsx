import { createContext, useContext, useState, useEffect } from 'react';

export const AppContext = createContext();

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'hi', 'te', 'or'];

export function AppProvider({ children }) {
  // Initialize state from localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vector-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('vector-theme') || 'light';
  });
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('vector-language');
    return saved && SUPPORTED_LANGUAGES.includes(saved) ? saved : 'en';
  });
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('vector-user');
  });

  // Theme toggle - sync to DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vector-theme', theme);
  }, [theme]);

  // Language - sync to DOM and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    localStorage.setItem('vector-language', language);
  }, [language]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Change language to specific code
  const changeLanguage = (langCode) => {
    if (SUPPORTED_LANGUAGES.includes(langCode)) {
      setLanguage(langCode);
    }
  };

  // Legacy toggle for backwards compatibility (cycles through all)
  const toggleLanguage = () => {
    setLanguage(prev => {
      const currentIndex = SUPPORTED_LANGUAGES.indexOf(prev);
      const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
      return SUPPORTED_LANGUAGES[nextIndex];
    });
  };

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('vector-user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vector-user');
  };

  const value = {
    user,
    theme,
    language,
    isAuthenticated,
    toggleTheme,
    toggleLanguage,
    changeLanguage,
    login,
    logout,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

// Keep useApp in same file for convenience - the warning is just about fast refresh
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
