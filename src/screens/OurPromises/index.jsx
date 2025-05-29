import React from 'react';
import { motion } from 'framer-motion';
// import { FaCow, FaAward, FaCertificate, FaUsers } from 'react-icons/fa'; // Using react-icons for icons

// Animation Variants
const fadeIn = (direction = 'up', delay = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
    x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      delay,
      duration: 0.8,
      ease: 'easeOut',
    },
  },
});

const cardHover = {
  hover: {
    scale: 1.05,
    y: -10,
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.3 },
  },
};

const FarmHighlights = () => {
  return (
    <section
      className="relative py-16 bg-cover bg-center bg-no-repeat"
      style={{
        // Fallback gradient if the background image isn't available
        backgroundImage: `linear-gradient(to bottom, rgba(253, 252, 250, 0.9), rgba(245, 247, 242, 0.9)), url('https://images.unsplash.com/photo-1500595046743-dd26eb716e7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FDFCFA]/80 to-[#F5F7F2]/80 z-0"></div>

      {/* Decorative Grass Element at the Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden z-10">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 80C100 60 200 90 300 70C400 50 500 80 600 60C700 40 800 70 900 50C1000 30 1100 60 1200 40C1300 20 1400 50 1440 30V100H0V80Z"
            fill="#A9C47F"
            opacity="0.5"
          />
          <path
            d="M0 90C120 70 240 100 360 80C480 60 600 90 720 70C840 50 960 80 1080 60C1200 40 1320 70 1440 50V100H0V90Z"
            fill="#4D953E"
            opacity="0.7"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-8 relative z-20">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn('up', 0.1)}
        >
          <h2 className="text-[#2D2D2D] text-3xl sm:text-4xl font-bold leading-tight">
            Goudhan Highlights
          </h2>
          <p className="text-[#6B7280] text-lg mt-4 max-w-2xl mx-auto">
            Discover what makes our dairy farm a trusted name in organic dairy production.
          </p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Highlight 1: Happy Cows */}
          <motion.div
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB]"
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            {/* <FaCow className="w-12 h-12 mb-4 text-[#4D953E]" /> */}
            <h3 className="text-[#2D2D2D] text-2xl font-bold">500+</h3>
            <p className="text-[#6B7280] text-base mt-2">Happy Cows</p>
            <p className="text-[#6B7280] text-sm mt-1">
              Raised with care on organic pastures.
            </p>
          </motion.div>

          {/* Highlight 2: Years of Excellence */}
          <motion.div
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB]"
            variants={fadeIn('up', 0.3)}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            {/* <FaAward className="w-12 h-12 mb-4 text-[#4D953E]" /> */}
            <h3 className="text-[#2D2D2D] text-2xl font-bold">20+</h3>
            <p className="text-[#6B7280] text-base mt-2">Years of Excellence</p>
            <p className="text-[#6B7280] text-sm mt-1">
              A legacy of quality and tradition.
            </p>
          </motion.div>

          {/* Highlight 3: Certified Organic */}
          <motion.div
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB]"
            variants={fadeIn('up', 0.4)}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            {/* <FaCertificate className="w-12 h-12 mb-4 text-[#4D953E]" /> */}
            <h3 className="text-[#2D2D2D] text-2xl font-bold">Certified</h3>
            <p className="text-[#6B7280] text-base mt-2">Organic</p>
            <p className="text-[#6B7280] text-sm mt-1">
              Meeting the highest organic standards.
            </p>
          </motion.div>

          {/* Highlight 4: Families Served */}
          <motion.div
            className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-lg border border-[#E5E7EB]"
            variants={fadeIn('up', 0.5)}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            {/* <FaUsers className="w-12 h-12 mb-4 text-[#4D953E]" /> */}
            <h3 className="text-[#2D2D2D] text-2xl font-bold">10K+</h3>
            <p className="text-[#6B7280] text-base mt-2">Families Served</p>
            <p className="text-[#6B7280] text-sm mt-1">
              Bringing joy to households every day.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FarmHighlights;