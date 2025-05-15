import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate

const ProductDetail = () => {
  const { slug } = useParams(); // Get slug from URL
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://mitdevelop.com/goudhan/admin/api/product/${slug}`);
        const data = await response.json();
        if (data.success) {
          setProduct(data.product);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please log in to add products to your cart.');
      return;
    }

    const cartData = {
      product_id: product.id,
      quantity: quantity,
    };

    try {
      const response = await fetch('https://mitdevelop.com/goudhan/admin/api/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 👈 Required for auth:sanctum
        },
        body: JSON.stringify(cartData),
      });

      const data = await response.json();

      if (data.success) {
        navigate('/cart');
      } else {
        console.log('Failed to add product to cart:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  const handleUpdateQuantity = async (productId, updatedQuantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to update your cart.');
      return;
    }

    try {
      const response = await fetch(`https://mitdevelop.com/goudhan/admin/api/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 👈 Required for auth:sanctum
        },
        body: JSON.stringify({ quantity: updatedQuantity }),
      });

      const data = await response.json();

      if (data.success) {
        // Optionally, you can update the UI with the new quantity or show a success message
        console.log('Cart updated successfully:', data);
      } else {
        console.log('Failed to update cart:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  if (!product) return <div className='text-center py-10'>Loading product...</div>;

  return (
    <>
      <section className='single-product'>
        <div className='border-t'>
          <div className='flex gap-3 max-w-7xl mx-auto px-8 py-2 pt-5'>
            <div><p className='text-[18px]'>Home</p></div>
            <div><p className='text-[18px]'>|</p></div>
            <div><p className='text-[#818181] text-[18px]'>{product.name}</p></div>
          </div>
        </div>

        <div className='max-w-7xl mx-auto px-8'>
          <div className='grid grid-cols-1 xl:grid-cols-2 gap-8'>
            <div className='bg-[#fff7f3]'>
              <img
                src={`https://mitdevelop.com/goudhan/admin/storage/app/public/${product.image}`}
                alt={product.name}
                className='w-[80%] block m-auto'
              />
            </div>
            <div>
              <div className='flex items-center gap-2 mb-5'>
              <p className='bg-[#F48643] w-fit font-medium text-white px-3 text-[18px] rounded'>30% Off</p>
              <p className='bg-[#ddebdb] w-fit font-medium text-[#4d953e] text-[18px] px-3 rounded'>Instock</p>
            </div>
              <h2 className='text-[38px] font-bold text-[#194a33]'>{product.name}</h2>
              <div className='flex items-center gap-2 '>
                <div><p className='text-[32px] text-[#292929] pt-3 pb-3'>₹{parseFloat(product.price).toFixed(2)}</p></div>
                <div><p className='text-[32px] text-[#F48643] pt-3 pb-3'><del>₹3000.00</del></p></div>
              </div>
              
              <p className='border-t py-3 border-gray-300 text-[#3b3b3b] mb-5'>
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className='flex items-center gap-4 mb-5'>
                <span className='text-[18px] font-medium text-[#292929]'>Quantity:</span>
                <div className='flex items-center bg-white border border-[#bebebe] overflow-hidden'>
                  <button
                    onClick={() => {
                      decrement();
                      handleUpdateQuantity(product.id, quantity - 1);
                    }}
                    className='px-3 py-1 text-xl border-r border-[#bebebe] text-black hover:bg-[#fff7f3] hover:text-[#292929] duration-150'
                  >
                    -
                  </button>
                  <span className='px-4 text-lg'>{quantity}</span>
                  <button
                    onClick={() => {
                      increment();
                      handleUpdateQuantity(product.id, quantity + 1);
                    }}
                    className='px-3 py-1 text-xl border-l border-[#bebebe] text-black hover:bg-[#fff7f3] hover:text-[#292929] duration-150'
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart} // Trigger the add to cart action
                className='w-full flex justify-center gap-3 font-semibold hover:shadow-lg py-2 text-[#fff] hover:bg-[#F48643] hover:text-[#fff] bg-[#F48643] duration-150'
              >
                Add To Cart
              </button>
            </div>
          </div>

          {/* Product description */}
          <div className='productdes'>
            <div className='grid grid-cols-1 xl:grid-cols-1'>
              <h3 className='bg-[#4d953e] px-5 py-1 mt-5 text-[24px] font-bold text-white'>Description</h3>
              <div className='border border-[#ebebeb] border-t-0 p-5'>
                <h2 className='text-[24px] font-bold border-[#f48643]'>Product Detail</h2>
                <p className='pt-2'>{product.description}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetail;
