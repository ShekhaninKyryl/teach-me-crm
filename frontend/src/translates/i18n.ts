import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import ua from './locales/ua/translation.json';

i18n.use(initReactI18next).init({
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: true, // not needed for react as it escapes by default
  },
  saveMissing: false,
  lng: 'ua',
  resources: {
    en: { translation: en },
    ua: { translation: ua },
  },
});

export default i18n;
