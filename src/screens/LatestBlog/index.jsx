import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaCalendarAlt } from 'react-icons/fa'; // Icons for author and date

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
    scale: 1.03,
    y: -10,
    boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.15)',
    transition: { duration: 0.3 },
  },
};

const LatestBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('https://goudhan.life/admin/api/blogs')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlogs(data.data);
        }
      })
      .catch((err) => console.error('Error fetching blogs:', err));
  }, []);

  return (
    <section className="relative py-16 bg-gradient-to-b from-[#FDFCFA] to-[#F5F7F2] mb-20">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 1440 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 200C200 100 400 300 600 200C800 100 1000 300 1200 200C1400 100 1440 200 1440 200V400H0V200Z"
            fill="#A9C47F"
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
          <h2 className="text-[#2D2D2D] text-4xl sm:text-5xl font-bold leading-tight">
            Latest Blog
          </h2>
          <p className="text-[#6B7280] text-lg mt-4 max-w-2xl mx-auto">
            Discover insights, tips, and the latest updates in our newest blog posts
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {blogs.map((blog) => (
            <motion.div
              key={blog.id}
              className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden"
              variants={fadeIn('up', 0.2)}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: true }}
            >
              {/* Blog Image */}
              <div className="relative">
                <img
                  src={`https://goudhan.life/admin/public/uploads/blogs/${blog.image}`}
                  alt={blog.title}
                  className="w-full h-56 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Blog+Image'; // Fallback image
                    e.target.alt = 'Placeholder image';
                  }}
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-[#4D953E]/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Blog Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Meta Information */}
                <div className="flex gap-3 justify-center mb-4">
                  <div className="flex items-center gap-1 bg-[#DFECDC] text-[#4D953E] text-sm px-3 py-1 rounded-full">
                    <FaUser className="w-4 h-4" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FDEBDF] text-[#F48643] text-sm px-3 py-1 rounded-full">
                    <FaCalendarAlt className="w-4 h-4" />
                    <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Blog Title */}
                <h3 className="text-[#2D2D2D] text-xl font-semibold leading-tight mb-4 line-clamp-2">
                  {blog.title}
                </h3>

                {/* Read More Button */}
                <a href={`/blog/${blog.slug}`} className="mt-auto">
                  <button className="w-full py-3 bg-[#4D953E] text-white text-lg font-semibold rounded-lg hover:bg-[#3A7A2E] transition-colors duration-300">
                    Read More
                  </button>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;