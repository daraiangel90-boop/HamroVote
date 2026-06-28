// frontend/src/components/sections/HeroSection.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useWeb3 } from '../../context/Web3Context';

import backgroundImage from '../../assets/images/bck3.jpg';
import heroCartoon from '../../assets/images/cartoon_evote1.jpeg';
import votingImage from '../../assets/images/e-vote1.jpeg';
import newImage from '../../assets/images/bck2.jpeg';

const HeroSection = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { isConnected, connectWallet } = useWeb3();

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const stats = [
    { value: '7.5M+', label: t('hero.statsNRN') },
    { value: 'In 112', label: t('hero.statsCountries') },
    { value: '99%', label: t('hero.statsTransparent') },
  ];

  return (
    <section
      className="relative min-h-[85vh] flex items-center overflow-hidden pt-28"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '110%',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-slate-950/50 to-black/70" />

      {/* Smooth transition from transparent navbar */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/50 to-transparent z-10" />

      {/* Decorative Blur */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />

      {/* Floating Cartoon Images */}

      {/* Top Left */}
      <motion.div
        variants={floatingAnimation}
        animate="animate"
        className="absolute top-24 left-16 hidden xl:block z-10"
      >
        <div className="w-28 h-28 rounded-full overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.25)]">
          <img
            src={votingImage}
            alt="eVote"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Top Right */}
      <motion.div
        variants={floatingAnimation}
        animate="animate"
        className="absolute top-24 right-20 hidden xl:block z-10"
      >
        <div className="w-40 h-40 rounded-full overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.25)]">
          <img
            src={newImage}
            alt="eVote"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Bottom Right */}
      <motion.div
        variants={floatingAnimation}
        animate="animate"
        className="absolute bottom-24 right-32 hidden xl:block z-10"
        style={{ animationDelay: '1s' }}
      >
        <div className="w-32 h-32 rounded-full overflow-hidden backdrop-blur-xl bg-white/10 border border-white/20 shadow-[0_0_50px_rgba(59,130,246,0.25)]">
          <img
            src={heroCartoon}
            alt="eVote"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-[1600px] mx-auto pl-8 md:pl-12 lg:pl-20 xl:pl-24 pr-6 py-16 lg:py-20">
        <motion.div
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <div className="space-y-8 text-white">
            <motion.div variants={fadeInUp}>
              <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-blue-100 text-sm font-medium shadow-lg">
                {t('hero.badge')}
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="
              text-2xl
              sm:text-3xl
              lg:text-4xl
              xl:text-6xl
              font-black
              leading-[1.3]
              tracking-tight
              "
              >
              {t('hero.title')}

              <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-200 bg-clip-text text-transparent">
                {t('hero.titleHighlight')}
              </span>

              <span className="block text-gray-200 mt-2">
                {t('hero.subtitle')}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="
                text-lg
                lg:text-xl
                text-gray-300
                leading-relaxed
                max-w-2xl
              "
            >
              {t('hero.description')}
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4 items-center"
            >
              {!isAuthenticated ? (
                <Link to="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                      px-8 py-4
                      bg-gradient-to-r
                      from-blue-600
                      to-blue-500
                      hover:from-blue-700
                      hover:to-blue-600
                      rounded-2xl
                      text-white
                      font-semibold
                      shadow-xl
                      transition-all
                    "
                  >
                    {t('hero.cta')}
                  </motion.button>
                </Link>
              ) : (
                <Link to="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="
                      px-8 py-4
                      bg-gradient-to-r
                      from-blue-600
                      to-blue-500
                      hover:from-blue-700
                      hover:to-blue-600
                      rounded-2xl
                      text-white
                      font-semibold
                      shadow-xl
                      transition-all
                    "
                  >
                    {t('hero.ctaDashboard')}
                  </motion.button>
                </Link>
              )}

              {!isConnected && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={connectWallet}
                  className="
                    px-8 py-4
                    bg-white/10
                    backdrop-blur-md
                    border
                    border-white/20
                    hover:bg-white/20
                    rounded-2xl
                    text-white
                    font-semibold
                    transition-all
                  "
                >
                  {t('hero.ctaWallet')}
                </motion.button>
              )}
            </motion.div>

            {/* Stats Glass Card */}
            <motion.div
              variants={fadeInUp}
              className="
                grid
                grid-cols-3
                gap-8
                mt-10
                p-6
                max-w-xl
                bg-white/5
                backdrop-blur-xl
                rounded-3xl
                border
                border-white/10
              "
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl md:text-4xl font-black text-blue-400">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-400 mt-2 leading-8 px-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;