import React, { useState, useEffect } from 'react';
import { AiOutlineDashboard } from 'react-icons/ai';
import { FaBoxOpen, FaRegAddressBook, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import myprofile from '../../assets/myprofile.png';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import GoPoint from '../GoPoint';

const MyDashboard = () => {
    const [error, setError] = useState(null); // Add error state
const [expandedOrders, setExpandedOrders] = useState({});

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
 const [orders, setOrders] = useState([]);
  const [copied, setCopied] = useState(false);

  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    pincode: '',
    date_of_birth: '',
    occupation: '',
    profile_image: null,
  });

  const navigate = useNavigate();
  const referralLink = `https://goudhan.life/signup/${userData?.phone_number}`;

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found. Please log in.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('https://goudhan.life/admin/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        setUserData(response.data);
        setAuthUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };

  const fetchOrders = async () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await axios.get('https://goudhan.life/admin/api/user-orders', {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });

    console.log('orders:', response.data); // ✅ This will show the array directly
    setOrders(response.data || []); // ✅ Since response.data is an array
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
};


fetchUserData();
fetchOrders();

  }, [navigate]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      return;
    }

    try {
      await axios.post(
        'https://goudhan.life/admin/api/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      );
    } catch (error) {
      console.error('Logout error:', error.response?.data || error.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
      setIsLoggingOut(false);
    }
  };

  const openEditProfileModal = () => {
    const userData = JSON.parse(localStorage.getItem('user')) || {};

    setEditForm({
      name: userData.name || '',
      email: userData.email || '',
      phone_number: userData.phone_number || '',
      address: userData.address || '',
      pincode: userData.pincode || '',
      date_of_birth: userData.date_of_birth || '',
      occupation: userData.occupation || '',
      profile_image: null,
    });

    if (userData.profile_image) {
      const imageUrl = userData.profile_image.startsWith('http')
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

    if (type === 'file') {
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
    const token = localStorage.getItem('token');

    try {
      const formData = new FormData();
      for (const key in editForm) {
        if (editForm[key] !== null) {
          formData.append(key, editForm[key]);
        }
      }

      const response = await fetch('https://goudhan.life/admin/api/user/update', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        Swal.fire('Updated!', 'Profile updated successfully', 'success');
        setIsModalOpen(false);
        setAuthUser(data.user);
      } else {
        Swal.fire('Error!', data.message || 'Update failed', 'error');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      Swal.fire('Error!', 'Something went wrong', 'error');
    }
  };


  const toggleOrderItems = (orderId) => {
  setExpandedOrders((prev) => ({
    ...prev,
    [orderId]: !prev[orderId],
  }));
};

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const generateInvoice = (order) => {
    const doc = new jsPDF();
    let yPos = 20;

    // Adding header
    doc.setFontSize(20);
    doc.text('Goudhan Invoice', 20, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 20, yPos);
    yPos += 10;
    doc.text(`Date: ${new Date(order.created_at).toLocaleDateString()}`, 20, yPos);
    yPos += 10;
    doc.text(`Status: ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`, 20, yPos);
    yPos += 20;

    // Adding items table header
    doc.setFontSize(14);
    doc.text('Order Items:', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.text('Product', 20, yPos);
    doc.text('Quantity', 100, yPos);
    doc.text('Price', 130, yPos);
    doc.text('Shipping', 160, yPos);
    yPos += 5;
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Adding items
    order.items.forEach((item) => {
      doc.text(item.name, 20, yPos, { maxWidth: 70 });
      doc.text(item.quantity.toString(), 100, yPos);
      doc.text(`₹${parseFloat(item.price).toFixed(2)}`, 130, yPos);
      doc.text(`₹${parseFloat(item.shipping_charge).toFixed(2)}`, 160, yPos);
      yPos += 10;
    });

    // Adding total
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Total: ₹${parseFloat(order.total).toFixed(2)}`, 20, yPos);

    // Save the PDF
    doc.save(`invoice_order_${order.id}.pdf`);
  };

  const renderContent = () => {
    switch (activeTab) {
     case 'orders':
  return (
    <div className="orders-section p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-[#2e6922] mb-6">My Orders</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      {!orders ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-[#4D953E] text-white">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold">Order #</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Order ID</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Total</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Date</th>
                <th className="py-3 px-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 text-gray-700">{index + 1}</td>
                    <td className="py-4 px-4 text-gray-700">{order.id}</td>
                    <td className="py-4 px-4 text-gray-700">₹{parseFloat(order.total).toFixed(2)}</td>
                    <td className="py-4 px-4 capitalize text-gray-700">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          order.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4 flex space-x-2">
                      <button
                        onClick={() => toggleOrderItems(order.id)}
                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                      >
                        {expandedOrders[order.id] ? 'Hide Items' : 'View Items'}
                      </button>
                      <button
                        onClick={() => generateInvoice(order)}
                        className="bg-[#4D953E] text-white px-4 py-1.5 rounded-lg text-sm hover:bg-[#3b7a2f] transition-colors"
                      >
                        Download Invoice
                      </button>
                    </td>
                  </tr>
                  {expandedOrders[order.id] && (
                    <tr className="bg-gray-50">
                      <td colSpan="6" className="py-4 px-4">
                        <div className="text-sm font-semibold text-gray-700 mb-2">Order Items:</div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full border border-gray-200 rounded-lg">
                            <thead className="bg-gray-100 text-gray-800">
                              <tr>
                                <th className="py-2 px-4 text-left text-sm font-semibold">Product</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold">Quantity</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold">Price</th>
                                <th className="py-2 px-4 text-left text-sm font-semibold">Shipping</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {order.items?.map((item, itemIndex) => (
                                <tr key={itemIndex} className="hover:bg-gray-100 transition-colors">
                                  <td className="py-2 px-4 text-gray-700">{item.name}</td>
                                  <td className="py-2 px-4 text-gray-700">{item.quantity}</td>
                                  <td className="py-2 px-4 text-gray-700">₹{parseFloat(item.price).toFixed(2)}</td>
                                  <td className="py-2 px-4 text-gray-700">
                                    ₹{parseFloat(item.shipping_charge).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

      case 'profile':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-[#2e6922] mb-6">Your Profile</h2>
            <p className="text-gray-600 mb-6">Update your profile information here.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Name</h3>
                <p className="text-gray-600">{userData?.name || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Email</h3>
                <p className="text-gray-600">{userData?.email || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Phone</h3>
                <p className="text-gray-600">{userData?.phone_number || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Address</h3>
                <p className="text-gray-600">{userData?.address || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Pincode</h3>
                <p className="text-gray-600">{userData?.pincode || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Date of Birth</h3>
                <p className="text-gray-600">{userData?.date_of_birth || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Occupation</h3>
                <p className="text-gray-600">{userData?.occupation || 'N/A'}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={openEditProfileModal}
                  className="bg-[#4D953E] text-white px-8 py-2 rounded-full hover:bg-[#3b7a2f] transition-colors"
                >
                  Edit Profile
                </button>
              </div>
            </div>
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto h-screen p-4 bg-black/30 backdrop-blur-sm">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[calc(100vh-4rem)] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                  <form onSubmit={handleEditSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name || ''}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                          type="text"
                          name="email"
                          value={editForm.email || ''}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Phone number</label>
                        <input
                          type="text"
                          name="phone_number"
                          value={editForm.phone_number || ''}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={editForm.address || ''}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          placeholder="Enter your address"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Pincode</label>
                        <input
                          type="text"
                          name="pincode"
                          value={editForm.pincode || ''}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          placeholder="Enter your pincode"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Date of Birth</label>
                        <input
                          type="date"
                          name="date_of_birth"
                          value={editForm.date_of_birth || ''}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-4 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Occupation</label>
                        <input
                          type="text"
                          name="occupation"
                          value={editForm.occupation || ''}
                          onChange={handleEditChange}
                          className="w-full border border-gray-300 rounded px-4 py-2"
                          placeholder="Enter your occupation"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Profile Image</label>
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
                    <div className="flex justify-end gap-3 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-[#4D953E] text-white px-4 py-2 rounded hover:bg-[#3b7a2f] transition-colors"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      case 'addresses':
        return <p className="text-gray-700 p-6">Manage your saved addresses here.</p>;
      case 'logout':
        handleLogout();
        return null;
      default:
        return (
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-[#2e6922] mb-6">Welcome to your account!</h2>
            <p className="text-gray-600 mb-6">
              Manage your orders, profile info and explore more Gir cow products from Goudhan.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Name</h3>
                <p className="text-gray-600">{userData?.name || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Email</h3>
                <p className="text-gray-600">{userData?.email || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Phone</h3>
                <p className="text-gray-600">{userData?.phone_number || 'N/A'}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-sm">
                <h3 className="font-bold text-[#4D953E] mb-2">Address</h3>
                <p className="text-gray-600">{userData?.address || 'N/A'}</p>
              </div>
              <div
                style={{
                  width: '100%',
                  margin: '1.5rem auto',
                  padding: '1rem',
                  border: '1px solid #ccc',
                  borderRadius: '0.5rem',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Your Referral Link
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={referralLink}
                    readOnly
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      border: '1px solid #ccc',
                      borderRadius: '0.375rem',
                    }}
                  />
                  <button
                    onClick={handleCopy}
                    style={{
                      backgroundColor: '#2563EB',
                      color: '#fff',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      transition: 'background-color 0.2s ease',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = '#1D4ED8')}
                    onMouseOut={(e) => (e.target.style.backgroundColor = '#2563EB')}
                  >
                    Copy
                  </button>
                </div>
                {copied && (
                  <p style={{ color: '#16A34A', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Referral link copied!
                  </p>
                )}
              </div>
            </div>
          </div>
        );
    }
  };

  const tabIcons = {
    dashboard: <AiOutlineDashboard className="inline mr-2" />,
    orders: <FaBoxOpen className="inline mr-2" />,
    profile: <FaUserEdit className="inline mr-2" />,
    addresses: <FaRegAddressBook className="inline mr-2" />,
    logout: <FaSignOutAlt className="inline mr-2" />,
  };

  return (
    <section>
      <div className="py-8 bg-[#4d953e1f] mb-12 border-b-8 border-[#4D953E]">
        <h1 className="text-5xl text-center font-bold text-[#292929]">Dashboard</h1>
        <nav className="text-center">
          <ol className="inline-flex items-center space-x-2 text-[#4D953E] font-medium text-lg">
            <li>
              <a href="/" className="hover:underline">
                Home
              </a>
            </li>
            <li>
              <span>/</span>
            </li>
            <li>
              <span className="text-[#292929]">Dashboard</span>
            </li>
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="bg-[#ed753b] rounded-lg shadow-lg p-5 sticky top-8 self-start h-fit">
            <div className="flex items-center border-b pb-5 border-[#fff] mb-6">
              <img
                src={
                  authUser?.profile_image
                    ? authUser.profile_image.startsWith('http')
                      ? authUser.profile_image
                      : `https://goudhan.life/admin/storage/app/public/${authUser.profile_image}`
                    : myprofile
                }
                alt="Profile"
                className="w-20 h-20 rounded-full mr-3 border-4 border-[#fff]"
              />
              <div>
                <p className="text-white">Hello!</p>
                <h2 className="text-white text-lg font-semibold">{userData?.name || 'User'}</h2>
              </div>
            </div>
            <ul className="space-y-2">
              {['dashboard', 'orders', 'profile', 'addresses', 'logout'].map((tab) => (
                <li key={tab}>
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`font-semibold w-full rounded-lg text-left px-3 py-2 duration-300 flex items-center hover:bg-[#fff] hover:text-[#ed753b] ${
                      activeTab === tab ? 'bg-[#fff] text-[#ed753b]' : 'text-white'
                    }`}
                  >
                    {tabIcons[tab]}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </aside>
          <div className="md:col-span-3 bg-[#e9f2e8] rounded-lg p-5">{renderContent()}</div>
        </div>
      </div>
    </section>
  );
};

export default MyDashboard;