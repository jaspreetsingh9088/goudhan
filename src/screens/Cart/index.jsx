import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaTrashAlt, FaTruck, FaStore, FaUserFriends } from 'react-icons/fa';
import { useAuth } from "../../contexts/AuthContext";

const AddToCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [serviceabilityData, setServiceabilityData] = useState({});
  const [showChargesPopup, setShowChargesPopup] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState({});
  const [shippingCharges, setShippingCharges] = useState(0);
const { user } = useAuth();
  const token = localStorage.getItem('token');
  // const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  // Fetch cart data
  const fetchCart = () => {
    axios.get('https://goudhan.life/admin/api/cart', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      setCartItems(response.data.cart || []);
      setCartTotal(response.data.cart_total || 0);
    })
    .catch(error => console.error("Error fetching cart data:", error));
  };

  // Check serviceability for all products in cart
  const checkServiceability = async () => {
    const newServiceabilityData = {};
    
    for (const item of cartItems) {
      try {
        const response = await axios.post(
          'https://goudhan.life/admin/api/shiprocket/serviceability',
          { product_id: item.product.id, pincode: user.pincode },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        newServiceabilityData[item.product.id] = response.data;
      } catch (error) {
        console.error(`Error checking serviceability for product ${item.product.id}:`, error);
        newServiceabilityData[item.product.id] = { available: false };
      }
    }
    
    setServiceabilityData(newServiceabilityData);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 && user?.pincode) {
      checkServiceability();
    }
  }, [cartItems, user?.pincode]);

  const updateQuantity = (productId, quantity) => {
    axios.put(`https://goudhan.life/admin/api/cart/update/${productId}`, { quantity }, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => fetchCart())
    .catch(error => console.error("Error updating quantity:", error));
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.delete(`https://goudhan.life/admin/api/cart/${userId}/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCartItems(prev => prev.filter(item => item.product.id !== productId));
    } catch (error) {
      console.error(error);
      alert('Failed to remove item');
    }
  };

  const updateDeliveryMethod = async (productId, method) => {
    try {
      await axios.post(
        'https://goudhan.life/admin/api/cart/update-delivery-method',
        { product_id: productId, delivery_method: method },
        { headers: { Authorization: `Bearer ${token}` } }
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
    const checkoutData = {
      items: cartItems,
      total: cartTotal + shippingCharges,
      shipping: shippingCharges
    };
    
    localStorage.setItem("checkout_data", JSON.stringify(checkoutData));
  };

  // Calculate shipping charges
  useEffect(() => {
    let charges = 0;
    
    cartItems.forEach(item => {
      if (item.delivery_method === 'online') {
        const service = serviceabilityData[item.product.id];
        const selectedOption = selectedShipping[item.product.id];
        
        if (selectedOption && service?.data?.available_courier_companies) {
          const courier = service.data.available_courier_companies.find(
            c => c.courier_company_id === selectedOption
          );
          
          if (courier) {
            charges += parseFloat(courier.rate) * item.quantity;
          }
        }
      }
    });
    
    setShippingCharges(charges);
  }, [selectedShipping, cartItems, serviceabilityData]);

  // Check if referral option should be shown
  const showReferralOption = !!user?.referred_by;

  // Render delivery options for a product
  const renderDeliveryOptions = (item) => {
    const service = serviceabilityData[item.product.id] || {};
    const onlineAvailable = service?.data?.available_courier_companies?.length > 0;
    
    const options = [
      {
        id: 'online',
        label: 'Online',
        icon: <FaTruck className="mr-2" />,
        available: onlineAvailable
      },
      {
        id: 'nearest_store',
        label: 'Nearest Store Pickup',
        icon: <FaStore className="mr-2" />,
        available: true // Always available for now
      },
      {
        id: 'referral',
        label: 'Referral Delivery',
        icon: <FaUserFriends className="mr-2" />,
        available: showReferralOption
      }
    ];

    return (
      <div className="space-y-2">
        {options.map(option => (
          option.available && (
            <label 
              key={option.id} 
              className={`flex items-center p-2 rounded cursor-pointer ${
                item.delivery_method === option.id 
                  ? 'bg-green-100 border border-green-500' 
                  : 'bg-gray-100'
              }`}
            >
              <input
                type="radio"
                name={`delivery_${item.product.id}`}
                value={option.id}
                checked={item.delivery_method === option.id}
                onChange={() => updateDeliveryMethod(item.product.id, option.id)}
                className="mr-2"
              />
              <div className="flex items-center">
                {option.icon}
                {option.label}
              </div>
              
              {option.id === 'online' && item.delivery_method === 'online' && onlineAvailable && (
                <button
                  type="button"
                  onClick={() => setShowChargesPopup(item.product.id)}
                  className="ml-2 text-sm text-blue-600 hover:underline"
                >
                  View Charges
                </button>
              )}
            </label>
          )
        ))}
      </div>
    );
  };

  // Shipping charges popup
  const ShippingChargesPopup = ({ productId }) => {
    const service = serviceabilityData[productId] || {};
    const couriers = service.data?.available_courier_companies || [];
    const selected = selectedShipping[productId];
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-xl font-bold mb-4">Shipping Options</h3>
          
          {couriers.length === 0 ? (
            <p>No shipping options available</p>
          ) : (
            <div className="space-y-3">
              {couriers.map(courier => (
                <label 
                  key={courier.courier_company_id}
                  className={`flex items-center p-3 border rounded cursor-pointer ${
                    selected === courier.courier_company_id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="shipping_option"
                    value={courier.courier_company_id}
                    checked={selected === courier.courier_company_id}
                    onChange={() => setSelectedShipping(prev => ({
                      ...prev, 
                      [productId]: courier.courier_company_id
                    }))}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">{courier.courier_name}</div>
                    <div className="text-sm text-gray-600">
                      ₹{courier.rate} • Est. {courier.etd} days
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowChargesPopup(null)}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="py-8 bg-[#9d9d9d1f] mb-12">
        <h1 className="text-[52px] text-center font-bold text-[#292929]">Shopping Cart</h1>
        <nav className="text-center">
          <ol className="inline-flex items-center space-x-2 text-[#4D953E] font-medium text-lg">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><span>/</span></li>
            <li><span className="text-[#292929]">Cart</span></li>
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
          {/* CART TABLE */}
          <div className="col-span-3 overflow-x-auto">
            <table className="min-w-full text-left bg-white border border-gray-200 shadow-sm">
              <thead>
                <tr className="text-white bg-orange-500">
                  <th className="py-3 px-5">Image</th>
                  <th className="py-3 px-5">Product</th>
                  <th className="py-3 px-5">Price</th>
                  <th className="py-3 px-5">Quantity</th>
                  <th className="py-3 px-5">Total</th>
                  <th className="py-3 px-5">Delivery Method</th>
                  <th className="py-3 px-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => {
                  const price = parseFloat(item.product?.selling_price) || 0;
                  const quantity = item.quantity;
                  const total = price * quantity;

                  return (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-4 px-5">
                        <img
                          src={
                            item.product?.images?.[0]?.image_path
                              ? `https://goudhan.life/admin/storage/app/public/${item.product.images[0].image_path}`
                              : 'https://via.placeholder.com/150'
                          }
                          alt={item.product?.name}
                          className="w-20 h-20 object-contain"
                        />
                      </td>
                      <td className="py-4 px-5 font-medium">{item.product?.name}</td>
                      <td className="py-4 px-5">₹{price.toFixed(2)}</td>
                      <td className="py-4 px-5">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          className="w-16 text-center border rounded py-1"
                          onChange={(e) => {
                            const newQty = parseInt(e.target.value);
                            setCartItems(prev =>
                              prev.map(cartItem =>
                                cartItem.product.id === item.product.id
                                  ? { ...cartItem, quantity: newQty }
                                  : cartItem
                              )
                            );
                          }}
                          onBlur={() => updateQuantity(item.product.id, item.quantity)}
                        />
                      </td>
                      <td className="py-4 px-5 font-medium">₹{total.toFixed(2)}</td>
                      <td className="py-4 px-5">
                        {renderDeliveryOptions(item)}
                      </td>
                      <td className="py-4 px-5">
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 border border-red-200 rounded hover:bg-red-200"
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

          {/* CART SUMMARY */}
          <div className="col-span-1 border border-gray-300 p-5 rounded-lg bg-white shadow-sm">
            <h2 className="text-xl font-bold mb-4 text-white bg-green-600 rounded-md px-4 py-2">
              Order Summary
            </h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>₹{shippingCharges.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-300 pt-3 flex justify-between font-bold">
                <span>Total:</span>
                <span>₹{(cartTotal + shippingCharges).toFixed(2)}</span>
              </div>
            </div>

            <Link 
              to="/Checkout" 
              onClick={handleProceedToCheckout}
              className="block w-full text-center bg-gray-800 text-white py-2.5 rounded hover:bg-gray-900 transition mb-3"
            >
              Proceed to Checkout
            </Link>
            
            <Link 
              to="/products"
              className="block w-full text-center text-green-600 py-2.5 border border-green-600 rounded hover:bg-green-50 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Shipping Charges Popup */}
      {showChargesPopup && (
        <ShippingChargesPopup productId={showChargesPopup} />
      )}
    </>
  );
};

export default AddToCart;