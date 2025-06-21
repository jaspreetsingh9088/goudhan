// 📦 Updated Checkout.js with Multi-Delivery Methods, Go Points, and Payment Popup
import React, { useState, useEffect } from "react";
import axios from "axios";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({});
  const [pincode, setPincode] = useState("");
  const [subtotal, setSubtotal] = useState(0);
  const [totalShipping, setTotalShipping] = useState(0);
  const [total, setTotal] = useState(0);
  const [cgst, setCgst] = useState(0);
  const [igst, setIgst] = useState(0);
  const [goPoints, setGoPoints] = useState(0);
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [selectedPaymentOption, setSelectedPaymentOption] = useState("");
  const [useGoPoints, setUseGoPoints] = useState(false);
  const [goPointsToUse, setGoPointsToUse] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

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

          let sub = 0, shipping = 0, cgstValue = 0, igstValue = 0;
          cartData.forEach((item) => {
            const price = parseFloat(item.product.selling_price) || 0;
            const ship = parseFloat(item.product.shipping_charge) || 0;
            const qty = item.quantity || 1;
            const cgstP = parseFloat(item.product.cgst) || 0;
            const sgstP = parseFloat(item.product.sgst) || 0;

            sub += price * qty;
            shipping += ship * qty;
            cgstValue += (price * cgstP / 100) * qty;
            igstValue += (price * sgstP / 100) * qty;
          });

          setSubtotal(sub);
          setTotalShipping(shipping);
          setCgst(cgstValue);
          setIgst(igstValue);
          setTotal(sub + shipping + cgstValue + igstValue);
          setFinalAmount(sub + shipping + cgstValue + igstValue);
        });

      // Fetch Go Points
      axios.get("https://goudhan.life/admin/api/user", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setGoPoints(res.data.go_points || 0);
      });
    }
  }, []);

  const calculateFinalAmount = () => {
    let amount = total;
    
    if (useGoPoints) {
      const pointsToDeduct = Math.min(goPointsToUse, goPoints, total);
      amount = Math.max(0, total - pointsToDeduct);
    }
    
    setFinalAmount(amount);
    return amount;
  };

  useEffect(() => {
    calculateFinalAmount();
  }, [useGoPoints, goPointsToUse, total]);

  const handlePlaceOrder = async () => {
    if (useGoPoints && goPointsToUse > goPoints) {
      return alert("You don't have enough Go Points");
    }

    setShowPaymentPopup(true);
  };

  const handlePaymentConfirmation = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("User not logged in.");

    try {
      const pointsToUse = useGoPoints ? Math.min(goPointsToUse, goPoints, total) : 0;
      const amountToPay = finalAmount;

      const res = await axios.post("https://goudhan.life/admin/api/create-order", {
        total,
        subtotal,
        shipping_charge: totalShipping,
        payment_method: selectedPaymentOption,
        pincode,
        go_points_used: pointsToUse,
        final_amount: amountToPay,
        items: cartItems.map(item => ({
          id: item.id,
          delivery_method: item.delivery_method
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
              await axios.post("https://goudhan.life/admin/api/verify-payment", {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                order_id: res.data.order_id,
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });

              setCartItems([]);
              window.location.href = "/payment-success";
            } catch {
              alert("Payment verification failed.");
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone_number,
          },
          theme: { color: "#f68540" }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        // Wire Transfer or Cash
        alert("Order placed successfully. Payment status: Pending");
        setCartItems([]);
        window.location.href = "/payment-success";
      }
    } catch (err) {
      console.error("Order creation/payment failed", err.response?.data || err);
      alert("Checkout failed");
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
            <input 
              type="text" 
              value={pincode} 
              onChange={(e) => setPincode(e.target.value)} 
              placeholder="Enter pincode"
              className="w-full rounded p-2 border" 
            />
            
            {/* Go Points Section */}
            <div className="border-t pt-4">
              <h3 className="text-xl font-semibold mb-2">Go Points</h3>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="useGoPoints"
                  checked={useGoPoints}
                  onChange={(e) => setUseGoPoints(e.target.checked)}
                  className="mr-2 h-5 w-5"
                />
                <label htmlFor="useGoPoints" className="text-lg">
                  Use my Go Points (Available: {goPoints})
                </label>
              </div>
              
              {useGoPoints && (
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
            {cartItems.map((item) => {
              const price = parseFloat(item.product.selling_price) || 0;
              const qty = item.quantity || 1;
              const cgstP = parseFloat(item.product.cgst) || 0;
              const sgstP = parseFloat(item.product.sgst) || 0;
              const cgstAmt = (price * cgstP / 100) * qty;
              const sgstAmt = (price * sgstP / 100) * qty;
              return (
                <div key={item.id} className="bg-[#f3f4f6] px-5 py-3 rounded-lg mb-4">
                  <div className="flex justify-between">
                    <h3 className="font-bold text-[#4d953e]">{item.product.name}</h3>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.delivery_method === "Online" ? "bg-blue-200 text-blue-800" :
                      item.delivery_method === "Referral" ? "bg-purple-200 text-purple-800" :
                      "bg-green-200 text-green-800"
                    }`}>
                      {item.delivery_method}
                    </span>
                  </div>
                  <p>₹{price.toFixed(2)} × {qty} = ₹{(price * qty).toFixed(2)}</p>
                  <p>Shipping: ₹{parseFloat(item.product.shipping_charge).toFixed(2)}</p>
                  {cgstAmt > 0 && <p className="text-sm">CGST ({cgstP}%): ₹{cgstAmt.toFixed(2)}</p>}
                  {sgstAmt > 0 && <p className="text-sm">SGST ({sgstP}%): ₹{sgstAmt.toFixed(2)}</p>}
                </div>
              );
            })}
            <div className="border-t pt-4 space-y-1">
              <div className="flex justify-between"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span>₹{totalShipping.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>CGST</span><span>₹{cgst.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>SGST</span><span>₹{igst.toFixed(2)}</span></div>
              {useGoPoints && (
                <div className="flex justify-between text-green-600">
                  <span>Go Points Used</span>
                  <span>-₹{Math.min(goPointsToUse, goPoints, total).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2">
                <span>Total</span>
                <span>₹{finalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handlePlaceOrder} 
              className="w-full bg-[#f68540] text-white py-2 rounded mt-4 hover:bg-[#e07636]"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method Popup */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-full max-w-md">
            <h3 className="text-2xl font-bold mb-4 text-center">Select Payment Method</h3>
            
            <div className="space-y-4 mb-6">
              <div 
                className={`border-2 p-4 rounded-lg cursor-pointer ${
                  selectedPaymentOption === "Online" 
                    ? "border-[#f68540] bg-orange-50" 
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedPaymentOption("Online")}
              >
                <h4 className="font-bold">Online Payment</h4>
                <p>Pay now using Razorpay</p>
              </div>
              
              <div 
                className={`border-2 p-4 rounded-lg cursor-pointer ${
                  selectedPaymentOption === "Wire Transfer" 
                    ? "border-[#f68540] bg-orange-50" 
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedPaymentOption("Wire Transfer")}
              >
                <h4 className="font-bold">Wire Transfer</h4>
                <p>Bank transfer details</p>
              </div>
              
              <div 
                className={`border-2 p-4 rounded-lg cursor-pointer ${
                  selectedPaymentOption === "Cash" 
                    ? "border-[#f68540] bg-orange-50" 
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedPaymentOption("Cash")}
              >
                <h4 className="font-bold">Cash</h4>
                <p>Pay in cash at delivery/store</p>
              </div>
            </div>
            
            {/* Payment Details */}
            {selectedPaymentOption === "Wire Transfer" && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <h4 className="font-bold mb-2">Bank Transfer Details:</h4>
                <p className="mb-1"><strong>Pay To:</strong> Debiarchana Technology (OPC)Pvt Ltd.</p>
                <p className="mb-1"><strong>Account Number:</strong> 39421898213</p>
                <p className="mb-1"><strong>IFSC Code:</strong> SBIN0010930</p>
                <p className="mb-1"><strong>Bank:</strong> State Bank of India</p>
                <p className="mb-1"><strong>Branch:</strong> Bhubaneswar, Odisha, India</p>
                <p className="mb-1"><strong>Currency:</strong> INR</p>
              </div>
            )}
            
            {selectedPaymentOption === "Cash" && (
              <div className="bg-yellow-50 p-4 rounded-lg mb-4">
                <p className="text-red-500">
                  <strong>Note:</strong> You may be required to submit payment proof.
                </p>
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <button 
                onClick={() => setShowPaymentPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button 
                onClick={handlePaymentConfirmation}
                disabled={!selectedPaymentOption}
                className={`px-4 py-2 rounded ${
                  selectedPaymentOption 
                    ? "bg-[#f68540] text-white hover:bg-[#e07636]" 
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;