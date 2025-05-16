import React, { useEffect, useState } from 'react';

const LatestBlog = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetch('https://mitdevelop.com/goudhan/admin/api/blogs')  // <-- correct API endpoint
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBlogs(data.data);  // <-- data is inside `data` key in response
        }
      })
      .catch((err) => console.error('Error fetching blogs:', err));
  }, []);

  return (
    <section className='Latest-Blog mb-20'>
      <div className='max-w-7xl mx-auto px-8'>
        <h2 className='text-[#292929] text-[42px] font-bold leading-[48px] text-center'>Latest Blog</h2>
        <p className='text-[#292929] mt-4 text-center'>
          Discover insights, tips, and the latest updates in <br />
          our newest blog posts
        </p>

        <div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 gap-8 items-center mt-18'>
          {blogs.map((blog) => (
            <div key={blog.id}>
              <div className='border-1 border-[#292929] p-4 hover:bg-[#fff9f5] duration-200'>
                <img
                  src={`https://mitdevelop.com/goudhan/admin/public/uploads/blogs/${blog.image}`}  // <-- fixed image URL
                  alt={blog.title}
                  className='w-full h-60 object-cover'
                />
                <div className='flex gap-2 justify-center mt-3'>
                  <div className='bg-[#DFECDC] w-[50%] text-center p-1'>Admin : {blog.author}</div>
                  <div className='bg-[#FDEBDF] w-[50%] text-center p-1'>
                    Date: {new Date(blog.created_at).toLocaleDateString()}
                  </div>
                </div>
                <h3 className='font-semibold text-[20px] text-[#292929] leading-6.5 mt-3'>
                  {blog.title}
                </h3>
              </div>
              <a href={`/blog/${blog.slug}`}>
                <button className='border-1 border-t-0 border-[#292929] w-full p-2 text-[18px] hover:bg-[#F48643] duration-200 hover:text-white'>
                  Read More
                </button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestBlog;
