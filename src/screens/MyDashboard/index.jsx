import React, { useState, useEffect } from 'react';
import { AiOutlineDashboard } from 'react-icons/ai';
import { FaBoxOpen, FaRegAddressBook, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import myprofile from '../../assets/myprofile.png';
import axios from 'axios';
 
const MyDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState(null); // State to store user data

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token'); // Get token from local storage
        console.error('toekn data:', token);

      if (!token) {
        console.log('No token found. Please log in.');
        window.location.href = '/login';
        return;
      }

      try {
        const response = await axios.get('https://mitdevelop.com/goudhan/admin/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`, // Attach token in Authorization header
            'Accept': 'application/json',
          },
        });
        
        setUserData(response.data); // Set user data in state
      } catch (error) {
        console.error('Error fetching user data:', error.response?.data || error.message);
        localStorage.removeItem('token'); // Clear token if error occurs
        window.location.href = '/login';
      }
    };

    fetchUserData();
  }, []); // Empty dependency array to run this once when component mounts

const handleLogout = async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    console.log('No token found. Already logged out.');
    // Remove only token and user keys, not entire localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    return;
  }

  try {
    const response = await axios.post(
      'https://mitdevelop.com/goudhan/admin/api/logout',
      {}, // No body
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      }
    );

    console.log('Logout success:', response.data);
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
  } finally {
    // Remove only token and user keys, not entire localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
};

  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return <p className="text-gray-700">Here are your recent orders.</p>;
      case 'profile':
        return (
          <div>
            <h2 className="text-[38px] font-bold text-[#2e6922]">Your Profile</h2>
            <p className="text-[#292929] mb-6">Update your profile information here.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-[#fff] shadow-lg">
                <h3 className="font-bold text-[#4D953E] mb-2">Name</h3>
                <p className="text-gray-600">{userData?.name}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-lg">
                <h3 className="font-bold text-[#4D953E] mb-2">Email</h3>
                <p className="text-gray-600">{userData?.email}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-lg">
                <h3 className="font-bold text-[#4D953E] mb-2">Phone</h3>
                <p className="text-gray-600">{userData?.phone_number}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-lg">
                <h3 className="font-bold text-[#4D953E] mb-2">Address</h3>
                <p className="text-gray-600">{userData?.address}</p>
              </div>
              <div className="mt-4">
                <button className="bg-[#4D953E] text-white py-2 px-4 rounded-md">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        );
      case 'addresses':
        return <p className="text-gray-700">Manage your saved addresses here.</p>;
      case 'logout':
        handleLogout();
        return <p className="text-gray-700">Logging out...</p>;
      default:
        return (
          <>
            <h2 className="text-[38px] font-bold text-[#2e6922]">Welcome to your account!</h2>
            <p className="text-[#292929] mb-6">Manage your orders, profile info and explore more Gir cow products from Goudhan.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-md bg-[#fff] shadow-lg">
                <h3 className="font-bold text-[#4D953E] mb-2">Name</h3>
                <p className="text-gray-600">{userData?.name}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-lg">
                <h3 className="font-bold text-[#4D953E] mb-2">Email</h3>
                <p className="text-gray-600">{userData?.email}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-lg">
                <h3 className="font-bold text-[#4D953E] mb-2">Phone</h3>
                <p className="text-gray-600">{userData?.phone_number}</p>
              </div>
              <div className="p-4 rounded-md bg-[#fff] shadow-lg">
                <h3 className="font-bold text-[#4D953E] mb-2">Address</h3>
                <p className="text-gray-600">{userData?.address}</p>
              </div>
            </div>
          </>
        );
    }
  };

  const tabIcons = {
    dashboard: <AiOutlineDashboard className="inline mr-2" />,
    orders: <FaBoxOpen className="inline mr-2" />,
    profile: <FaUserEdit className="inline mr-2" />,
    addresses: <FaRegAddressBook className="inline mr-2" />,
    logout: <FaSignOutAlt className="inline mr-2" />
  };

  return (
    <section>
      <div className="py-8 bg-[#4d953e1f] mb-12 border-b-8 border-[#4D953E]">
        <h1 className="text-[52px] text-center font-bold text-[#292929]">Dashboard</h1>
        <nav className="text-center">
          <ol className="inline-flex items-center space-x-2 text-[#4D953E] font-medium text-lg">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><span>/</span></li>
            <li><span className="text-[#292929]">Dashboard</span></li>
          </ol>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="bg-[#ed753b] rounded-lg shadow-lg p-5 sticky top-8 self-start h-fit">
            <div className="flex items-center border-b-1 pb-5 border-[#fff] mb-6">
              <img src={myprofile} alt="Profile" className="w-20 h-20 rounded-full mr-3 border-4 border-[#fff]" />
              <div>
                <p className='text-white'>Hello!</p>
                <h2 className="text-white text-lg font-semibold">{userData?.name}</h2>
              </div>
            </div>

            <ul className="space-y-2">
              {['dashboard', 'orders', 'profile', 'addresses', 'logout'].map(tab => (
                <li key={tab} className="text-start">
                  <button
                    onClick={() => setActiveTab(tab)}
                    className={`font-semibold w-full rounded-lg text-start px-3 py-2 duration-300 flex items-center hover:bg-[#fff] hover:text-[#ed753b] ${
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

          <div className="md:col-span-3 bg-[#e9f2e8] rounded-lg p-5">
            {renderContent()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyDashboard;
