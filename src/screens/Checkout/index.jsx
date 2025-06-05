import React, { useState, useEffect } from "react";
import axios from "axios";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({});
  const [pincode, setPincode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [totalShipping, setTotalShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("Credit / Debit Card");
  const [serviceable, setServiceable] = useState(null);
  const [courierInfo, setCourierInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setPincode(parsedUser.pincode || "");
    }

    const token = localStorage.getItem("token");
    axios
      .get("https://goudhan.life/admin/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const cartData = res.data.cart || [];
        setCartItems(cartData);

        let sub = 0;
        let shipping = 0;
        cartData.forEach((item) => {
          sub += parseFloat(item.total_price);
          shipping += parseFloat(item.product.shipping_charge || 0);
        });

        setSubtotal(sub);
        setTotalShipping(shipping);
        setTotal(sub + shipping);
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

 


  useEffect(() => {
 

    const checkServiceability = async () => {
  if (!pincode || pincode.length !== 6 || paymentMethod !== "Credit / Debit Card") {
    console.error("Invalid pincode. It must be exactly 6 digits.");
    setServiceable(false);
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
  console.error("Token not found.");
  return;
}

console.log('User login token', token);
  try {
    // Use the first cart item's product_id for now
    const productId = cartItems[0]?.product?.id;
    if (!productId) return;

    // Make API call to check serviceability
    const res = await axios.post(
      "https://goudhan.life/admin/api/shiprocket/serviceability",
      {
        product_id: productId,
        pincode: pincode
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    // Check if serviceable and update state
    if (res.data?.available_courier_companies?.length > 0) {
      setServiceable(true);

      // Find the cheapest courier service
      const cheapest = res.data.available_courier_companies.reduce((a, b) =>
        a.rate < b.rate ? a : b
      );
      setCourierInfo(cheapest);
    } else {
      setServiceable(false);
    }
  } catch (err) {
  console.error("Serviceability check failed", err.response?.data || err);
  if (err.response) {
    console.error("API error details: ", err.response.data);
  }
}

};


  if (cartItems.length > 0) checkServiceability();
}, [cartItems, pincode, paymentMethod]);


  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (paymentMethod !== "Credit / Debit Card") {
      alert("Only Credit / Debit Card payment method is implemented currently.");
      return;
    }

    if (!serviceable) {
      alert("Delivery service is not available to your pincode.");
      return;
    }

    const res = await loadRazorpayScript();

    if (!res) {
      alert("Failed to load Razorpay SDK. Please check your connection.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const orderResponse = await axios.post(
        "https://goudhan.life/admin/api/payment/create-order",
        { amount: total },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { order_id, amount, currency, key } = orderResponse.data;

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: "Goudhan",
        description: "Order Payment",
        order_id: order_id,
        handler: function (response) {
          alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone_number,
        },
        theme: {
          color: "#f68540",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Order creation failed", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <>
      <div className="py-8 bg-[#9d9d9d1f] mb-12 border-[#4D953E]">
        <h1 className="text-[52px] text-center font-bold text-[#292929]">Checkout</h1>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-8">
        <div className="col-span-2 border-2 border-[#cacaca] shadow-xl px-8 py-4 rounded-lg">
          <h2 className="text-[28px] font-semibold mb-4 text-[#f68540] border-b-2 border-[#f68540]">Billing Information</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-gray-500 text-sm mb-1">Full Name</label>
              <input type="text" className="w-full rounded p-2 bg-gray-100" value={user.name || ""} readOnly />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Email Address</label>
              <input type="email" className="w-full rounded p-2 bg-gray-100" value={user.email || ""} readOnly />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Phone Number</label>
              <input type="text" className="w-full rounded p-2 bg-gray-100" value={user.phone_number || ""} readOnly />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Shipping Address</label>
              <textarea rows="3" className="w-full rounded p-2 bg-gray-100" value={user.address || ""} readOnly />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Pincode</label>
              <input
                type="text"
                className="w-full rounded p-2 border border-gray-300"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-gray-500 text-sm mb-1">Payment Method</label>
              <select className="w-full rounded p-2" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                <option value="Credit / Debit Card">Credit / Debit Card</option>
                <option value="Cash on Delivery">Cash on Delivery</option>
              </select>
            </div>
            {paymentMethod === "Credit / Debit Card" && courierInfo && (
              <div className="text-green-600 text-sm">
                📦 Cheapest Courier: {courierInfo.courier_name} — ₹{courierInfo.rate}
              </div>
            )}
            {!serviceable && paymentMethod === "Credit / Debit Card" && (
              <div className="text-red-500 text-sm">❌ Delivery not available to this pincode.</div>
            )}
          </form>
        </div>

        <div>
          <div className="border-2 border-[#cacaca] p-4 rounded-lg shadow-md space-y-4 bg-white">
            <h2 className="text-2xl font-semibold text-white mb-4 bg-[#f68540] rounded-md px-5 py-1">Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 pb-4 mb-4 bg-[#f3f4f6] px-5 py-3 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-bold text-[20px] text-[#4d953e] capitalize">{item.product.name}</h3>
                  <p className="text-[#575555] font-semibold">Price: ₹{(item.price / item.quantity).toFixed(2)}</p>
                  <p className="text-[#575555] font-semibold">Quantity: {item.quantity}</p>
                  <p className="text-[#575555] font-semibold">Delivery Method: {item.delivery_method}</p>
                  <p>Shipping Charge: ₹{parseFloat(item.product.shipping_charge).toFixed(2)}</p>
                </div>
              </div>
            ))}

            <div className="border-t pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>₹{totalShipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-[#f68540] text-white py-2 rounded mt-4"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
