import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { FaTruck, FaUserFriends, FaTimes } from 'react-icons/fa';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({});
  const [pincode, setPincode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [totalShipping, setTotalShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [totalGst, setTotalGst] = useState(0);
  const [goPoints, setGoPoints] = useState(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [useGoPoints, setUseGoPoints] = useState(false);
  const [goPointsToUse, setGoPointsToUse] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [isPinServiceable, setIsPinServiceable] = useState(true);
  const [itemShipping, setItemShipping] = useState({});
  const [serviceabilityData, setServiceabilityData] = useState({});
  const [showChargesPopup, setShowChargesPopup] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState({});
  const [deliveryMethods, setDeliveryMethods] = useState({});
  const { user: authUser } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Fetch cart data for authenticated users
  const fetchCart = async () => {
    if (authUser && token) {
      try {
        const response = await axios.get('https://goudhan.com/admin/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const validItems = (response.data.cart || []).filter(item => item.product && item.product.id && item.product.selling_price != null);
        setCartItems(validItems);
        setSubtotal(response.data.cart_total || 0);
        localStorage.setItem('checkout_data', JSON.stringify({
          items: validItems,
          total: response.data.cart_total || 0,
          shipping: 0,
          userPincode: user?.pincode || ''
        }));
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    setUser(storedUser);
    setPincode(storedUser.pincode || "");

    const checkoutData = JSON.parse(localStorage.getItem("checkout_data"));
    if (checkoutData && checkoutData.items) {
      const validItems = checkoutData.items.filter(item => item.product && item.product.id && item.product.selling_price != null);
      setCartItems(validItems);
      setTotalShipping(checkoutData.shipping || 0);

      let sub = 0, cgstValue = 0, igstValue = 0;
      validItems.forEach((item) => {
        const price = parseFloat(item.product?.selling_price) || 0;
        const qty = item.quantity || 1;
        const cgstP = parseFloat(item.product?.cgst) || 0;
        const sgstP = parseFloat(item.product?.sgst) || 0;

        sub += price * qty;
        cgstValue += (price * cgstP / 100) * qty;
        igstValue += (price * sgstP / 100) * qty;
      });

      setSubtotal(sub);
      setCgst(cgstValue);
      setIgst(igstValue);
      setTotalGst(cgstValue + igstValue);
      setTotal(sub + checkoutData.shipping + cgstValue + igstValue);
      setFinalAmount(sub + checkoutData.shipping + cgstValue + igstValue);

      console.log("Checkout Data:", { validItems, sub, cgstValue, igstValue, totalGst: cgstValue + igstValue });
    }

    if (token && storedUser.id) {
      fetchCart();
      axios.get("https://goudhan.com/admin/api/user", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        const points = Number(res.data.go_points) || 0;
        setGoPoints(points);
        setPincode(res.data.pincode || storedUser.pincode || "");
        console.log("User Data:", { goPoints: points, pincode: res.data.pincode });
      }).catch(err => console.error("Error fetching user data:", err));
    }
  }, [authUser, token]);

  // Check serviceability for all products
  const checkServiceability = async (pin) => {
    if (!authUser || !pin || pin.length < 6) return;
    const newServiceabilityData = {};
    let pinServiceable = true;

    for (const item of cartItems) {
      if (!item.product?.id || !item.product?.weight) continue;
      try {
        const response = await axios.post(
          'https://goudhan.com/admin/api/shiprocket/serviceability',
          { product_id: item.product.id, pincode: pin },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        newServiceabilityData[item.product.id] = response.data;
        const couriers = response.data.data?.available_courier_companies || [];
        // Validate product weight against courier limits
        const productWeightKg = (parseFloat(item.product.weight) || 0) / 1000; // Convert grams to kg
        const hasValidCourier = couriers.some(courier => {
          const minWeight = parseFloat(courier.min_weight) || 0;
          const maxWeight = parseFloat(courier.surface_max_weight || courier.air_max_weight || Infinity);
          return productWeightKg >= minWeight && productWeightKg <= maxWeight;
        });
        if (!hasValidCourier) {
          pinServiceable = false;
        }
      } catch (error) {
        console.error(`Error checking serviceability for product ${item.product.id}:`, error);
        newServiceabilityData[item.product.id] = { data: { available_courier_companies: [] } };
        pinServiceable = false;
      }
    }

    setServiceabilityData(newServiceabilityData);
    setIsPinServiceable(pinServiceable);

    const newDeliveryMethods = {};
    cartItems.forEach(item => {
      if (!item.product?.id) return;
      const productId = item.product.id;
      const onlineAvailable = newServiceabilityData[productId]?.data?.available_courier_companies?.length > 0;
      newDeliveryMethods[productId] = onlineAvailable ? 'online' : (authUser?.referred_by ? 'referral' : null);
      if (onlineAvailable) {
        const validCouriers = newServiceabilityData[productId].data.available_courier_companies.filter(courier => {
          const productWeightKg = (parseFloat(item.product.weight) || 0) / 1000;
          const minWeight = parseFloat(courier.min_weight) || 0;
          const maxWeight = parseFloat(courier.surface_max_weight || courier.air_max_weight || Infinity);
          return productWeightKg >= minWeight && productWeightKg <= maxWeight;
        });
        if (validCouriers.length > 0) {
          setSelectedShipping(prev => ({
            ...prev,
            [productId]: validCouriers[0].courier_company_id
          }));
        } else {
          newDeliveryMethods[productId] = authUser?.referred_by ? 'referral' : null;
        }
      }
    });
    setDeliveryMethods(newDeliveryMethods);
    console.log("Serviceability:", { newServiceabilityData, pinServiceable, newDeliveryMethods });
  };

  useEffect(() => {
    if (cartItems.length > 0 && authUser && pincode) {
      checkServiceability(pincode);
    }
  }, [cartItems, authUser, pincode]);

  useEffect(() => {
    let charges = 0;
    const newItemShipping = {};
    cartItems.forEach(item => {
      if (!item.product?.id) return;
      if (deliveryMethods[item.product.id] === 'online') {
        const service = serviceabilityData[item.product.id];
        const selectedOption = selectedShipping[item.product.id];
        if (selectedOption && service?.data?.available_courier_companies) {
          const courier = service.data.available_courier_companies.find(
            c => c.courier_company_id === selectedOption
          );
          if (courier) {
            const shippingCost = parseFloat(courier.rate) * (item.quantity || 1);
            charges += shippingCost;
            newItemShipping[item.product.id] = shippingCost;
          } else {
            newItemShipping[item.product.id] = 0;
          }
        } else {
          newItemShipping[item.product.id] = 0;
        }
      } else {
        newItemShipping[item.product.id] = 0;
      }
    });
    setTotalShipping(charges);
    setItemShipping(newItemShipping);
    setTotal(subtotal + charges + cgst + igst);
    setFinalAmount(subtotal + charges + cgst + igst);
  }, [selectedShipping, deliveryMethods, serviceabilityData, cartItems, subtotal, cgst, igst]);

  const updateDeliveryMethod = async (productId, method) => {
    if (!authUser) {
      localStorage.setItem('redirect_after_login', '/Checkout');
      navigate('/login');
      return;
    }
    setDeliveryMethods(prev => ({ ...prev, [productId]: method }));
    if (method === 'online') {
      const couriers = serviceabilityData[productId]?.data?.available_courier_companies;
      if (couriers && couriers.length > 0) {
        setSelectedShipping(prev => ({
          ...prev,
          [productId]: couriers[0].courier_company_id
        }));
      }
    } else {
      setSelectedShipping(prev => {
        const newSelection = { ...prev };
        delete newSelection[productId];
        return newSelection;
      });
    }
  };

  const handlePincodeChange = (e) => {
    const newPincode = e.target.value;
    setPincode(newPincode);
    if (newPincode.length >= 6) {
      checkServiceability(newPincode);
    } else {
      setIsPinServiceable(true);
    }
  };

  const calculateFinalAmount = () => {
    let amount = total;
    if (useGoPoints && goPoints > 0) {
      const pointsToDeduct = Math.min(Number(goPointsToUse), goPoints, total);
      amount = Math.max(0, total - pointsToDeduct);
    }
    setFinalAmount(amount);
    return amount;
  };

  useEffect(() => {
    calculateFinalAmount();
  }, [useGoPoints, goPointsToUse, total, goPoints]);

  const handlePlaceOrder = async () => {
    if (!authUser) {
      localStorage.setItem('redirect_after_login', '/Checkout');
      navigate('/login');
      return;
    }
    if (useGoPoints && Number(goPointsToUse) > goPoints) {
      return alert("You don't have enough Go Points");
    }
    if (!isPinServiceable) {
      return alert("Some items cannot be delivered to this pincode.");
    }
    if (!pincode || pincode.length < 6) {
      return alert("Please enter a valid pincode.");
    }
    setShowPaymentPopup(true);
  };

  const handlePaymentConfirmation = async () => {
    if (!selectedPaymentOption) return alert("Please select a payment method.");
    try {
      const pointsToUse = useGoPoints ? Math.min(Number(goPointsToUse), goPoints, total) : 0;
      const amountToPay = finalAmount;

      const res = await axios.post("https://goudhan.com/admin/api/create-order", {
        total,
        subtotal,
        shipping_charge: totalShipping,
        payment_method: selectedPaymentOption,
        pincode,
        go_points_used: pointsToUse,
        final_amount: amountToPay,
        items: cartItems.map(item => ({
          id: item.id,
          delivery_method: deliveryMethods[item.product.id] || 'referral',
          courier: deliveryMethods[item.product.id] === 'online' ? {
            company_id: selectedShipping[item.product.id],
            name: serviceabilityData[item.product.id]?.data?.available_courier_companies?.find(
              c => c.courier_company_id === selectedShipping[item.product.id]
            )?.courier_name,
            rate: serviceabilityData[item.product.id]?.data?.available_courier_companies?.find(
              c => c.courier_company_id === selectedShipping[item.product.id]
            )?.rate
          } : null
        }))
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (selectedPaymentOption === "Online") {
        const options = {
          key: res.data.key,
          amount: res.data.amount,
          currency: res.data.currency,
          name: "Goudhan",
          description: "Order Payment",
          order_id: res.data.razorpay_order_id,
          handler: async function (response) {
            try {
              await axios.post("https://goudhan.com/admin/api/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: res.data.order_id,
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });
              localStorage.removeItem("checkout_data");
              setCartItems([]);
              window.location.href = "/payment-success";
            } catch {
              alert("Payment verification failed.");
            }
          },
          prefill: {
            name: user.name || '',
            email: user.email || '',
            contact: user.phone_number || '',
          },
          theme: { color: "#f68540" }
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        localStorage.removeItem("checkout_data");
        alert("Order placed successfully. Payment status: Pending");
        setCartItems([]);
        window.location.href = "/payment-success";
      }
    } catch (err) {
      console.error("Order creation/payment failed", err.response?.data || err);
      alert("Checkout failed: " + (err.response?.data?.error || "Unknown error"));
    }
  };

  const renderDeliveryOptions = (item) => {
    if (!item.product?.id) return null;
    const productId = item.product.id;
    const service = serviceabilityData[productId] || {};
    const courierCompanies = service?.data?.available_courier_companies || [];
    const productWeightKg = (parseFloat(item.product.weight) || 0) / 1000;
    const validCouriers = courierCompanies.filter(courier => {
      const minWeight = parseFloat(courier.min_weight) || 0;
      const maxWeight = parseFloat(courier.surface_max_weight || courier.air_max_weight || Infinity);
      return productWeightKg >= minWeight && productWeightKg <= maxWeight;
    });
    const onlineAvailable = validCouriers.length > 0;
    const referralAvailable = !!authUser?.referred_by;

    let pincodeMessage = '';
    if (!onlineAvailable) {
      if (!pincode) {
        pincodeMessage = 'Please enter a valid pincode.';
      } else if (!courierCompanies.length) {
        pincodeMessage = 'Delivery service is not available in your area.';
      } else {
        pincodeMessage = `Product weight (${item.product.weight}g) is not supported by available couriers.`;
      }
    }

    const options = [
      {
        id: 'online',
        label: 'Online',
        icon: <FaTruck className="mr-2" />,
        available: onlineAvailable,
        message: pincodeMessage,
      },
      {
        id: 'referral',
        label: 'Referral Delivery',
        icon: <FaUserFriends className="mr-2" />,
        available: referralAvailable,
        message: 'Referral delivery option not available.',
      }
    ];

    return (
      <div className="space-y-3">
        {options.map(option => (
          <div key={option.id}>
            {option.available ? (
              <label 
                className={`flex items-center p-2 rounded cursor-pointer ${
                  deliveryMethods[item.product.id] === option.id 
                    ? 'bg-green-100 border border-green-500' 
                    : 'bg-gray-100 border border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name={`delivery_${item.product.id}`}
                  value={option.id}
                  checked={deliveryMethods[item.product.id] === option.id}
                  onChange={() => updateDeliveryMethod(item.product.id, option.id)}
                  className="mr-2"
                />
                <div className="flex items-center">
                  {option.icon}
                  {option.label}
                </div>
                {option.id === 'online' && deliveryMethods[item.product.id] === 'online' && onlineAvailable && (
                  <button
                    type="button"
                    onClick={() => setShowChargesPopup(item.product.id)}
                    className="ml-2 text-sm text-blue-600 hover:underline"
                  >
                    View Charges
                  </button>
                )}
              </label>
            ) : (
              <div className="flex items-center px-2 py-1 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
                {option.icon}
                <span className="ml-2 font-medium">{option.label}:</span>
                <span className="ml-1">{option.message}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const ShippingChargesPopup = ({ productId }) => {
    const service = serviceabilityData[productId] || {};
    const couriers = service.data?.available_courier_companies || [];
    const selected = selectedShipping[productId];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
          <button 
            onClick={() => setShowChargesPopup(null)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <FaTimes />
          </button>
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
                    onChange={() => {
                      setSelectedShipping(prev => ({
                        ...prev, 
                        [productId]: courier.courier_company_id
                      }));
                      setShowChargesPopup(null);
                    }}
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

  const PaymentPopup = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <button 
          onClick={() => setShowPaymentPopup(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <FaTimes />
        </button>
        <h3 className="text-xl font-bold mb-4">Select Payment Method</h3>
        <div className="space-y-3">
          <label className="flex items-center p-3 border rounded cursor-pointer">
            <input
              type="radio"
              name="payment_option"
              value="Online"
              checked={selectedPaymentOption === "Online"}
              onChange={(e) => setSelectedPaymentOption(e.target.value)}
              className="mr-3"
            />
            <span>Online Payment</span>
          </label>
          <label className="flex items-center p-3 border rounded cursor-pointer">
            <input
              type="radio"
              name="payment_option"
              value="COD"
              checked={selectedPaymentOption === "COD"}
              onChange={(e) => setSelectedPaymentOption(e.target.value)}
              className="mr-3"
            />
            <span>Cash on Delivery</span>
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setShowPaymentPopup(false)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handlePaymentConfirmation}
            className="px-4 py-2 bg-[#f68540] text-white rounded hover:bg-[#e07636]"
            disabled={!selectedPaymentOption}
          >
            Confirm Payment
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="py-8 bg-[#9d9d9f1f] mb-12 border-[#4D953E]">
        <h1 className="text-[52px] text-center font-bold text-[#292929]">Checkout</h1>
      </div>

      {!authUser && (
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-yellow-50 p-4 rounded-lg mb-6 text-center">
            <p className="text-red-500 mb-2">Please log in or create an account to proceed with checkout.</p>
            <div className="flex justify-center gap-4">
              <Link to="/login" className="px-4 py-2 bg-[#f68540] text-white rounded hover:bg-[#e07636]">
                Log In
              </Link>
              <Link to="/register" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      )}

      {authUser && (
        <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-8">
          <div className="col-span-2 border-2 border-[#cacaca] shadow-xl px-8 py-4 rounded-lg">
            <h2 className="text-[28px] font-semibold mb-4 text-[#f68540] border-b-2 border-[#f68540]">Billing Information</h2>
            <form className="space-y-4">
              <input type="text" value={user.name || ""} readOnly className="w-full rounded p-2 bg-gray-100" />
              <input type="email" value={user.email || ""} readOnly className="w-full rounded p-2 bg-gray-100" />
              <input type="text" value={user.phone_number || ""} readOnly className="w-full rounded p-2 bg-gray-100" />
              <textarea value={user.address || ""} readOnly className="w-full rounded p-2 bg-gray-100" />
              <div>
                <label className="block mb-1 font-medium">Pincode</label>
                <input 
                  type="text" 
                  value={pincode} 
                  onChange={handlePincodeChange}
                  className="w-full rounded p-2 border"
                  placeholder="Enter your pincode"
                />
                {!isPinServiceable && pincode && (
                  <p className="text-red-500 text-sm mt-1">Some items cannot be delivered to this pincode.</p>
                )}
              </div>
              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-2">Delivery Methods</h3>
                {cartItems.length === 0 ? (
                  <p className="text-red-500">No items in cart. Please add items to proceed.</p>
                ) : (
                  cartItems.map(item => (
                    <div key={item.id} className="mb-4">
                      <h4 className="font-bold">{item.product?.name || "Unknown Product"}</h4>
                      {renderDeliveryOptions(item)}
                    </div>
                  ))
                )}
              </div>
              <div className="border-t pt-4">
                <h3 className="text-xl font-semibold mb-2">Go Points</h3>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="useGoPoints"
                    checked={useGoPoints}
                    onChange={(e) => setUseGoPoints(e.target.checked)}
                    className="mr-2 h-5 w-5"
                    disabled={goPoints === 0}
                  />
                  <label htmlFor="useGoPoints" className="text-lg">
                    Use my Go Points (Available: {goPoints})
                  </label>
                </div>
                {useGoPoints && goPoints > 0 && (
                  <div className="ml-6">
                    <label className="block mb-1">Points to use (max: {Math.min(goPoints, total)})</label>
                    <input
                      type="number"
                      min="0"
                      max={Math.min(goPoints, total)}
                      value={goPointsToUse}
                      onChange={(e) => setGoPointsToUse(Number(e.target.value))}
                      className="w-full rounded p-2 border"
                    />
                    <p className="text-green-600 mt-1">
                      Final amount after deduction: ₹{finalAmount.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div>
            <div className="border-2 border-[#cacaca] p-4 rounded-lg shadow-md space-y-4 bg-white">
              <h2 className="text-2xl font-semibold text-white mb-4 bg-[#f68540] rounded-md px-5 py-1">Order Summary</h2>
              {cartItems.length === 0 ? (
                <p className="text-red-500">No items in cart.</p>
              ) : (
                cartItems.map((item) => {
                  if (!item.product?.id) return null;
                  const price = parseFloat(item.product.selling_price) || 0;
                  const qty = item.quantity || 1;
                  const cgstP = parseFloat(item.product.cgst) || 0;
                  const sgstP = parseFloat(item.product.sgst) || 0;
                  const cgstAmt = (price * cgstP / 100) * qty;
                  const sgstAmt = (price * sgstP / 100) * qty;
                  const weight = parseFloat(item.product.weight) || 0;
                  const weightDisplay = weight > 0 ? `${weight}g (${(weight / 1000).toFixed(2)}kg)` : 'Weight not available';

                  return (
                    <div key={item.id} className="bg-[#f3f4f6] px-5 py-3 rounded-lg mb-4">
                      <div className="flex justify-between">
                        <h3 className="font-bold text-[#4d953e]">{item.product.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          deliveryMethods[item.product.id] === "online" ? "bg-blue-200 text-blue-800" :
                          deliveryMethods[item.product.id] === "referral" ? "bg-purple-200 text-purple-800" :
                          "bg-gray-200 text-gray-800"
                        }`}>
                          {deliveryMethods[item.product.id] === "online" ? "Online Delivery" : 
                           deliveryMethods[item.product.id] === "referral" ? "Referral Delivery" : 
                           "Not Selected"}
                        </span>
                      </div>
                      <p>₹{price.toFixed(2)} × {qty} = ₹{(price * qty).toFixed(2)}</p>
                      <p className="text-sm">Weight: {weightDisplay}</p>
                      {deliveryMethods[item.product.id] === "online" && itemShipping[item.product.id] > 0 && (
                        <p className="text-sm">
                          Shipping: ₹{itemShipping[item.product.id].toFixed(2)}
                        </p>
                      )}
                      {cgstAmt > 0 && <p className="text-sm">CGST ({cgstP}%): ₹{cgstAmt.toFixed(2)}</p>}
                      {sgstAmt > 0 && <p className="text-sm">SGST ({sgstP}%): ₹{sgstAmt.toFixed(2)}</p>}
                    </div>
                  );
                })
              )}
              <div className="border-t pt-4 space-y-1">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Shipping</span><span>₹{totalShipping.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Total GST (CGST + SGST)</span><span>₹{totalGst.toFixed(2)}</span></div>
                {useGoPoints && goPoints > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Go Points Used</span>
                    <span>-₹{Math.min(Number(goPointsToUse), goPoints, total).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
                  <span>Total</span>
                  <span>₹{finalAmount.toFixed(2)}</span>
                </div>
              </div>
              <button 
                onClick={handlePlaceOrder} 
                className="w-full py-2 rounded mt-4 text-white bg-[#f68540] hover:bg-[#e07636]"
                disabled={cartItems.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}

      {showChargesPopup && (
        <ShippingChargesPopup productId={showChargesPopup} />
      )}
      {showPaymentPopup && (
        <PaymentPopup />
      )}
    </>
  );
};

export default Checkout;