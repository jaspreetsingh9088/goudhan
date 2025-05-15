import React, { useState } from "react";
import cowswalking from "../../assets/cowswalking.png";
import myprofile from "../../assets/myprofile.png";

export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("Seller Products");

  return (
    <div className="p-4 max-w-7xl mx-auto bg-[#ff8d4c0f]">
      {/* Seller Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-3">
            <div className='bg h-[] bg-center  bg-no-repeat rounded-lg  bg-cover' style={{ backgroundImage: `url(${cowswalking})` }}>
        <div className="flex items-center gap-4 bg-[#fff] relative top-20 py-5 px-6 rounded-lg shadow-lg ">
          <img
            src={myprofile} alt="Seller"
            className="rounded-full border-3 border-[#fff] w-24 object-cover relative bottom-16"
          />
          <div>
            <h2 className="text-[24px]  font-bold ">Raymour</h2>
            <p className="text-gray-500">Home of modern & stylish furniture.</p>
            <div className="text-sm mt-2 flex gap-4">
              <p><span className="font-semibold text-[#4D953E]">Location:</span> Illinois, USA</p>
              <p><span className="font-semibold text-[#4D953E]">Joined:</span> 10 October 2021</p>
              <p><span className="font-semibold text-[#4D953E]">Total Product:</span> 230</p>
            </div>
          </div>
        </div>

        {/* Social and Follow */}
      </div>
        </div>
        <div>
               {/* Shop Owner */}
      <div className="mt-6 flex justify-end">
        <div className="bg-white p-4 rounded-xl shadow w-64 text-center">
          <img
            src="https://via.placeholder.com/150"
            alt="Shop Owner"
            className="rounded-xl mx-auto mb-2"
          />
          <h3 className="font-semibold">Jhon Doe</h3>
        </div>
      </div>

        </div>
      </div>
      

   
      {/* Tabs */}
      <div className="mt-30 border-b border-gray-200">
        <div className="flex gap-6">
          {["Seller Products", "My Products","Extra Info"].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 border-b-2 ${
                activeTab === tab ? "border-[#F48643] text-[#F48643] font-semibold" : "border-transparent text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "Seller Products" ? (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
           <form className="space-y-4">
  <input
    type="text"
    placeholder="Product Name"
    className="w-full border px-4 py-2 rounded-lg"
    name="name"
  />
 
  <textarea
    placeholder="Description"
    className="w-full border px-4 py-2 rounded-lg"
    name="description"
  ></textarea>
  <input
    type="number"
    placeholder="Price"
    className="w-full border px-4 py-2 rounded-lg"
    name="price"
  />
  <input
    type="number"
    placeholder="Stock Quantity"
    className="w-full border px-4 py-2 rounded-lg"
    name="stock_quantity"
  />
  <input
    type="file"
    className="w-full border px-4 py-2 rounded-lg"
    name="image"
  />
  <select
    className="w-full border px-4 py-2 rounded-lg"
    name="status"
  >
    <option value="">Select Status</option>
    <option value="active">Active</option>
    <option value="inactive">Inactive</option>
  </select>

  <button
    type="submit"
    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
  >
    Save Product
  </button>
</form>

          </div>
        ) : (
          <div className="text-gray-500">No content for "{activeTab}" tab yet.</div>
        )}
      </div>

      {/* Search and Sort */}
      <div className="mt-10 flex flex-wrap justify-between items-center">
        <input
          type="text"
          placeholder="Search here..."
          className="border px-4 py-2 rounded-lg w-full sm:w-1/3 mb-4 sm:mb-0"
        />
        <div className="flex gap-4">
          <select className="border px-4 py-2 rounded-lg">
            <option>Sort by</option>
            <option>Price</option>
            <option>Rating</option>
          </select>
          <select className="border px-4 py-2 rounded-lg">
            <option>Show</option>
            <option>10</option>
            <option>20</option>
          </select>
        </div>
      </div>
    </div>
  );
}
