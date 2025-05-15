// src/pages/AddToCart.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token'); 

    axios.get('https://mitdevelop.com/goudhan/admin/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json'
      }
    })
    .then(response => {
      setCartItems(response.data.cart);
      setCartTotal(response.data.cart_total);
    })
    .catch(error => {
      console.error("Error fetching cart data:", error);
    });
  }, []);

  
  const updateQuantity = (productId, quantity) => {
    const token = localStorage.getItem('token');

    
    axios.put(`https://mitdevelop.com/goudhan/admin/api/cart/update/${productId}`, 
      { quantity: quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      }
    )
    .then(response => {
     
      setCartItems(response.data.cart);
      setCartTotal(response.data.cart_total);
    })
    .catch(error => {
      console.error("Error updating cart item:", error);
    });
  };

  return (
    <>
      <div class="py-8 bg-[#4d953e1f] mb-12 border-b-8 border-[#4D953E]"><h1 class="text-[52px] text-center font-bold text-[#292929]">Add To Cart</h1><nav class="text-center"><ol class="inline-flex items-center space-x-2 text-[#4D953E] font-medium text-lg"><li><a href="/" class="hover:underline">Home</a></li><li><span>/</span></li><li><span class="text-[#292929]">Add To Cart</span></li></ol></nav></div>
<div className="bg-[#fff8f4]">
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <div className='grid grid-cols-1 xl:grid-cols-4 gap-5'>
          <div className='col-span-3 overflow-x-auto'>
            <table className='min-w-full bg-white text-left'>
              <thead>
                <tr className='text-[#292929] shadow-sm border-[#a8a8a8]'>
                  <th className='py-3 px-5'>Image</th>
                  <th className='py-3 px-5 w-[30%]'>Product Name</th>
                  <th className='py-3 px-5'>Price</th>
                  <th className='py-3 px-5'>Quantity</th>
                  <th className='py-3 px-5'>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className='border-b-1 border-[#f48643]'>
                    <td className='py-3 px-5'>
                      <img
                        src={`https://mitdevelop.com/goudhan/admin/storage/app/public/${item.product.image}`}
                        alt={item.product.name}
                        className='w-24'
                      />
                    </td>
                    <td className='py-3 px-5'>{item.product.name}</td>
                    <td className='py-3 px-5'>₹{parseFloat(item.product.price)}</td>
                    <td className='py-3 px-5'>
                      <input
                        type="number"
                        value={item.localQuantity ?? item.quantity}
                        min="1"
                        className="w-16 text-center border rounded"
                        onChange={(e) => {
                          const newQuantity = e.target.value;
                          setCartItems((prevItems) =>
                            prevItems.map((cartItem) =>
                              cartItem.product.id === item.product.id
                                ? { ...cartItem, localQuantity: newQuantity }
                                : cartItem
                            )
                          );
                        }}
                        onBlur={() => {
                          if ((item.localQuantity ?? item.quantity) !== item.quantity) {
                            updateQuantity(item.product.id, item.localQuantity);
                          }
                        }}
                      />
                    </td>
                    <td className='py-3 px-5'>₹{item.product_total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className='col-span-1 bg-white shadow-lg p-4'>
            <h2 className='text-xl font-semibold text-[#000000] mb-3'>Cart Total</h2>
            <div className='mb-3'>
              <div className='flex justify-between text-[#292929] font-medium mb-2'>
                <span>Original Cart Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className='flex justify-between text-[#292929] font-medium'>
                <span>Final Total</span>
                <span>₹{cartTotal}</span>
              </div>
            </div>
            <Link to="/Checkout"><button className='w-full bg-[#e0e0e0] text-[#575555] py-1 flex items-center justify-center gap-2 transition'>
              Proceed to checkout
              <span className="text-lg">➔</span>
            </button></Link>
            <button className='w-full mt-2 text-[#4d953e] py-1 flex items-center justify-center gap-2 hover:bg-[#4c953e17] transition'>
              ← Return to shopping
            </button>
            <div className='mt-3'>
              <h3 className='text-[#4d953e] font-semibold mb-2'>Coupon Apply</h3>
              <input
                type='text'
                placeholder='Coupon Code'
                className='w-full border px-2 py-1 mb-2 focus:outline-none placeholder:text-[12px]'
              />
              <button className='w-full bg-[#4d953e] text-white py-1 mt-2 hover:bg-[#4c953ece] transition'>Apply</button>
            </div>
          </div>
        </div>

        <div className='mt-6 text-right'>
          <p className='text-xl font-semibold'>Grand Total: ₹{cartTotal}</p>
        </div>
      </div>
      </div>
    </>
  );
};

export default AddToCart;
