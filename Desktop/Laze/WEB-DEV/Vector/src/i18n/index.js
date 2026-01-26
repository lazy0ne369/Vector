import en from "./locales/en.json";
import hi from "./locales/hi.json";
import te from "./locales/te.json";
import or from "./locales/or.json";

// All available languages
export const languages = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    translations: en,
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    translations: hi,
  },
  te: {
    code: "te",
    name: "Telugu",
    nativeName: "తెలుగు",
    flag: "🇮🇳",
    translations: te,
  },
  or: {
    code: "or",
    name: "Odia",
    nativeName: "ଓଡ଼ିଆ",
    flag: "🇮🇳",
    translations: or,
  },
};

export const defaultLanguage = "en";

// Get nested translation value using dot notation
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// Replace template variables like {{count}}
function interpolate(text, variables = {}) {
  if (typeof text !== "string") return text;

  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return variables[key] !== undefined ? variables[key] : match;
  });
}

// Main translation function
export function translate(key, lang = defaultLanguage, variables = {}) {
  const language = languages[lang] || languages[defaultLanguage];
  const translations = language.translations;

  let value = getNestedValue(translations, key);

  // Fallback to English if translation not found
  if (value === undefined && lang !== defaultLanguage) {
    value = getNestedValue(languages[defaultLanguage].translations, key);
  }

  // Return key if still not found
  if (value === undefined) {
    console.warn(`Translation missing for key: ${key}`);
    return key;
  }

  return interpolate(value, variables);
}

// MyMemory API for dynamic content translation
const MYMEMORY_API = "https://api.mymemory.translated.net/get";

// Language codes for MyMemory API
const apiLangCodes = {
  en: "en",
  hi: "hi",
  te: "te",
  or: "or",
};

// Translate dynamic text using MyMemory API
export async function translateText(text, fromLang = "en", toLang = "hi") {
  if (!text || fromLang === toLang) return text;

  const from = apiLangCodes[fromLang] || "en";
  const to = apiLangCodes[toLang] || "hi";

  try {
    const response = await fetch(
      `${MYMEMORY_API}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`,
    );

    if (!response.ok) throw new Error("Translation failed");

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }

    return text;
  } catch (error) {
    console.warn("Translation API error:", error);
    return text;
  }
}

// Batch translate multiple texts
export async function translateBatch(texts, fromLang = "en", toLang = "hi") {
  if (!Array.isArray(texts) || fromLang === toLang) return texts;

  const results = await Promise.all(
    texts.map((text) => translateText(text, fromLang, toLang)),
  );

  return results;
}

export default { languages, translate, translateText, translateBatch };
