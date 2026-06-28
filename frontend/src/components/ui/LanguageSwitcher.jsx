// frontend/src/components/ui/LanguageSwitcher.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'np' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('preferredLanguage', nextLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-orange-700 hover:text-blue-600 hover:bg-blue-50/80 rounded-lg transition-all duration-200"
    >
      {i18n.language === 'en' ? (
        <>
          <span>🇳🇵</span>
          <span className="font-nepali">नेपाली</span>
        </>
      ) : (
        <>
          <span>🇬🇧</span>
          <span>English</span>
        </>
      )}
    </button>
  );
};

export default LanguageSwitcher;