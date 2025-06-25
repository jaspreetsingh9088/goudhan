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
      navigate(roleId === 2 ? '/seller' : '/dashboard');
    } else {
      navigate('/Login');
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div style={{ fontFamily: '"Plus Jakarta Sans", "Noto Sans", sans-serif' }}>
      {/* Top Contact Bar */}
      {/* <section className="bg-[#4D953E] p-1">
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
      </section> */}

      {/* Main Navbar */}
      <header className="flex items-center justify-between border-b border-[#f4f2f1] px-10 py-3 bg-white relative">
        {/* Logo + Name */}
        <div className="flex items-center gap-4 text-[#171412]">
          <div className="size-4">
            {/* <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                fill="currentColor"
              />
            </svg> */}
          </div>
           <Link to="/" className="flex items-center">
            <img src={goudhanlogo} alt="Goudhan Logo" className="w-[168px]" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-9 text-sm font-medium text-[#171412]">
          <Link to="/">Home</Link>
          <Link to="/OurProducts">Products</Link>
          <Link to="/AboutUs">About Us</Link>
          <Link to="/ContactUs">Contact</Link>
        </nav>

        {/* Actions */}
        <div className="flex gap-2 items-center">
          {isAuthenticated ? (
            <button
              onClick={handleLoginClick}
              className="hidden md:flex h-10 min-w-[84px] px-4 items-center justify-center rounded-xl bg-[#f3e3d7] text-sm font-bold tracking-[0.015em] text-[#171412]"
            >
              My Account
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate('/signup')}
                className="hidden md:flex h-10 min-w-[84px] px-4 items-center justify-center rounded-xl bg-[#f3e3d7] text-sm font-bold tracking-[0.015em] text-[#171412]"
              >
                Register
              </button>
              <button
                onClick={() => navigate('/Login')}
                className="hidden md:flex h-10 min-w-[84px] px-4 items-center justify-center rounded-xl bg-[#f4f2f1] text-sm font-bold tracking-[0.015em] text-[#171412]"
              >
                Login
              </button>
            </>
          )}

          <Link to="/cart" className="relative flex items-center justify-center h-10 px-2.5 rounded-xl bg-[#f4f2f1]">
            <img src={cart} alt="Cart" className="w-5 h-5" />
            {cartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1">
                {cartItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden text-gray-700 hover:text-black ml-2"
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

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md md:hidden z-20">
            <nav className="flex flex-col text-sm font-medium text-[#171412] px-6 py-4">
              <Link to="/" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/OurProducts" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>Products</Link>
              <Link to="/AboutUs" className="py-2 border-b" onClick={() => setIsMenuOpen(false)}>About Us</Link>
              <Link to="/ContactUs" className="py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>

              {!isAuthenticated && (
                <>
                  <button
                    onClick={() => {
                      navigate('/Login');
                      setIsMenuOpen(false);
                    }}
                    className="py-2 border-t text-left"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      navigate('/signup');
                      setIsMenuOpen(false);
                    }}
                    className="py-2 text-left"
                  >
                    Register
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </header>
    </div>
  );
};

export default Navbar;
