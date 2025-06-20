import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import gaushalabg from "../../assets/gaushalabg.jpg";
import defaultProfile from "../../assets/myprofile.png";
import profile from "../../assets/profile.jpg";
import Swal from 'sweetalert2'; 
import { FaRegCalendarAlt } from "react-icons/fa";
import { FiBox } from "react-icons/fi";
import { FaEdit } from 'react-icons/fa';
import { FaBriefcase, FaEnvelope, FaBirthdayCake } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa"; 
import GoPointsSummary from '../../components/GoPointsSummary';






export default function SellerDashboard() {
  const [activeTab, setActiveTab] = useState("My Products");
  const [authUser, setAuthUser] = useState(null);
  const navigate = useNavigate();
const [myProducts, setMyProducts] = useState([]);
const [totalProducts, setTotalProducts] = useState(0);

const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);
const [selectedProductForEdit, setSelectedProductForEdit] = useState(null);

  const [categories, setCategories] = useState([]);
const [subcategories, setSubcategories] = useState([]);

const [myprofile, setMyprofile] = React.useState(null);
 const [showModal, setShowModal] = useState(false);

 const [isModalOpen, setIsModalOpen] = React.useState(false);
const [profileImageUrl, setProfileImageUrl] = React.useState(null);

useEffect(() => {
  const fetchMyProducts = async () => {
    if (activeTab !== "My Products") return;

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://goudhan.life/admin/api/seller-products", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        const products = data.products || [];
        setMyProducts(products);
        setTotalProducts(products.length);

      } else {
        console.error("Failed to fetch seller products:", data.message);
      }
    } catch (error) {
      console.error("Error fetching seller products:", error);
    }
  };

  fetchMyProducts();
}, [activeTab]);

 
  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://goudhan.life/admin/api/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login"); 
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
   
const [form, setForm] = React.useState({
  category_id: "",
  subcategory_id: "",
  name: "",
  marked_price: "",
  discount: "",
  shipping_charge: "",
  selling_price: "",
  quantity: "",
  manufacturer: "",
  cgst: "",
  sgst: "",
  description: "",
  status: "inactive",
  images: null,
  user_id: "",
  profile_image: null,  // to hold user profile image URL or File
});

useEffect(() => {
  const user = localStorage.getItem("user");
  if (user) {
    const parsedUser = JSON.parse(user);
    setAuthUser(parsedUser);

    setForm((prev) => ({
      ...prev,
      user_id: parsedUser.id,
      profile_image: parsedUser.profile_image || null, // assuming user has profile_image URL
    }));

    // Set image src for the img tag
    setMyprofile(parsedUser.profile_image || null);
  }
}, []);

