// frontend/src/components/common/Footer.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white border-t border-white/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🗳️</span>
              <span className="text-xl font-bold">{t('app.title')}</span>
            </div>
            <p >
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-white">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#features" className="text-slate-300 hover:text-cyan-400 transition duration-300">
                  {t('footer.features')}
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-slate-300 hover:text-cyan-400 transition duration-300">
                  {t('footer.howItWorks')}
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-300 hover:text-cyan-400 transition duration-300">
                  {t('footer.faq')}
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">{t('footer.support')}</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition">
                  {t('footer.helpCenter')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  {t('footer.terms')}
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">{t('footer.connect')}</h4>
            <div className="flex gap-4">
              <a href="#" className="text-slate-300 hover:text-cyan-400 transition duration-300 text-2xl hover:scale-110">
                🐦
              </a>
              <a href="#" className="text-slate-300 hover:text-cyan-400 transition duration-300 text-2xl hover:scale-110">
                📘
              </a>
              <a href="#" className="text-slate-300 hover:text-cyan-400 transition duration-300 text-2xl hover:scale-110">
                🔗
              </a>
              <a href="#" className="text-slate-300 hover:text-cyan-400 transition duration-300 text-2xl hover:scale-110">
                ✉️
              </a>
            </div>
            <p className="text-gray-400 text-xs mt-4">
              © 2025 {t('app.title')}. {t('footer.rights')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;