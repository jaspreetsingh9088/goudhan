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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setIsAuthenticated(true);

    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://goudhan.life/admin/api/settings', {
          headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            Accept: 'application/json',
          },
        });
        if (response.data.success) setSettings(response.data.data);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    const fetchCart = async () => {
      if (!token) return;
      try {
        const response = await axios.get('https://goudhan.life/admin/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response?.data?.total_quantity || 0);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchSettings();
    fetchCart();
  }, []);

  const handleLoginClick = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const roleId = JSON.parse(user).role_id;
      navigate(roleId == 2 ? '/seller' : '/dashboard');
    } else {
      navigate('/Login');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      {/* Top Header */}
      <section className="bg-[#4D953E] p-1">
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="grid grid-cols-1 xl:grid-cols-2">
            <div className="flex gap-5 items-center text-white text-sm">
              <div className="flex items-center gap-2">
                <FaPhoneAlt />
                <p>{settings ? settings.phone_number : 'Loading...'}</p>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope />
                <p>{settings ? settings.email : 'Loading...'}</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4">
              {isAuthenticated ? (
                <div className="flex gap-2 items-center cursor-pointer" onClick={handleLoginClick}>
                  <FaUser className="text-white text-lg" />
                  <span className="text-white font-medium">My Account</span>
                </div>
              ) : (
                <div className="flex gap-3 text-white font-medium text-sm">
                  <button onClick={() => navigate('/Login')} className="hover:underline">
                    Login
                  </button>
                  <span>|</span>
                  <button onClick={() => navigate('/signup')} className="hover:underline">
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Nav */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto px-8 py-4">
          <Link to="/" className="flex items-center">
            <img src={goudhanlogo} alt="Goudhan Logo" className="w-[168px]" />
          </Link>

          {/* Right Icons */}
          <div className="flex items-center gap-5 md:order-2">
            <Link to="/cart">
              <div className="relative">
                <img src={cart} alt="Cart" className="w-6 h-6" />
              {cartItems > 0 && (
  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-semibold rounded-full px-1 animate-pulse shadow-md">
    {cartItems}
  </span>
)}

              </div>
            </Link>
            <img src={search} alt="Search" className="w-5 h-5" />

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="md:hidden text-gray-700 hover:text-black"
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

          {/* Menu Links */}
         
         <div
  className={`${
    isMenuOpen ? 'block' : 'hidden'
  } w-full md:flex md:w-auto md:order-1 transition-all duration-300`}
>
  <ul className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 p-4 md:p-0 mt-4 md:mt-0 bg-gray-50 md:bg-white rounded-lg md:rounded-none font-medium text-[#171412] tracking-tight">
    {[
      { label: "Home", to: "/" },
      { label: "About", to: "/AboutUs" },
      { label: "Blogs", to: "#" },
      { label: "Our Products", to: "/OurProducts" },
      { label: "Contact Us", to: "/ContactUs" },
    ].map((item, index) => (
      <li key={index}>
        <Link
          to={item.to}
          className="block relative py-2 px-1 transition duration-200 hover:text-[#F48643] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 hover:after:w-full after:bg-[#F48643] after:transition-all after:duration-300"
        >
          {item.label}
        </Link>
      </li>
    ))}
  </ul>
</div>

        </div>
      </nav>
    </div>
  );
};

export default Navbar;
