import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ProductDetail = () => {
  const { slug } = useParams(); // get slug from URL
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://mitdevelop.com/goudhan/api/product/${slug}`);
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
    const userId = 1; // Replace with actual user ID from authentication (e.g., context or cookies)

    const cartData = {
      product_id: product.id,
      user_id: userId,
      quantity: quantity,
    };

    try {
      const response = await fetch('https://mitdevelop.com/goudhan/api/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartData),
      });

      const data = await response.json();

      if (data.success) {
        // Successfully added to cart, maybe show a success message
        console.log('Product added to cart');
      } else {
        // Handle failure (e.g., product already in cart)
        console.log('Failed to add product to cart');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
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
                src={`https://mitdevelop.com/goudhan/storage/app/public/${product.image}`}
                alt={product.name}
                className='w-[80%] block m-auto'
              />
            </div>
            <div>
              <h2 className='text-[38px] font-bold text-[#292929]'>{product.name}</h2>
              <p className='text-[32px] text-[#4D953E] font-semibold pt-3 pb-3'>₹{parseFloat(product.price).toFixed(2)}</p>
              <p className='border-t border-b py-3 border-gray-300 text-[#3b3b3b] mb-5'>
                {product.description}
              </p>

              {/* Quantity Selector */}
              <div className='flex items-center gap-4 mb-5'>
                <span className='text-[18px] font-medium text-[#292929]'>Quantity:</span>
                <div className='flex items-center bg-gray-100 overflow-hidden'>
                  <button onClick={decrement} className='px-3 py-1 text-xl bg-[#F48643] text-white hover:bg-[#fff7f3] hover:text-[#292929] duration-150'>-</button>
                  <span className='px-4 text-lg'>{quantity}</span>
                  <button onClick={increment} className='px-3 py-1 text-xl bg-[#F48643] text-white hover:bg-[#fff7f3] hover:text-[#292929] duration-150'>+</button>
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
