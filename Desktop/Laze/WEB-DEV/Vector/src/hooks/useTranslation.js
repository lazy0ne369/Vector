import { useCallback, useMemo } from "react";
import { useApp } from "../context/useApp";
import { translate, translateText, languages } from "../i18n";

/**
 * Custom hook for translations
 *
 * Usage:
 * const { t, language, languages, translateAsync } = useTranslation();
 *
 * // Static translations (from JSON files)
 * t('nav.home') // Returns "होम" if language is 'hi'
 * t('time.daysAgo', { count: 5 }) // Returns "5 दिन पहले"
 *
 * // Dynamic translations (API call)
 * const translated = await translateAsync('Hello World');
 */
export function useTranslation() {
  const { language } = useApp();

  // Main translation function for static content
  const t = useCallback(
    (key, variables = {}) => {
      return translate(key, language, variables);
    },
    [language],
  );

  // Async translation for dynamic content
  const translateAsync = useCallback(
    async (text, fromLang = "en") => {
      if (language === fromLang) return text;
      return translateText(text, fromLang, language);
    },
    [language],
  );

  // Get all available languages
  const availableLanguages = useMemo(() => {
    return Object.values(languages).map((lang) => ({
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName,
      flag: lang.flag,
    }));
  }, []);

  // Get current language info
  const currentLanguage = useMemo(() => {
    return languages[language] || languages.en;
  }, [language]);

  return {
    t,
    language,
    translateAsync,
    languages: availableLanguages,
    currentLanguage,
    isRTL: false, // All our languages are LTR
  };
}

export default useTranslation;
