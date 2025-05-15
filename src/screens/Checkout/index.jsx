import React, { useState } from 'react';

const Checkout = () => {
  const [quantity, setQuantity] = useState(1);
  const pricePerItem = 2525;

  const subtotal = quantity * pricePerItem;
  const shipping = 100; // example static shipping
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-3 gap-8">
      {/* Left Column - Billing Info */}
      <div className="col-span-2">
        <h2 className="text-2xl font-semibold mb-4">Billing Information</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full border rounded p-2"
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border rounded p-2"
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="w-full border rounded p-2"
          />
          <textarea
            placeholder="Shipping Address"
            rows="4"
            className="w-full border rounded p-2"
          />
        </form>
      </div>

      {/* Right Column - Order Summary */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
        <div className="border p-4 rounded shadow-md space-y-4 bg-white">
          {/* Product Info */}
          <div className="flex items-center gap-4">
            <img
              src="https://mitdevelop.com/goudhan/uploads/products/1715160613.png"
              alt="Product"
              className="w-20 h-20 object-cover border"
            />
            <div>
              <h3 className="font-semibold">A2 Whole Gir Cow Milk Powder (100g)</h3>
              <p>Price: ₹{pricePerItem.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <button
                  className="px-2 border"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  className="px-2 border"
                  onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Pricing Details */}
          <div className="border-t pt-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹{shipping.toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>₹{total.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Placeholder */}
          <div className="mt-4">
            <label className="block font-medium mb-2">Payment Method</label>
            <select className="w-full border p-2 rounded">
              <option>Credit / Debit Card</option>
              <option>UPI</option>
              <option>Cash on Delivery</option>
            </select>
          </div>

          {/* Checkout Button */}
          <button className="w-full bg-[#f68540] text-white py-2 rounded mt-4">
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
