import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  const fetchCart = () => {
    axios.get('https://mitdevelop.com/goudhan/admin/api/cart', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })
    .then(response => {
      setCartItems(response.data.cart || []);
      setCartTotal(response.data.cart_total || 0);
    })
    .catch(error => {
      console.error("Error fetching cart data:", error);
    });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = (productId, quantity) => {
    axios.put(`https://mitdevelop.com/goudhan/admin/api/cart/update/${productId}`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }
    )
    .then(() => fetchCart())
    .catch(error => console.error("Error updating quantity:", error));
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(`https://mitdevelop.com/goudhan/admin/api/cart/${userId}/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      if (response.ok) {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
        // alert('Item removed from cart');
      } else {
        alert(data.message || 'Failed to remove item');
      }
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  };

  const updateDeliveryMethod = async (productId, method) => {
    try {
      await axios.post(
        'https://mitdevelop.com/goudhan/admin/api/cart/update-delivery-method',
        { product_id: productId, delivery_method: method },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
      setCartItems(prev =>
        prev.map(item =>
          item.product.id === productId
            ? { ...item, delivery_method: method }
            : item
        )
      );
    } catch (error) {
      console.error('Error updating delivery method:', error);
    }
  };

  const handleProceedToCheckout = () => {
    localStorage.setItem("checkout_cart_items", JSON.stringify(cartItems));
    localStorage.setItem("checkout_cart_total", JSON.stringify(cartTotal));
  };

  return (
    <>
      <div className="py-8 bg-[#4d953e1f] mb-12 border-b-8 border-[#4D953E]">
        <h1 className="text-[52px] text-center font-bold text-[#292929]">Add To Cart</h1>
        <nav className="text-center">
          <ol className="inline-flex items-center space-x-2 text-[#4D953E] font-medium text-lg">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><span>/</span></li>
            <li><span className="text-[#292929]">Add To Cart</span></li>
          </ol>
        </nav>
      </div>

      <div className="bg-[#fff8f4]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
            {/* CART TABLE */}
            <div className="col-span-3 overflow-x-auto">
              <table className="min-w-full bg-white text-left">
                <thead>
                  <tr className="text-[#292929] shadow-sm border-[#a8a8a8]">
                    <th className="py-3 px-5">Image</th>
                    <th className="py-3 px-5 w-[30%]">Product Name</th>
                    <th className="py-3 px-5">Price</th>
                    <th className="py-3 px-5">Quantity</th>
                    <th className="py-3 px-5">Total</th>
                    <th className="py-3 px-5">Delivery</th>
                    <th className="py-3 px-5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item, index) => {
                    const price = parseFloat(item.product?.selling_price) || 0;
                    const quantity = item.quantity;
                    const total = price * quantity;

                    return (
                      <tr key={index} className="border-b-1 border-[#f48643] align-top">
                        <td className="py-3 px-5">
                          <img
                            src={
                              item.product?.images?.[0]?.image_path
                                ? `https://mitdevelop.com/goudhan/admin/storage/app/public/${item.product.images[0].image_path}`
                                : 'https://via.placeholder.com/150'
                            }
                            alt={item.product?.name}
                            className="w-24"
                          />
                        </td>
                        <td className="py-3 px-5">{item.product?.name}</td>
                        <td className="py-3 px-5">₹{price.toFixed(2)}</td>
                        <td className="py-3 px-5">
                          <input
                            type="number"
                            min="1"
                            value={item.localQuantity ?? item.quantity}
                            className="w-16 text-center border rounded"
                            onChange={(e) => {
                              const newQty = parseInt(e.target.value);
                              setCartItems(prev =>
                                prev.map(cartItem =>
                                  cartItem.product.id === item.product.id
                                    ? { ...cartItem, localQuantity: newQty }
                                    : cartItem
                                )
                              );
                            }}
                            onBlur={() => {
                              if (item.localQuantity && item.localQuantity !== item.quantity) {
                                updateQuantity(item.product.id, item.localQuantity);
                              }
                            }}
                          />
                        </td>
                        <td className="py-3 px-5">₹{total.toFixed(2)}</td>
                        <td className="py-3 px-5 text-sm">
                          <div className="space-y-1">
                            {['online', 'nearest_store', 'referral'].map(method => (
                              <label key={method} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`delivery_${item.product.id}`}
                                  value={method}
                                  checked={(item.delivery_method || 'online') === method}
                                  onChange={() => updateDeliveryMethod(item.product.id, method)}
                                />
                                {method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </label>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-5">
                          <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="bg-red-600 hover:bg-red-700 text-white flex items-center gap-1 px-3 py-2 rounded"
                      >
                        <FaTrashAlt />
                        Remove
                      </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* CART TOTAL & ACTIONS */}
            <div className="col-span-1 bg-white shadow-lg p-4">
              <h2 className="text-xl font-semibold text-[#000000] mb-3">Cart Total</h2>
              <div className="mb-3">
                <div className="flex justify-between text-[#292929] font-medium mb-2">
                  <span>Original Cart Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#292929] font-medium">
                  <span>Final Total</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link to="/Checkout" onClick={handleProceedToCheckout}>
                <button className="w-full bg-[#e0e0e0] text-[#575555] py-2 mt-1 flex items-center justify-center gap-2 transition">
                  Proceed to checkout <span className="text-lg">➔</span>
                </button>
              </Link>

              <Link to="/products">
                <button className="w-full mt-2 text-[#4d953e] py-2 flex items-center justify-center gap-2 hover:bg-[#4c953e17] transition">
                  ← Return to shopping
                </button>
              </Link>

              {/* Optional Coupon Input */}
              <div className="mt-4">
                <h3 className="text-[#4d953e] font-semibold mb-2">Coupon Apply</h3>
                <input
                  type="text"
                  placeholder="Coupon Code"
                  className="w-full border p-2 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToCart;
