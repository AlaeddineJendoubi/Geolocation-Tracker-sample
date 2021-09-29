import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

// tips: export each translation to a seperate file
const resources = {
  en: {
    translation: {
      english: 'English',
      french: 'Français',
      title: 'Location manager',
      previousLocation: 'Previous locations',
      recentLocation: 'Recent location',
      delete: 'DELETE',
      deleteAll: 'DELETE ALL LOCATIONS',
    },
  },
  fr: {
    translation: {
      title: "Gestionnaire de l'emplacement",
      previousLocation: 'Emplacements précédents',
      recentLocation: 'Emplacement récent',
      delete: 'EFFACER',
      deleteAll: 'SUPPRIMER TOUS LES EMPLACEMENTS',
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',

    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
