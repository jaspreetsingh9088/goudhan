import React from 'react';
import { motion } from 'framer-motion';
import phoneIcon from '../../assets/phoneone.svg'; // Placeholder for phone icon
import emailIcon from '../../assets/emailtwo.svg'; // Placeholder for email icon
import clockIcon from '../../assets/watch.svg';   // Placeholder for clock icon

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
      duration: 0.6,
      ease: 'easeOut',
    },
  },
});

const cardHover = {
  hover: {
    scale: 1.05,
    boxShadow: '0px 8px 24px rgba(77, 149, 62, 0.2)',
    transition: { duration: 0.3 },
  },
};

const VisitOur = () => {
  return (
    <section className="bg-gradient-to-b from-[#F2F7F1] to-[#E8F0E5] py-20 my-20 relative overflow-hidden">
      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <svg className="w-full h-full" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 300C200 200 400 400 600 300C800 200 1000 400 1200 300C1400 200 1440 300 1440 300V600H0V300Z"
            fill="#4D953E"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn('up', 0.1)}
        >
          <p className="text-[#4D953E] text-lg sm:text-xl font-semibold tracking-wide">
            Connect With Us
          </p>
          <h2 className="text-[#292929] text-4xl sm:text-5xl font-bold leading-tight mt-4">
            Experience the Magic of Our Gaushala
          </h2>
          <p className="text-gray-600 text-lg mt-4 max-w-2xl mx-auto">
            Visit us to discover the care and tradition behind our delicious, organic dairy products.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Phone Card */}
          <motion.div
            className="text-center bg-[#4D953E] p-8 rounded-xl shadow-lg"
            variants={fadeIn('up', 0.2)}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            <img
              src={phoneIcon}
              alt="Phone Icon"
              className="block mx-auto mb-4 bg-white p-4 rounded-full w-16 h-16"
            />
            <h3 className="font-semibold text-xl text-white">Phone</h3>
            <p className="text-white text-base mt-2">+91 98765 43210</p>
          </motion.div>

          {/* Email Card */}
          <motion.div
            className="text-center bg-[#4D953E] p-8 rounded-xl shadow-lg"
            variants={fadeIn('up', 0.3)}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            <img
              src={emailIcon}
              alt="Email Icon"
              className="block mx-auto mb-4 bg-white p-4 rounded-full w-16 h-16"
            />
            <h3 className="font-semibold text-xl text-white">Email</h3>
            <p className="text-white text-base mt-2">contact@goudhan.com</p>
          </motion.div>

          {/* Working Hours Card */}
          <motion.div
            className="text-center bg-[#4D953E] p-8 rounded-xl shadow-lg"
            variants={fadeIn('up', 0.4)}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
          >
            <img
              src={clockIcon}
              alt="Clock Icon"
              className="block mx-auto mb-4 bg-white p-4 rounded-full w-16 h-16"
            />
            <h3 className="font-semibold text-xl text-white">Working Hours</h3>
            <p className="text-white text-base mt-2">Mon-Sat: 9 AM - 6 PM</p>
          </motion.div>
        </div>

        {/* Call to Action */}
        {/* <motion.div
          className="text-center mt-12"
          variants={fadeIn('up', 0.5)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <a
            href="mailto:contact@goudhanfarms.com"
            className="inline-block px-8 py-4 bg-[#4D953E] text-white rounded-full font-semibold text-lg hover:bg-[#3A7A2E] transition-all duration-300 shadow-md"
          >
            Get in Touch
          </a>
        </motion.div> */}
      </div>
    </section>
  );
};

export default VisitOur;