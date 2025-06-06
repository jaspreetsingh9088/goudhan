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
  const [serviceable, setServiceable] = useState(null); // You can bypass this serviceable check for now
  const [courierInfo, setCourierInfo] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setPincode(parsedUser.pincode || "");
    }

   const token = localStorage.getItem("token");

  if (token) {
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
          const sellingPrice = parseFloat(item.product.selling_price) || 0;
          const shippingCharge = parseFloat(item.product.shipping_charge) || 0;
console.log('Selling Price : ',sellingPrice);
          sub += sellingPrice * item.quantity || 0; // Multiply by quantity
          shipping += shippingCharge * item.quantity || 0; // Multiply by quantity
        });

        setSubtotal(sub);
        setTotalShipping(shipping);
        setTotal(sub + shipping);
      })
      .catch((err) => console.error("Error fetching cart:", err));
  } else {
    console.error("No token found in localStorage");
  }
  }, []);

  const handlePlaceOrder = async () => {
    if (paymentMethod !== "Credit / Debit Card") {
      alert("Only card payments are implemented.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post("https://goudhan.life/admin/api/create-payment", {
        total: total,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.payment_url) {
        window.location.href = res.data.payment_url; // Redirect to Instamojo
      } else {
        alert("Order creation failed");
      }
    } catch (error) {
      console.error("Order/payment error", error);
      alert("Error during checkout.");
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
            <input type="text" value={user.name || ""} readOnly className="w-full rounded p-2 bg-gray-100" />
            <input type="email" value={user.email || ""} readOnly className="w-full rounded p-2 bg-gray-100" />
            <input type="text" value={user.phone_number || ""} readOnly className="w-full rounded p-2 bg-gray-100" />
            <textarea value={user.address || ""} readOnly className="w-full rounded p-2 bg-gray-100" />
            <input type="text" value={pincode} onChange={(e) => setPincode(e.target.value)} className="w-full rounded p-2 border" />
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded p-2">
              <option value="Credit / Debit Card">Credit / Debit Card</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
            {paymentMethod === "Credit / Debit Card" && courierInfo && (
              <div className="text-green-600 text-sm">📦 Cheapest Courier: {courierInfo.courier_name} — ₹{courierInfo.rate}</div>
            )}
            {!serviceable && paymentMethod === "Credit / Debit Card" && (
              <div className="text-red-500 text-sm">❌ Delivery not available to this pincode.</div>
            )}
          </form>
        </div>

        <div>
          <div className="border-2 border-[#cacaca] p-4 rounded-lg shadow-md space-y-4 bg-white">
            <h2 className="text-2xl font-semibold text-[#f68540] mb-4 rounded-md px-5 py-1">Order Summary</h2>
      
      
  {cartItems.map((item) => (
  <div key={item.id} className="flex items-center gap-4 pb-4 mb-4 bg-[#f3f4f6] px-5 py-3 rounded-lg">
    <div className="flex-1">
      <h3 className="font-bold text-[20px] text-[#4d953e] capitalize">{item.product.name}</h3>
      <p className="text-[#575555] font-semibold">
        ₹{item.product.selling_price ? parseFloat(item.product.selling_price).toFixed(2) : '0.00'} × {item.quantity} = ₹{item.product_total ? parseFloat(item.product_total).toFixed(2) : '0.00'}
      </p>
      <p className="text-[#575555] font-semibold">Delivery Method: {item.delivery_method}</p>
      <p>Shipping Charge: ₹{parseFloat(item.product.shipping_charge).toFixed(2)}</p>
    </div>
  </div>
))}




            <div className="border-t pt-4">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>₹{totalShipping.toFixed(2)}</span></div>
              <div className="flex justify-between font-bold text-lg mt-2"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>

            <button onClick={handlePlaceOrder} className="w-full bg-[#f68540] text-white py-2 rounded mt-4">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
