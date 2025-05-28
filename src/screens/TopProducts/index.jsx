import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import cart from '../../assets/cart.svg';
import heart from '../../assets/heart.svg';
import axios from 'axios';

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('https://mitdevelop.com/goudhan/admin/api/products/latest')
      .then(res => {
        if (res.data.success) {
          setProducts(res.data.products);
        }
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
      });
  }, []);

  return (
    <section className='py-16 bg-[#fffaf7]'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center'>
          <h2 className='text-3xl sm:text-4xl font-bold text-[#292929]'>Top Selling Products</h2>
          <p className='mt-3 text-[#555] text-base sm:text-lg'>
            Explore our best-selling items, curated to meet your needs with exceptional quality.
          </p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14'>
          {products.map((product) => (
            <Link to={`/product/${product.slug}`} key={product.id} className='group'>
              <div className='relative bg-white border border-[#e3e3e3] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 hover:border-[#f48743]'>
                <div className='relative'>
                  {product.images?.length > 0 && (
                    <img
                      src={`https://mitdevelop.com/goudhan/admin/public/storage/${product.images[0].image_path}`}
                      alt={product.name}
                      className='w-full h-[250px]  transition-transform duration-300 group-hover:scale-105'
                    />
                  )}
                  {/* <img
                    src={heart}
                    alt='Favorite'
                    className='absolute top-3 right-3 w-5 h-5 opacity-70 hover:opacity-100 transition'
                  /> */}
                </div>
                <div className='px-4 py-5 bg-[#fff8f3]'>
                  <h4 className='text-lg font-semibold text-gray-800 truncate'>{product.name}</h4>
                  <p className='text-sm text-gray-600 mb-2'>GP: {product.go_points || 0}</p>
                  <div className='flex items-center justify-between mt-2'>
                    <div className='flex items-center gap-2'>
                      <p className='text-lg font-semibold text-[#333]'>₹{product.selling_price}</p>
                      <del className='text-sm text-[#F48643]'>₹{product.admin_mrp_price}</del>
                    </div>
                    <div className='flex items-center gap-1 text-sm text-[#333] cursor-pointer hover:text-[#f48743]'>
                      <img src={cart} alt='Add to Cart' className='w-5 h-5 hover:scale-110 transition-transform duration-200' />
                      <span>Cart</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopProducts;
