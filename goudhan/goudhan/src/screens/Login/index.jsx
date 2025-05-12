import React, { useState } from 'react';
import axios from 'axios';
import login from '../../assets/login.png';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://mitdevelop.com/goudhan/api/login', credentials);
      if (response.data.token) {
        // Save token and user info to localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
  
        navigate('/dashboard'); // Redirect on successful login
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError('Invalid credentials');
      } else {
        setError('Server error. Please try again later.');
      }
    }
  };
  
  return (
    <section className='login border-t-1 border-[#000] pt-18'>
      <div className='max-w-7xl mx-auto px-8'>
        <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-10 items-center bg-[#FFFAF8]'>
          <div>
            <img src={login} alt="" />
          </div>
          <div className='pr-10'>
            <h2 className='text-[#292929] text-[42px] font-bold leading-[48px]'>Login to your account</h2>
            <p className='text-[#292929] mt-4 mb-8'>
              Don’t have an account? <Link to="/SignUp" className='text-[#F48643] font-medium'>Sign Up free!</Link>
            </p>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            <input
              name="email"
              value={credentials.email}
              onChange={handleChange}
              className="border-b border-[#000000] text-[#000000] mb-6 block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none"
              placeholder="Phone number or Email id*"
              required
              type="text"
            />

            <input
              name="password"
              value={credentials.password}
              onChange={handleChange}
              className="border-b border-[#000000] text-[#000000] block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none"
              placeholder="Password*"
              required
              type="password"
            />

            <button
              type="button"
              onClick={handleLogin}
              className='bg-[#F48643] py-3 w-full text-white mt-10 hover:bg-[#4D953E] duration-200 hover:scale-95'
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