const handleChange = (e) => {
  const { name, value, type, files } = e.target;

  if (type === "file") {
    setForm((prev) => ({
      ...prev,
      [name]: files[0], 
    }));
  } else {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    const formData = new FormData();

   
    for (const key in form) {
      if (!form.hasOwnProperty(key)) continue;

      const value = form[key];

      
      if (key === "images" && value) {
        formData.append("images", value); 
      } else {
        formData.append(key, value);
      }
    }

    const response = await fetch("https://goudhan.life/admin/api/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
 
       Swal.fire({
        title: 'Success!',
        text: 'Product created successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });
      
      setForm({
        category_id: "",
        subcategory_id: "",
        name: "",
        marked_price: "",
        // discount: "",
        // shipping_charge: "",
        // selling_price: "",
        quantity: "",
        // go_points: "",
        manufacturer: "",
        cgst: "",
        sgst: "",
        description: "",
        status: "inactive",
        images: null,
      });

      // Optional: Switch tab after success
      setActiveTab("My Products");
    } else {
      Swal.fire({
        title: 'Failed!',
        text: data.message || 'Failed to create product. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error("API Error:", data);
    }
  } catch (error) {
    console.error("Submission failed:", error);
    Swal.fire({
      title: 'Error!',
      text: 'Something went wrong. Check console for details.',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
};

useEffect(() => {
  const token = localStorage.getItem("token");

  fetch("https://goudhan.life/admin/api/seller-categories", {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setCategories(data.categories || []);
      } else {
        console.error("Failed to fetch seller's assigned categories");
      }
    })
    .catch((error) =>
      console.error("Error fetching seller's categories:", error)
    );
}, []);

useEffect(() => {
  if (form.category_id) {
    const selectedCategory = categories.find(
      (cat) => cat.id.toString() === form.category_id.toString()
    );
    if (selectedCategory) {
      setSubcategories(selectedCategory.subcategories || []);
    } else {
      setSubcategories([]);
    }
  } else {
    setSubcategories([]);
  }
}, [form.category_id, categories]);

const [editForm, setEditForm] = React.useState({
  name: "",
  email: "",
  phone_number: "",
  address: "",
    pincode: "",
  date_of_birth: "",
  occupation: "",
  shop_name:"",
  profile_image: null,
});

const openEditProfileModal = () => {
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  setEditForm({
    name: userData.name || "",
    email: userData.email || "",
    phone_number: userData.phone_number || "",
    address: userData.address || "",
     pincode: userData.pincode || "",
  date_of_birth: userData.date_of_birth || "",
  occupation: userData.occupation || "",
  shop_name: userData.shop_name || "" ,
    profile_image: null, 
  });

  // Set preview URL to existing image path (full URL or relative path)
  if (userData.profile_image) {
    // If your image URL is relative, prepend your base URL here, e.g.:
    const imageUrl = userData.profile_image.startsWith("http")
      ? userData.profile_image
      : `https://goudhan.life/admin/storage/app/public/${userData.profile_image}`;

    setProfileImageUrl(imageUrl);
  } else {
    setProfileImageUrl(null);
  }

  setIsModalOpen(true);
};


const handleEditChange = (e) => {
  const { name, value, type, files } = e.target;

  if (type === "file") {
    const file = files[0];
    setEditForm((prev) => ({ ...prev, [name]: file }));

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfileImageUrl(previewUrl);
    } else {
      setProfileImageUrl(null);
    }
  } else {
    setEditForm((prev) => ({ ...prev, [name]: value }));
  }
};


const handleEditSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    const formData = new FormData();

    for (const key in editForm) {
      if (editForm[key] !== null) {
        formData.append(key, editForm[key]);
      }
    }

    const response = await fetch("https://goudhan.life/admin/api/user/update", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Update state and localStorage
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthUser(data.user); // This triggers re-render

      Swal.fire("Updated!", "Profile updated successfully", "success");
      setIsModalOpen(false);
    } else {
      Swal.fire("Error!", data.message || "Update failed", "error");
    }
  } catch (err) {
    console.error("Profile update error:", err);
    Swal.fire("Error!", "Something went wrong", "error");
  }
};


{/* product edit */ }
const openEditProductModal = (product) => {
  console.log('Product data:', product);

  setSelectedProductForEdit(product);

  // Extract first image URL if images array exists
  const firstImage = product.images && product.images.length > 0
    ? product.images[0] // assuming this is a string URL already
    : null;

  setForm({
    name: product.name || '',
    price: product.price || '',
    category_id: product.category.id || '',
    sub_category_id: product.subcategory.id || '',
    image: null, // for new image upload
    existingImage: firstImage, // URL string for preview
  });

  setIsEditProductModalOpen(true);
};

const [products, setProducts] = React.useState([]);

 

const handleUpdateProduct = async (e, productId) => {
  e.preventDefault();
  const token = localStorage.getItem("token");

  try {
    const formData = new FormData();

    for (const key in form) {
      if (form[key] !== null && form[key] !== undefined) {
        if (key === "image") {
          formData.append("images[]", form[key]);
        } else if (key === "price") {
          formData.append("marked_price", form[key]);
        } else {
          formData.append(key, form[key]);
        }
      }
    }

    formData.append("_method", "PUT");

    const response = await fetch(`https://goudhan.life/admin/api/products/${productId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      Swal.fire("Updated!", data.message || "Product updated successfully", "success");

      // Option 1: Update product in list
      setProducts(prev =>
        prev.map(p => (p.id === data.data.id ? data.data : p))
      );

      // Option 2: Re-fetch from server
      // await fetchProducts();

      setIsEditProductModalOpen(false);
    } else {
      Swal.fire("Error!", data.message || "Update failed", "error");
    }
  } catch (err) {
    console.error("Product update error:", err);
    Swal.fire("Error!", "Something went wrong", "error");
  }
};




  return (
    <div className="bg-[#ff8d4c0f] pt-5">
      <div className="p-4 max-w-7xl mx-auto ">
        {/* Seller Info */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div className="col-span-3 bg-[#fff] rounded-lg shadow-lg ">
            <div className="bg h-[200px] bg-bottom bg-no-repeat rounded-lg bg-cover" style={{ backgroundImage: `url(${gaushalabg})` }}></div>
            <div className="relative">
              <div className="flex items-center gap-12 bg-[#fff]  -top-10 w-[100%] z py-5 pt-0 px-6 rounded-lg items-end">
                <div>
                  <img
                   src={myprofile ? `https://goudhan.life/admin/storage/app/public/${myprofile}` : defaultProfile}
                    alt="Seller"
                    className="rounded-full border-3 border-[#fff] w-30 h-30 object-cover relative bottom-30"
                  />
                  
              </div>
<div>
  <h2 className="text-[38px] font-bold capitalize">{authUser?.name || "Raymour"}</h2>

  <p className="text-[#292929] text-[18px] mb-3 py-2 rounded-sm flex items-center gap-4 flex-wrap">
    <span className="flex items-center gap-1">
      <FaBriefcase className="text-[#f48643]" />
      {authUser?.occupation || "Seller"}
    </span>

    <span className="flex items-center gap-1">
      <FaEnvelope className="text-[#f48643]" />
      {authUser?.email || ""}
    </span>

    <span className="flex items-center gap-1">
      <FaBirthdayCake className="text-[#f48643]" />
      {authUser?.date_of_birth || "N/A"}
    </span>
  </p>

  <div className="text-sm mt-3 flex gap-10 bg-[#4d953e0d] px-5 py-2 rounded-lg flex-wrap">
    <div>
      <p className="mb-2">
        <span className="font-semibold text-[#292929] text-[20px]">Location:</span>
      </p>
     <div className="flex items-center gap-1 text-[#4D953E]">
      <FaMapMarkerAlt className="text-[#f48643]" />
      <p>{authUser?.address || "N/A"}</p>
    </div>
    </div>

    <div>
      <p className="mb-2">
        <span className="font-semibold text-[#292929] text-[20px]">Joined:</span>
      </p>
      <div className="flex items-center gap-2 text-[#4D953E]">
        <FaRegCalendarAlt className="text-[#f48643]" />
        <p>
          {authUser?.created_at
            ? new Date(authUser.created_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "15 May 2025"}
        </p>
      </div>
    </div>

    <div>
      <p className="mb-2">
        <span className="font-semibold text-[#292929] text-[20px]">Total Product:</span>
      </p>
      <div className="flex items-center gap-2 text-[#4D953E]">
        <FiBox className="text-[#f48643]" />
        <p>{totalProducts}</p>
      </div>
    </div>
  </div>
</div>
               <div className="block ml-auto">
                
                <button
                  onClick={openEditProfileModal}
                  className="cursor-pointer text-center bg-[#4D953E] text-white w-[100%] block ml-auto px-8 py-2 rounded-full"
                >
                  Edit Profile
                </button>
                                <button onClick={handleLogout} className="bg-[#f48643] p-2 w-[100%] block ml-auto text-[#fff] font-semibold mt-3 rounded-full">Logout</button>

              </div>

              </div>
            </div>
          </div>

          {/* Shop Owner */}
          <div className="flex justify-end">
            
          </div>
        </div>
{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto h-screen p-4 backdrop-blur-[1px] bg-black/10">
    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[calc(100vh-4rem)] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      <form onSubmit={handleEditSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={editForm.name || ""}
              onChange={handleEditChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Enter your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="text"
              name="email"
              value={editForm.email || ""}
              onChange={handleEditChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Enter your email"
            />
          </div>

          {/* Phone number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone number</label>
            <input
              type="text"
              name="phone_number"
              value={editForm.phone_number || ""}
              onChange={handleEditChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Enter your phone number"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={editForm.address || ""}
              onChange={handleEditChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Enter your address"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={editForm.pincode || ""}
              onChange={handleEditChange}
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="date_of_birth"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={editForm.date_of_birth || ""}
              onChange={handleEditChange}
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Occupation</label>
            <input
              type="text"
              name="occupation"
              className="w-full border border-gray-300 rounded px-4 py-2"
              value={editForm.occupation || ""}
              onChange={handleEditChange}
            />
          </div>

          {/* Shop Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-1">Shop Name</label>
          <input
            type="text"
            name="shop_name"
            className="w-full border border-gray-300 rounded px-4 py-2"
            value={editForm.shop_name || ""}
            onChange={handleEditChange}
          />
        </div>


          {/* Profile Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Profile Image</label>
            {profileImageUrl && (
              <img
                src={profileImageUrl}
                alt="Profile Preview"
                className="mb-2 w-24 h-24 object-cover rounded-full border"
              />
            )}
            <input
              type="file"
              name="profile_image"
              onChange={handleEditChange}
              className="w-full border border-gray-300 rounded px-4 py-2"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-[#4D953E] text-white px-4 py-2 rounded"
          >
            Update Profile
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        {/* Tabs */}

<div className="bg-[#fff] p-5 mt-10">
  <div className="border-b border-gray-200">
    <div className="flex gap-1">
      {["My Products", "Create Products", "Extra Info"].map(tab => (
        <button  key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 ${activeTab === tab ? "text-[#f48643] font-semibold border-b-2 border-[#f48643] duration-300" : "text-white font-semibold bg-[#f48643] cursor-pointer"}`}>
          {tab}
        </button>
      ))}
    </div>
  </div>
 

 

  {/* Tab Content */}
  <div className="mt-6">
    {activeTab === "Create Products" && (
      <div>
 <p>Display seller's product list here.</p>

    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
  <div>
    <label className="block text-gray-700 font-medium mb-1">Category</label>
   <select
  name="category_id"
  value={form.category_id}
  onChange={handleChange}
  required
  className="w-full border border-gray-300 rounded px-4 py-2"
>
  <option value="">Select Category</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>{cat.name}</option>
  ))}
</select>

  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Subcategory</label>
   <select
  name="subcategory_id"
  value={form.subcategory_id}
  onChange={handleChange}
  required
  className="w-full border border-gray-300 rounded px-4 py-2"
>
  <option value="">Select Subcategory</option>
  {subcategories.map((sub) => (
    <option key={sub.id} value={sub.id}>{sub.sub_category}</option>
  ))}
</select>

  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Name</label>
    <input
      type="text"
      name="name"
      value={form.name}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Price for Goudhan</label>
    <input
      type="number"
      name="marked_price"
      value={form.marked_price}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div>

  {/* <div>
    <label className="block text-gray-700 font-medium mb-1">Discount</label>
    <input
      type="number"
      name="discount"
      value={form.discount}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Shipping Charge</label>
    <input
      type="number"
      name="shipping_charge"
      value={form.shipping_charge}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">Selling Price</label>
    <input
      type="number"
      name="selling_price"
      value={form.selling_price}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div> */}

  <div>
    <label className="block text-gray-700 font-medium mb-1">Quantity</label>
    <input
      type="number"
      name="quantity"
      value={form.quantity}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div>

  {/* <div>
    <label className="block text-gray-700 font-medium mb-1">Go Points</label>
    <input
      type="number"
      name="go_points"
      value={form.go_points}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div> */}

  <div>
    <label className="block text-gray-700 font-medium mb-1">Manufacturer</label>
    <input
      type="text"
      name="manufacturer"
      value={form.manufacturer}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div>

  

  <div>
    <label className="block text-gray-700 font-medium mb-1">CGST</label>
    <input
      type="number"
      name="cgst"
      value={form.cgst}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div>

  <div>
    <label className="block text-gray-700 font-medium mb-1">SGST</label>
    <input
      type="number"
      name="sgst"
      value={form.sgst}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div>
{/* <div>
    <label className="block text-gray-700 font-medium mb-1">Tax Detail</label>
    <input
      type="text"
      name="tax_detail"
      value={form.tax_detail}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    />
  </div> */}
  <div className="md:col-span-2">
    <label className="block text-gray-700 font-medium mb-1">Description</label>
    <textarea
      name="description"
      value={form.description}
      onChange={handleChange}
      rows="4"
      className="w-full border border-gray-300 rounded px-4 py-2"
    ></textarea>
  </div>

  {/* <div> */}
    {/* <label className="block text-gray-700 font-medium mb-1">Status</label> */}
    {/* <select
      name="status"
      value={form.status}
      onChange={handleChange}
      className="w-full border border-gray-300 rounded px-4 py-2"
    >
      <option value="active">Active</option>
      <option value="inactive">Inactive</option>
    </select> */}
  {/* </div> */}


<div>
  <label className="block text-gray-700 font-medium mb-1">Product Image</label>
 <input
  type="file"
  name="images"
  accept="image/*"
  onChange={handleChange}
/>
</div>

  <div className="md:col-span-2 flex justify-end">
    <button
      type="submit"
      className="bg-[#f48643] hover:bg-[#dd742e] text-white font-semibold px-6 py-2 rounded shadow-md"
    >
      Submit Product
    </button>
  </div>
</form>

      </div>
    )}
{activeTab === "My Products" && (
  <div className="mt-6">
    <h2 className="text-xl font-bold mb-4">My Products</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {myProducts.map((product) => (
  <div key={product.id} className="p-4 border rounded shadow relative">
    <img
      src={product.images && product.images.length > 0 ? product.images[0] : '/default.jpg'}
      alt={product.name}
      className="w-full h-40 object-cover rounded"
    />
    <h3 className="font-semibold mt-2">{product.name}</h3>
    <p className="text-sm text-gray-600">{product.price} ₹</p>

    {product.status !== 'active' && product.reason && (
      <div className="mt-2 bg-red-100 text-red-700 p-2 rounded text-sm">
        <strong>Rejected:</strong> {product.reason}
      </div>
    )}

   <button
   onClick={() => openEditProductModal(product)}
  className="absolute top-2 right-2 bg-[#f48643] hover:bg-blue-700 text-white p-2 rounded-full shadow"
>
  <FaEdit size={16} />
</button>

{isEditProductModalOpen && selectedProductForEdit && (
  <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-[1px] bg-black/10">
    <div className="bg-white p-6 rounded w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Edit Product</h2>

      <form onSubmit={(e) => handleUpdateProduct(e, selectedProductForEdit.id)} encType="multipart/form-data">
  {/* Category Select */}
<label className="block mb-1 font-medium">Category</label>
<select
  value={form.category_id || ''}
  onChange={(e) => setForm({ ...form, category_id: e.target.value })}
  className="w-full border p-2 mb-4 rounded"
  name="category_id"
>
  <option value="">Select Category</option>
  {categories.map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.name}
    </option>
  ))}
</select>

{/* Subcategory Select */}
<label className="block mb-1 font-medium">Subcategory</label>
<select
  value={form.sub_category_id || ''}
  onChange={(e) => setForm({ ...form, sub_category_id: e.target.value })}
  className="w-full border p-2 mb-4 rounded"
  name="subcategory_id"
>
  <option value="">Select Subcategory</option>
  {subcategories.map((sub) => (
    <option key={sub.id} value={sub.id}>
      {sub.sub_category}
    </option>
  ))}
</select>





        {/* Product Name */}
        <label className="block mb-1 font-medium">Product Name</label>
        <input
          type="text"
          value={form.name || ''}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border p-2 mb-4 rounded"
          name="name"
          
        />

        {/* Product Price */}
        <label className="block mb-1 font-medium">Product Price</label>
        <input
          type="number"
          value={form.price || ''}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="w-full border p-2 mb-4 rounded"
          name="marked_price"
          
        />

        {/* Product Image Preview */}
        <label className="block mb-1 font-medium">Current Image</label>
        {selectedProductForEdit?.images?.[0] && (
          <div className="mb-3">
            <p className="text-sm text-gray-600">Current Image</p>
            <img
              src={selectedProductForEdit.images[0]}
              alt="Current"
              className="w-32 h-auto rounded"
            />
          </div>
        )}



        {/* New Image Input */}
        <label className="block mb-1 font-medium">New Image (optional)</label>
        <input
          type="file"
          name="images[]"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="w-full mb-4"
        />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsEditProductModalOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Update Product
          </button>
        </div>
      </form>
    </div>
  </div>
)}


  </div>
))}

    </div>
  </div>
)}

    {activeTab === "Extra Info" && (
      <div>
        <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
        <p>Put any extra seller/shop information or analytics here.</p>
              <GoPointsSummary />

      </div>
    )}
  </div>
</div>


      </div>
    </div>
    
  );
}
