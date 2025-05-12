import React, { useState, useEffect } from 'react';
import goudhanlogo from '../../assets/goudhanlogo.svg';
import phone from '../../assets/phone.svg';
import cart from '../../assets/cart.svg';
import search from '../../assets/search.svg';
import login from '../../assets/login.svg';
import email from '../../assets/email.png';
import { Link } from 'react-router-dom';
import { FaUser, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import axios from 'axios'; 

const Navbar = () => {
  const [settings, setSettings] = useState(null);
  const [cartItems, setCartItems] = useState(0); // Total quantity in cart

  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found');
        return;
      }

      try {
        const response = await axios.get('https://mitdevelop.com/goudhan/api/settings', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });

        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  // Fetch cart data
const fetchCart = async () => {
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;

  if (!userId) {
    console.warn("No user ID found in localStorage.");
    return;
  }

  try {
    const response = await axios.get(`https://mitdevelop.com/goudhan/api/cart/${userId}`);
    if (response.data && response.data.total_quantity !== undefined) {
      setCartItems(response.data.total_quantity);
    } else {
      setCartItems(0);
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};


  return (
    <div>
      <section className="header bg-[#4D953E] p-1">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="grid grid-cols-1 xl:grid-cols-2">
            <div className="flex gap-5">
              <div className="flex gap-2 items-center">
                <FaPhoneAlt className="text-white text-sm" />
                <p className="text-white">{settings ? settings.phone_number : 'Loading...'}</p>
              </div>
              <div className="flex gap-2 items-center">
                <FaEnvelope className="text-white text-sm" />
                <p className="text-white">{settings ? settings.email : 'Loading...'}</p>
              </div>
            </div>
            <div className="flex gap-2 items-center justify-end">
              <FaUser className="text-white text-lg" />
              <Link to="/Login">
                <p className="text-white">Login</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <nav className="bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 px-8">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src={goudhanlogo} alt="logo" className="w-[168px]" />
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <Link to="/cart">
              <div className="relative">
                <img src={cart} alt="cart" className="ml-[76px]" />
                {cartItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {cartItems}
                  </span>
                )}
              </div>
            </Link>
            <img src={search} alt="search" className="ml-5" />
            <button
              data-collapse-toggle="navbar-sticky"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
            </button>
          </div>
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul className="flex flex-col p-4 md:p-0 mt-4 gap-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-white">
              <li>
                <Link to="/" className="block py-2 hover:text-[#F48643] duration-200">Home</Link>
              </li>
              <li>
                <a href="#" className="block py-2 hover:text-[#F48643] duration-200">About</a>
              </li>
              <li>
                <a href="#" className="block py-2 hover:text-[#F48643] duration-200">Blogs</a>
              </li>
              <li>
                <a href="/OurProducts" className="block py-2 hover:text-[#F48643] duration-200">Our Products</a>
              </li>
              <li>
                <Link to="/ContactUs" className="block py-2 hover:text-[#F48643] duration-200">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
