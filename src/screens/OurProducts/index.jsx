import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cart from '../../assets/cart.svg';
import heart from '../../assets/heart.svg';
import ourproductimg from '../../assets/ourproductimg.jpg';

const OurProducts = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://mitdevelop.com/goudhan/admin/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.products);
          setFiltered(data.products);
          setCategories(data.categories);
        }
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
      });
  }, []);

  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category?.name.trim() === selectedCategory);
    }

    result = result.filter(p => {
      const price = parseFloat(p.price);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (searchTerm.trim() !== '') {
      result = result.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (sortBy) {
      case 'priceLowHigh':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'priceHighLow':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      case 'category':
        result.sort((a, b) => a.category?.name.localeCompare(b.category?.name));
        break;
      case 'subcategory':
        result.sort((a, b) =>
          (a.subcategory?.name || '').localeCompare(b.subcategory?.name || '')
        );
        break;
      default:
        break;
    }

    setFiltered(result);
  }, [selectedCategory, priceRange, searchTerm, sortBy, products]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(prevCategory => (prevCategory === cat ? null : cat));
  };

  const handleProductClick = (productSlug) => {
    navigate(`/product/${productSlug}`);
  };

  return (
    <>
      {/* Banner Image */}
      <section
        className='bg h-[308px] bg-no-repeat bg-cover bg-top'
        style={{ backgroundImage: `url(${ourproductimg})` }}
      ></section>

      <section className='our-products py-12 bg-[#f4864308]'>
        <div className='container mx-auto px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>

            {/* Sidebar Filters */}
            <div className='col-span-1 bg-white p-4 border border-[#F48643] shadow-lg'>
              <h4 className='text-xl text-white font-semibold mb-4 p-2 bg-[#F48643]'>Filters</h4>

              {/* Category Filter */}
              <div className='mb-6'>
                <h5 className='font-medium text-[#404040] text-[20px] border-b mb-3'>Categories</h5>
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <label className='flex items-center space-x-2 mb-2'>
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
              <div className='bg-[#4f934112] p-3'>
                <h5 className='font-medium mb-2'>Price Range</h5>
                <input
                  type='range'
                  min='0'
                  max='100000'
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className='w-full accent-[#4d953e]'
                />
                <p className='text-sm mt-1'>Up to ₹{priceRange[1]}</p>
              </div>

            </div>

            {/* Main Content */}
            <div className='col-span-1 md:col-span-3'>

              {/* Search and Sort */}
              <div className='flex flex-col md:flex-row items-center justify-between mb-6'>
                <div className="relative w-full md:w-[100%] mb-4 md:mb-0">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="border px-4 py-2 pl-10  w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: '#fff' }}
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className='border px-4 py-2 md:ml-4 w-full md:w-[23%] bg-[#fff]'
                >
                  <option value=''>Sort By</option>
                  <option value='priceLowHigh'>Price: Low to High</option>
                  <option value='priceHighLow'>Price: High to Low</option>
                  <option value='category'>Category</option>
                  <option value='subcategory'>Subcategory</option>
                </select>
              </div>

              {/* Product Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                {filtered.length === 0 ? (
                  <div className='col-span-3 text-center text-gray-500'>
                    <p>No products available matching the selected filters.</p>
                  </div>
                ) : (
                  filtered.map((product) => (
                    <div
                      key={product.slug || product.id}
                      onClick={() => handleProductClick(product.slug)}
                      className='cursor-pointer'
                    >
                      <div className='relative'>
                        <img src={heart} className='absolute z-1 right-3 top-2 cursor-pointer' alt='Wishlist' />
                      </div>
                      <div className='border-1 bg-[#fff] p-3 border-[#e3e3e3] hover:shadow-xl hover:bg-[#fffaf7] hover:scale-105 duration-300'>
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : ''}
                          className='w-[94%] h-[300px] object-contain block m-auto'
                          alt={product.name}
                        />
                        <div className='bg-[#fff8f3] px-4 py-4'>
                          <h4 className='text-[20px] font-medium capitalize'>{product.name}</h4>
                          <div className='flex mt-2 items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <p className='text-[18px]'>₹{product.price}</p>
                              <p className='text-[#F48643] text-[18px]'><del>₹{product.mprice}</del></p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <img
                                src={cart}
                                alt='Add to Cart'
                                title='Add to Cart'
                                className='hover:scale-150 duration-200 cursor-pointer'
                              />
                              <p>Cart</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default OurProducts;
