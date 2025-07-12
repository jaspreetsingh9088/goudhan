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
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://goudhan.com/admin/api/products')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const allProducts = data.products;
          setProducts(allProducts);
          setFiltered(allProducts);
          const extractedCategories = extractCategoriesWithSubcategories(allProducts);
          setCategories(extractedCategories);
        }
      })
      .catch(err => {
        console.error('Failed to fetch products:', err);
      });
  }, []);

  const extractCategoriesWithSubcategories = (products) => {
    const categoryMap = {};

    products.forEach(p => {
      const catName = p.category?.name?.trim();
      const subcatName = p.subcategory?.name?.trim();

      if (catName) {
        if (!categoryMap[catName]) {
          categoryMap[catName] = {
            name: catName,
            subcategories: [],
          };
        }

        if (subcatName && !categoryMap[catName].subcategories.includes(subcatName)) {
          categoryMap[catName].subcategories.push(subcatName);
        }
      }
    });

    return Object.values(categoryMap).map((cat, index) => ({
      id: index,
      name: cat.name,
      subcategories: cat.subcategories.map((sub, idx) => ({ id: `${index}-${idx}`, name: sub })),
    }));
  };

  useEffect(() => {
    let result = [...products];

    if (selectedCategory) {
      result = result.filter(p => p.category?.name.trim() === selectedCategory);
    }

    if (selectedSubcategory) {
      result = result.filter(p => p.subcategory?.name.trim() === selectedSubcategory);
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
      default:
        break;
    }

    setFiltered(result);
  }, [selectedCategory, selectedSubcategory, priceRange, searchTerm, sortBy, products]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(prev => (prev === cat ? null : cat));
    setSelectedSubcategory(null); // reset subcategory
  };

  const handleProductClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  const [categorySearch, setCategorySearch] = useState('');

const filteredCategories = categories.filter(cat =>
  cat.name.toLowerCase().includes(categorySearch.toLowerCase())
);

const [currentPage, setCurrentPage] = useState(1);
const productsPerPage = 9;


const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = filtered.slice(indexOfFirstProduct, indexOfLastProduct);

const totalPages = Math.ceil(filtered.length / productsPerPage);

useEffect(() => {
  if (priceRange[0] > priceRange[1]) {
    setPriceRange([priceRange[1], priceRange[1]]);
  }
}, [priceRange]);

  return (
    <>
      {/* Banner */}
      <section
        className='bg h-[308px] bg-no-repeat bg-cover bg-top'
        style={{ backgroundImage: `url(${ourproductimg})` }}
      ></section>

      <section className='our-products py-12 '>
        <div className='container mx-auto px-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-5'>

            {/* Sidebar Filters */}
            <div className='col-span-1 bg-white p-4 border border-[#F48643] shadow-lg'>
              <h4 className='text-xl text-white font-semibold mb-4 p-2 bg-[#F48643]'>Filters</h4>

              {/* Category Filter */}
             {/* Category Filter with Scroll and Search */}
<div className='mb-6'>
  <h5 className='font-medium text-[#404040] text-[20px] border-b mb-3'>Categories</h5>
  
  {/* Category Search */}
  <input
    type='text'
    placeholder='Search category...'
    className='mb-3 p-2 w-full border rounded text-sm'
    value={categorySearch}
    onChange={(e) => setCategorySearch(e.target.value)}
  />

  <div className='max-h-[300px] overflow-y-auto pr-2'>
    {filteredCategories.map((cat) => (
      <div key={cat.id}>
        <label className='flex items-center space-x-2 mb-2'>
          <input
            type='radio'
            checked={selectedCategory === cat.name}
            onChange={() => handleCategoryChange(cat.name)}
          />
          <span>{cat.name}</span>
        </label>
        {selectedCategory === cat.name && cat.subcategories.length > 0 && (
          <div className='ml-5 mt-1'>
            {cat.subcategories.map((subcat) => (
              <label key={subcat.id} className='flex items-center space-x-2 mb-1'>
                <input
                  type='radio'
                  checked={selectedSubcategory === subcat.name}
                  onChange={() => setSelectedSubcategory(subcat.name)}
                />
                <span className='text-sm'>{subcat.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
</div>


          {/* Price Filter */}
<div className='bg-[#4f934112] p-3'>
  <h5 className='font-medium mb-2'>Price Range</h5>
  <div className="flex items-center gap-2">
    <input
      type='number'
      min='0'
      value={priceRange[0]}
      onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
      className='w-full px-2 py-1 border border-gray-300 rounded'
      placeholder='Min ₹'
    />
    <span className="text-gray-500">to</span>
    <input
      type='number'
      min='0'
      value={priceRange[1]}
      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
      className='w-full px-2 py-1 border border-gray-300 rounded'
      placeholder='Max ₹'
    />
  </div>
  <p className='text-sm mt-2 text-gray-600'>Showing products between ₹{priceRange[0]} - ₹{priceRange[1]}</p>
</div>

            </div>

            {/* Product Content */}
            <div className='col-span-1 md:col-span-3'>

              {/* Search and Sort */}
              <div className='flex flex-col md:flex-row items-center justify-between mb-6'>
                <div className="relative w-full md:w-[100%] mb-4 md:mb-0">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="border px-4 py-2 pl-10 w-full"
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
                </select>
              </div>

              {/* Product Grid */}
              <div className='grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-5'>
                {filtered.length === 0 ? (
                  <div className='col-span-3 text-center text-gray-500'>
                    <p>No products available matching the selected filters.</p>
                  </div>
                ) : (
                  currentProducts.map((product) => (
                    <div key={product.slug || product.id} onClick={() => handleProductClick(product.slug)} className='cursor-pointer'>
                      
              <div className='relative bg-white border border-[#e3e3e3] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 hover:border-[#f48743]'>
                        <img
                          src={product.images && product.images.length > 0 ? product.images[0] : ''}
                          className='w-full h-[250px]  transition-transform duration-300 group-hover:scale-105'
                          alt={product.name}
                        />
                        <div className='bg-[#fff8f3] px-6 py-4'>
<h4 className="text-[20px] font-medium capitalize truncate w-full" title={product.name}>
  {product.name}
</h4>
                          <p className='font-regular text-[18px]'>GP : {product.go_points || 0}</p>
                          <div className='flex mt-2 items-center justify-between'>
                            <div className='flex items-center gap-2'>
                              <p className='text-[18px]'>₹{product.price}</p>
                              <p className='text-[#F48643] text-[18px]'><del>₹{product.mprice}</del></p>
                            </div>
                            {/* <div className='flex items-center gap-1'>
                              <img
                                src={cart}
                                alt='Add to Cart'
                                title='Add to Cart'
                                className='hover:scale-150 duration-200 cursor-pointer'
                              />
                              <p>Cart</p>
                            </div> */}
                          </div>
                        </div>
                      </div>
                      
                    </div>
                    
                  ))
                )}
             
              </div>
                 <div className='pagination'>
                {totalPages > 1 && (
  <div className='mt-8 flex justify-center gap-2'>
    {Array.from({ length: totalPages }, (_, i) => (
      <button
        key={i}
        onClick={() => setCurrentPage(i + 1)}
        className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-[#F48643] text-white' : 'bg-white'}`}
      >
        {i + 1}
      </button>
    ))}
  </div>
)}</div>
            </div>


          </div>
        </div>
      </section>
    </>
  );
};

export default OurProducts;
