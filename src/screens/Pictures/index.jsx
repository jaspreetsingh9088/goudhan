import React from 'react';
import { motion } from 'framer-motion';
import icon1 from '../../assets/28.png'; // Placeholder for "100% Organic" icon
import icon2 from '../../assets/29.png';  // Placeholder for "Award Winning Quality" icon
import icon3 from '../../assets/30.png'; // Placeholder for "Healthy & Nutritious" icon
import icon4 from '../../assets/31.png';   // Placeholder for "Safe Environment" icon
import centerImage from '../../assets/cow-img.png'; // Placeholder for the central cow image
import icon5 from '../../assets/shape.png'; // Placeholder for the central cow image


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

const WhyChooseUs = () => {
  return (
    <section className="bg-white py-12 mt-12" id="why-choose-us">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Left Features */}
          <div className="space-y-8">
            <motion.div
              className="flex items-start gap-3"
              variants={fadeIn('left', 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img src={icon1} alt="Organic" className="w-10 h-10 p-2 rounded-full border-2 border-[#4CAF50]" />
              <div>
                <h4 className="text-lg font-bold text-black uppercase">100% Organic</h4>
                <p className="text-gray-600 text-xs mt-1 max-w-[200px]">
                  Continued at up to zealously surrounded sir motionless she end literature derived.
                </p>
              </div>
            </motion.div>
            <div className="border-t border-[#4CAF50] w-3/4" /> {/* Separator */}
            <motion.div
              className="flex items-start gap-3"
              variants={fadeIn('left', 0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img src={icon2} alt="Award Winning" className="w-10 h-10 p-2 rounded-full border-2 border-[#4CAF50]" />
              <div>
                <h4 className="text-lg font-bold text-black uppercase">Award Winning Quality</h4>
                <p className="text-gray-600 text-xs mt-1 max-w-[200px]">
                  Mentions at up to zealously surrounded sir motionless she end literature derived.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Center Image */}
          <div className="relative flex justify-center items-center">
            {/* Yellow Circle Background */}
            <motion.div
              className="absolute w-95 h-100 bg-[#4caf50] rounded-full"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              viewport={{ once: true }}
            />
            {/* Cow Image */}
            <motion.img
              src={centerImage}
              alt="Cow Illustration"
              className="relative w-72 h-72 object-contain z-10"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            />
            {/* Badge Overlay */}
            <motion.div
              className="absolute bottom-2 left-2 bg-[#dd7645] rounded-full px-4 py-2 text-center z-20"
              style={{
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 80% 100%, 0% 100%)', // Custom shape to match the image
              }}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-xl font-bold text-white">150+</div>
              <span className="text-xs text-white uppercase">Products</span>
            </motion.div>
          </div>

          {/* Right Features */}
          <div className="space-y-8 text-left">
            <motion.div
              className="flex items-start gap-3"
              variants={fadeIn('right', 0.1)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img src={icon3} alt="Healthy" className="w-10 h-10 p-2 rounded-full border-2 border-[#4CAF50]" />
              <div>
                <h4 className="text-lg font-bold text-black uppercase">Healthy & Nutritious</h4>
                <p className="text-gray-600 text-xs mt-1 max-w-[200px]">
                  Trysonic at up to zealously surrounded sir motionless she end literature derived.
                </p>
              </div>
            </motion.div>
            <div className="border-t border-[#4CAF50] w-3/4" /> {/* Separator */}
            <motion.div
              className="flex items-start gap-3"
              variants={fadeIn('right', 0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <img src={icon4} alt="Safe Environment" className="w-10 h-10 p-2 rounded-full border-2 border-[#4CAF50]" />
              <div>
                <h4 className="text-lg font-bold text-black uppercase">Safe Environment</h4>
                <p className="text-gray-600 text-xs mt-1 max-w-[200px]">
                  Continued at up to zealously surrounded sir motionless she end literature derived.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;