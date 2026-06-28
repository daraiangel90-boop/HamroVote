// frontend/src/components/sections/CTASection.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const CTASection = () => {
  const { t } = useTranslation();

  return (
   <section className="py-24 bg-slate-50">
    <div className="container mx-auto px-6">
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="
      relative
      overflow-hidden
      rounded-[32px]
      bg-gradient-to-br
      from-slate-900
      via-blue-950
      to-slate-900
      p-16
      text-center
      shadow-2xl
    "
  >
    {/* Glow Effects */}
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
    <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />

    <div className="relative z-10">
      <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
        {t('cta.title')}
      </h2>

      <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
        {t('cta.subtitle')}
      </p>

      <Link to="/register">
        <button
          className="
            px-10 py-4
            rounded-2xl
            bg-gradient-to-r
            from-blue-600
            to-cyan-500
            text-white
            font-semibold
            text-lg
            shadow-xl
            hover:scale-105
            transition-all
          "
        >
          {t('cta.button')}
        </button>
      </Link>
    </div>
  </motion.div>
</div>
   </section>)}
      
     export default CTASection;