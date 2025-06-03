import React, { useState, useEffect } from 'react';
import goudhanlogo from '../../assets/goudhanlogo.svg';
import cart from '../../assets/cart.svg';
import search from '../../assets/search.svg';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
  const [settings, setSettings] = useState(null);
  const [cartItems, setCartItems] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 👈 mobile menu toggle
  const navigate = useNavigate();
const [isAuthenticated, setIsAuthenticated] = useState(false);

 
   useEffect(() => {
     const token = localStorage.getItem('token');
  if (token) setIsAuthenticated(true);
const fetchSettings = async () => {
  const token = localStorage.getItem('token');

  try {
    const response = await axios.get('https://goudhan.life/admin/api/settings', {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
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

    const fetchCart = async () => {
      const token = localStorage.getItem('token');
    
      if (!token) return;

      try {
        const response = await axios.get('https://goudhan.life/admin/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.total_quantity !== undefined) {
          setCartItems(response.data.total_quantity);
        } else {
          setCartItems(0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    fetchSettings();
    fetchCart();
  }, []);

  
const handleLoginClick = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    const parsedUser = JSON.parse(user);
    const roleId = parsedUser.role_id;
    navigate(roleId == 2 ? '/seller' : '/dashboard');
  } else {
    navigate('/Login');
  }
};



  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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

           <div className="flex gap-4 items-center justify-end">
  {isAuthenticated ? (
    <div
      className="flex gap-2 items-center cursor-pointer"
      onClick={handleLoginClick}
    >
      <FaUser className="text-white text-lg" />
      <span className="text-white">My Account</span>
    </div>
  ) : (
    <>
      <button
        onClick={() => navigate('/Login')}
        className="text-white hover:underline"
      >
        Login
      </button>
      <span className="text-white">|</span>
      <button
        onClick={() => navigate('/signup')}
        className="text-white hover:underline"
      >
        Register
      </button>
    </>
  )}
</div>

          </div>
        </div>
      </section>

      <nav className="bg-white dark:bg-gray-900">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4 px-8">
          <Link to="/" className="flex items-center space-x-3">
            <img src={goudhanlogo} alt="logo" className="w-[168px]" />
          </Link>

          <div className="flex md:order-2 space-x-3 md:space-x-0 items-center">
            <Link to="/cart">
              <div className="relative">
                <img src={cart} alt="cart" className="ml-[20px]" />
                {cartItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {cartItems}
                  </span>
                )}
              </div>
            </Link>
            <img src={search} alt="search" className="ml-5" />

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden"
              onClick={toggleMenu}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Responsive Nav Links */}
          <div
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } w-full md:flex md:w-auto md:order-1`}
          >
            <ul className="flex flex-col md:flex-row md:space-x-8 gap-4 p-4 md:p-0 mt-4 md:mt-0 border border-gray-100 md:border-0 rounded-lg bg-gray-50 md:bg-white">
              <li><Link to="/" className="block py-2 hover:text-[#F48643] duration-200">Home</Link></li>
              <li><Link to="/AboutUs" className="block py-2 hover:text-[#F48643] duration-200">About</Link></li>
              <li><Link to="#" className="block py-2 hover:text-[#F48643] duration-200">Blogs</Link></li>
              <li><Link to="/OurProducts" className="block py-2 hover:text-[#F48643] duration-200">Our Products</Link></li>
              <li><Link to="/ContactUs" className="block py-2 hover:text-[#F48643] duration-200">Contact Us</Link></li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
