import React, { useState } from 'react';
import axios from 'axios';
import login from '../../assets/836047.jpg';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [mode, setMode] = useState('email');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [mobileCredentials, setMobileCredentials] = useState({ phone: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const setter = mode === 'email' ? setCredentials : setMobileCredentials;
    const values = mode === 'email' ? credentials : mobileCredentials;
    setter({ ...values, [e.target.name]: e.target.value });
  };

const handleLogin = async () => {
  setError('');
  setLoading(true);
  try {
    const payload = mode === 'email'
      ? { email: credentials.email, password: credentials.password }
      : { phone_number: mobileCredentials.phone, otp: mobileCredentials.otp };

    const endpoint = mode === 'email'
      ? 'https://goudhan.life/admin/api/login'
      : 'https://goudhan.life/admin/api/verify-otp';

    const response = await axios.post(endpoint, payload);

    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const userRoleId = response.data.user?.role_id;
      console.log("User role ID:", userRoleId);

      if (userRoleId == 1) {
        navigate('/dashboard');
      } else if (userRoleId == 2) {
        navigate('/Seller'); 
      } else if (userRoleId == 3) {
        navigate('/dashboard');
      } else {
        navigate('/dashboard');
      }

    } else {
      setError(response.data.message || 'Login failed');
    }
  } catch (err) {
    setError(err.response?.data?.message || (err.response?.status === 401 ? 'Invalid credentials' : 'Server error.'));
  } finally {
    setLoading(false);
  }
};


 

  const sendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('https://goudhan.life/admin/api/send-otp', {
        phone_number: mobileCredentials.phone,
      });

      if (response.status === 200) {
        setOtpSent(true);
        setError('');
      } else {
        setError('This phone number is not registered.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='login border-[#000] bg-[#fffaf8] py-18'>
      <div className='max-w-7xl mx-auto px-8'>
        <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-10 items-center bg-[#fff] py-10 px-10 shadow-xl'>
          <div>
            <img src={login} alt="Login visual" />
          </div>
          <div className='pr-10'>
            <h2 className='text-[#292929] text-[42px] font-bold leading-[48px]'>Members Login</h2>

            {/* Toggle Buttons */}
            <div className="flex bg-[#f4864314] p-3 rounded-full mt-6 mb-6 overflow-hidden w-fit">
              <button
                onClick={() => { setMode('email'); setError(''); }}
                className={`px-6 py-2 rounded-full font-semibold ${mode === 'email' ? 'bg-[#F48643] text-white' : 'text-[#292929]'}`}
              >
                Email Login
              </button>
              <button
                onClick={() => { setMode('mobile'); setError(''); }}
                className={`px-6 py-2 rounded-full font-semibold ${mode === 'mobile' ? 'bg-[#F48643] text-white' : 'text-[#292929]'}`}
              >
                Mobile Login
              </button>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {/* Conditional Inputs */}
            {mode === 'email' ? (
              <>
                <input name="email" value={credentials.email} onChange={handleChange} className="border-b border-[#000000] text-[#000000] mb-6 block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none" placeholder="Enter email" type="email" />
                <input name="password" value={credentials.password} onChange={handleChange} className="border-b border-[#000000] text-[#000000] block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none" placeholder="Enter password" type="password" />
              </>
            ) : (
              <>
                <input name="phone" value={mobileCredentials.phone} onChange={handleChange} className="border-b border-[#000000] text-[#000000] mb-6 block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none" placeholder="Enter mobile number" type="text" />
                {otpSent && <input name="otp" value={mobileCredentials.otp} onChange={handleChange} className="border-b border-[#000000] text-[#000000] block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none" placeholder="Enter OTP" type="text" />}
                {!otpSent ? <button type="button" onClick={sendOtp} className='bg-[#F48643] py-3 w-full text-white mt-10 hover:bg-[#4D953E] duration-200 hover:scale-95' disabled={loading}>{loading ? 'Sending OTP...' : 'Send OTP'}</button> : null}
              </>
            )}

            {(mode === 'email' || otpSent) && <button type="button" onClick={handleLogin} className='bg-[#F48643] py-3 w-full text-white mt-10 hover:bg-[#4D953E] duration-200 hover:scale-95' disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>}

            <p className="mt-4 text-[#292929]">If you're a New User, Please Register first! <span className="text-[#F48643] font-semibold"><Link to="/signup">Sign Up</Link></span></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;