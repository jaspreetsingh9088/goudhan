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
        const response = await fetch(`https://goudhan.life/admin/api/product/${slug}`);
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

  if (!product || quantity < 1) {
    alert('Invalid product or quantity');
    return;
  }

  const total_price = (parseFloat(product.selling_price) * quantity).toFixed(2); // total_price should be a string if your DB uses varchar

  const cartData = {
    product_id: product.id,
    quantity: quantity,
    total_price: total_price,
  };

  try {
    const response = await fetch('https://goudhan.life/admin/api/add-to-cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cartData),
    });

    const data = await response.json();

    if (data.success) {
      navigate('/cart');
    } else {
      alert(data.message || 'Failed to add product to cart');
      console.log('Failed to add product to cart:', data);
    }
  } catch (error) {
    console.error('Error adding product to cart:', error);
    alert('An error occurred. Please try again.');
  }
};


const handleUpdateQuantity = async (newQuantity) => {
  if (newQuantity < 1) return; // Prevent invalid update

  setQuantity(newQuantity); // Update UI immediately

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please log in to update your cart.');
    return;
  }

  try {
    const response = await fetch(`https://goudhan.life/admin/api/cart/update/${product.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    const data = await response.json();

    if (response.ok && data.message === 'Cart updated successfully') {
      console.log('Cart updated successfully:', data);
      // Optionally show a toast or message
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
    src={`https://goudhan.life/admin/storage/app/public/${product.images[0]?.image_path}`}
    alt={product.name}
    className='w-[80%] block m-auto'
  />
</div>

<div>
  <div className='flex items-center gap-2 mb-5'>
    <p className='bg-[#F48643] w-fit font-medium text-white px-3 text-[18px] rounded'>
      {product.discount}% Off
    </p>
    <p className={`w-fit font-medium text-[18px] px-3 rounded ${
      product.quantity > 0 ? 'bg-[#ddebdb] text-[#4d953e]' : 'bg-[#f8d7da] text-[#721c24]'
    }`}>
      {product.quantity > 0 ? 'In Stock' : 'Out of Stock'}
    </p>
  </div>

  <h2 className='text-[38px] font-bold text-[#194a33]'>{product.name}</h2>

  <div className='flex items-center gap-2 '>
    <div><p className='text-[32px] text-[#292929] pt-3 pb-3'>₹{parseFloat(product.selling_price).toFixed(2)}</p></div>
    <div><p className='text-[32px] text-[#F48643] pt-3 pb-3'><del>₹{parseFloat(product.marked_price).toFixed(2)}</del></p></div>
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
    const newQty = quantity - 1;
    if (newQty >= 1) {
      handleUpdateQuantity(newQty);
    }
  }}
  className='px-3 py-1 text-xl border-r border-[#bebebe] text-black hover:bg-[#fff7f3] hover:text-[#292929] duration-150'
>
  -
</button>

<span className='px-4 text-lg'>{quantity}</span>

<button
  onClick={() => {
    const newQty = quantity + 1;
    handleUpdateQuantity(newQty);
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
              <h3 className='bg-[#4c953e1c] px-5 py-1 mt-5 text-[24px] font-bold text-[#4d953e] px-5 w-fit'>Description</h3>
              <div className='border border-[#ebebeb]  p-5'>
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
