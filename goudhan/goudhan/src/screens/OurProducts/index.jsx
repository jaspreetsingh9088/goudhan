import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import cart from '../../assets/cart.svg';
import heart from '../../assets/heart.svg';

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const navigate = useNavigate(); // Use useNavigate for redirection

  useEffect(() => {
    fetch('https://mitdevelop.com/goudhan/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
          setFiltered(data.products);
          setCategories(data.categories); // Now using the full categories list
        }
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
      });
  }, []);

  // Filtering logic
  useEffect(() => {
    let result = products;

    // Filter by selected category (only one category at a time)
    if (selectedCategory) {
      result = result.filter(p => p.category?.name.trim() === selectedCategory);
    }

    // Filter by price
    result = result.filter(p => {
      const price = parseFloat(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    setFiltered(result);
  }, [selectedCategory, priceRange, products]);

  const handleCategoryChange = (cat) => {
    // Allow only one category to be selected at a time
    setSelectedCategory(prevCategory => (prevCategory === cat ? null : cat));
  };

 const handleProductClick = (productSlug) => {
  navigate(`/product/${productSlug}`);
};


  return (
    <section className='our-products py-12 bg-[#f9f9f9]'>
      <div className='max-w-7xl mx-auto px-8'>
        <h2 className='text-center text-[#292929] text-[42px] font-bold'>Our Products</h2>
        <p className='text-center text-[#292929] mt-2'>
          Discover our premium range of products, made with love and purity<br />
          to promote holistic well-being.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-4 gap-8 mt-16'>
          {/* Sidebar */}
          <div className='col-span-1 bg-white p-4 rounded shadow-md'>
            <h4 className='text-xl font-semibold mb-4'>Filters</h4>

            {/* Category Filter */}
            <div className='mb-6'>
              <h5 className='font-medium mb-2'>Categories</h5>
              {categories.map((cat) => (
                <div key={cat.id}>
                  <label className='flex items-center space-x-2'>
                    <input
                      type='radio'
                      checked={selectedCategory === cat.name.trim()}
                      onChange={() => handleCategoryChange(cat.name.trim())}
                    />
                    <span>{cat.name.trim()}</span>
                  </label>
                </div>
              ))}
            </div>

            {/* Price Filter */}
            <div>
              <h5 className='font-medium mb-2'>Price Range</h5>
              <input
                type='range'
                min='0'
                max='100000'
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, Number(e.target.value)])}
              />
              <p className='text-sm mt-1'>Up to ₹{priceRange[1]}</p>
            </div>
          </div>

          {/* Product Grid */}
          <div className='col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {filtered.length === 0 ? (
              <div className='col-span-3 text-center text-gray-500'>
                <p>No products available matching the selected filters.</p>
              </div>
            ) : (
              filtered.map((product) => (
                <div key={product.slug} onClick={() => handleProductClick(product.slug)} className='cursor-pointer'>
                  <div className='relative'>
                    <img src={heart} className='absolute right-3 top-2 cursor-pointer' alt='Wishlist' />
                  </div>
                  <div className='border-1 border-[#000] hover:border-[#F48643] duration-300'>
                    <img
                      src={product.image.replace(
                        '/storage/products/products/',
                        '/public/storage/products/'
                      )}
                      className='w-[94%] h-[300px] object-contain block m-auto'
                      alt={product.name}
                    />
                  </div>
                  <h4 className='text-[20px] text-center mt-3 font-medium capitalize'>
                    {product.name}
                  </h4>
                  <div className='border-1 grid grid-cols-2 border-[#E2E2E2] mt-4'>
                    <p className='text-center border-r border-[#E2E2E2] p-2 text-[18px]'>
                      ₹{product.price}
                    </p>
                    <div className='flex justify-center items-center'>
                      <img
                        src={cart}
                        alt='Add to Cart'
                        title='Add to Cart'
                        className='hover:scale-150 duration-200 cursor-pointer'
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurProducts;
