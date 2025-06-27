import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import Tilt from 'react-parallax-tilt';
import cart from '../../assets/cart.svg';
import heart from '../../assets/heart.svg';
import axios from 'axios';

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://goudhan.life/admin/api/products/latest')
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.products);
        } else {
          setError('Failed to load products.');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      });
  }, []);

  return (
    <section className="py-16 bg-[#FFFFFF] relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFFFFF]/10 to-[#FFFFFF]/10 animate-pulse-slow"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1A1A1A] font-poppins animate-slide-in-top">
            Top Selling Products
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 font-poppins max-w-2xl mx-auto animate-slide-in-top delay-100">
            Discover our best-selling items, crafted with exceptional quality to elevate your experience.
          </p>
        </div> */}
   <h2 className="text-[22px] font-bold pt-5 pb-3 px-4 text-[#171412] tracking-[-0.015em]">
              Top Selling Products
            </h2>
        {error ? (
          <p className="text-center text-red-500 text-lg font-poppins">{error}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-gray-600 text-lg font-poppins animate-pulse">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.map((product, index) => (
               
                <Link to={`/product/${product.slug}`} className="group block">
                  <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-1">
                    {/* Top Seller Badge */}
                    <span className="absolute top-3 left-3 bg-[#F48743] text-white text-xs font-semibold font-poppins px-3 py-1 rounded-full z-10">
                      Top Seller
                    </span>
                    {/* Favorite Icon */}
                    <img
                      src={heart}
                      alt="Add to Favorites"
                      className="absolute top-3 right-3 w-6 h-6 opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 z-10 cursor-pointer"
                    />
                    {/* Product Image */}
                    <div className="relative">
                      {product.images?.length > 0 ? (
                        <img
                          src={`https://goudhan.life/admin/public/storage/${product.images[0].image_path}`}
                          alt={product.name}
                          className="w-full h-[220px] sm:h-[250px] object-cover rounded-t-3xl transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-[220px] sm:h-[250px] bg-gray-200 rounded-t-3xl flex items-center justify-center">
                          <span className="text-gray-500 font-poppins">No Image</span>
                        </div>
                      )}
                    </div>
                    {/* Product Details */}
                    <div className="px-5 py-6 bg-gradient-to-t from-[#FFFFFF]/90 to-[#FFFFFF]/70">
                      <h4 className="text-lg sm:text-xl font-semibold text-black font-poppins truncate" title={product.name}>
                        {product.name}
                      </h4>
                      <p className="text-sm text-black/80 font-poppins mt-1">GP: {product.go_points || 0}</p>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <p className="text-lg sm:text-xl font-bold text-black font-poppins">₹{product.selling_price}</p>
                          <del className="text-sm text-black/60 font-poppins">₹{product.admin_mrp_price}</del>
                        </div>
                        {/* <div className="flex items-center gap-2 text-sm text-black font-poppins cursor-pointer group-hover:text-[#F48743] transition-colors duration-200">
                          <img
                            src={cart}
                            alt="Add to Cart"
                            className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                          />
                          <span className="font-semibold">Add to Cart</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </Link>
             
            ))}
          </div>
        )}


        
      </div>
    </section>
  );
};

export default TopProducts;