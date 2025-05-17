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
    <section className='top-products py-12 '>
      <div className='max-w-7xl mx-auto px-8'>
        <h2 className='text-center text-[#292929] text-[42px] font-bold'>Top Selling Products</h2>
        <p className='text-center text-[#292929] mt-2'>
          Explore our top-selling products, curated to meet your needs and<br />
          deliver exceptional quality
        </p>

        <div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 gap-8 mt-16'>
          {products.map((product) => (
            <Link to={`/product/${product.slug}`} key={product.id}>
              <div className='relative'>
                <img src={heart} className='absolute right-3 z-10 top-2' alt='Favorite' />
              </div>
              <div className='border p-5 border-[#e3e3e3] hover:border-[#f48743a1] hover:shadow-xl hover:bg-[#fffaf7] hover:scale-105 duration-300'>
                {product.images && product.images.length > 0 && (
                  <img
                    src={`https://mitdevelop.com/goudhan/admin/public/storage/${product.images[0].image_path}`}
                    alt={product.name}
                    className="w-[82%] block m-auto"
                  />
                )}
                <div className='bg-[#fff8f3] px-4 py-4 mt-3'>
                  <h4 className='text-[20px] mb-2 font-medium'>{product.name}</h4>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'> 
                      <p className='font-regular text-[18px]'>₹{product.selling_price}</p>
                      <p className='font-regular text-[#F48643] text-[18px]'>
                        <del>₹{product.marked_price}</del>
                      </p>
                    </div>
                    <div className='flex items-center gap-1'>
                      <img src={cart} alt='Add to Cart' title='Add to Cart' className='hover:scale-150 duration-200 cursor-pointer' />
                      <p>Cart</p>
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
