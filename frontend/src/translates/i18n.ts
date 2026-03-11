import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import ua from "./locales/ua/translation.json";
import {
  DEFAULT_LANGUAGE,
  isSupportedLanguage,
  PREFERRED_LANGUAGE_KEY,
  SUPPORTED_LANGUAGES,
} from "@/constants/language";

const getInitialLanguage = () => {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const fromStorage = localStorage.getItem(PREFERRED_LANGUAGE_KEY);
  return fromStorage && isSupportedLanguage(fromStorage) ? fromStorage : DEFAULT_LANGUAGE;
};

i18n.use(initReactI18next).init({
  fallbackLng: DEFAULT_LANGUAGE,
  debug: false,
  interpolation: {
    escapeValue: true, // not needed for react as it escapes by default
  },
  saveMissing: false,
  lng: getInitialLanguage(),
  supportedLngs: [...SUPPORTED_LANGUAGES],
  resources: {
    en: { translation: en },
    ua: { translation: ua },
  },
});

export default i18n;
