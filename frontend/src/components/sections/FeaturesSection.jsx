// frontend/src/components/sections/FeaturesSection.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t('features.biometric'),
      description: t('features.biometricDesc'),
      emoji: '🔐',
    },
    {
      title: t('features.coercion'),
      description: t('features.coercionDesc'),
      emoji: '🛡️',
    },
    {
      title: t('features.global'),
      description: t('features.globalDesc'),
      emoji: '🌍',
    },
    {
      title: t('features.tracker'),
      description: t('features.trackerDesc'),
      emoji: '📊',
    },
    {
      title: t('features.nrn'),
      description: t('features.nrnDesc'),
      emoji: '🤝',
    },
    {
      title: t('features.blockchain'),
      description: t('features.blockchainDesc'),
      emoji: '⛓️',
    },
  ];

  return (
   <section className="bg-white pt-32 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t('features.heading')}{' '}
            <span className="text-blue-600">{t('app.title')}</span>
          </h2>
          <p className="text-lg text-gray-600">{t('features.subheading')}</p>
        </motion.div>

        <div
           className="
              grid
              md:grid-cols-2
              lg:grid-cols-3
              gap-0
              overflow-hidden
              rounded-3xl
              border
              border-slate-700
              bg-[#211c1c]
              shadow-2xl
            "
         >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="
                p-8
                hover:bg-slate-800
                hover:-translate-y-2
                hover:shadow-2xl
                transition-all
                duration-300
                text-center"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl border border-blue-500/20">
  {feature.emoji}
</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;