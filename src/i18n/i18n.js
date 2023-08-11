import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector'; // todo install : i18next-browser-languagedetector

import csTranslation from '../locales/cs.json'; // Import the JSON file
import enTranslation from '../locales/en.json';

const resources = {
  en: {
    translation: enTranslation,
  },
  cs: {
    translation: csTranslation,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'cs',
  fallbackLng: 'en',
  debug: true,
  supportedLngs: ['cs', 'en'],
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
