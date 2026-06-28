// frontend/src/components/sections/HowItWorksSection.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import darkImg from '../../assets/images/darkImg.jpeg';

const HowItWorksSection = () => {
  const { t } = useTranslation();

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center"
        >
          <img
             src={darkImg}
             alt="How HamroVote Works"
             className="w-full max-w-6xl rounded-3xl shadow-2xl border border-gray-200"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;