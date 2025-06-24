import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../../components/firebase-config';
import loginImage from '../../assets/836047.jpg';

const Login = () => {
  const [mode, setMode] = useState('email');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [mobileCredentials, setMobileCredentials] = useState({ phone_number: '', otp: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const navigate = useNavigate();

  // Handle input changes for email or mobile credentials
  const handleChange = (e) => {
    const { name, value } = e.target;
    const setter = mode === 'email' ? setCredentials : setMobileCredentials;
    setter((prev) => ({ ...prev, [name]: value }));
  };

const setupRecaptcha = () => {
  // This line is NOT needed for production, remove if used:
  // window.localStorage.setItem('firebase:auth:appVerificationDisabled', 'true');

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible', // ✅ This hides the visual captcha
      callback: () => {},
      'expired-callback': () => {
        setError('reCAPTCHA expired. Please try again.');
        window.recaptchaVerifier = null;
      },
    });
  }
};



  // Handle email login
  const handleEmailLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('https://goudhan.life/admin/api/login', {
        email: credentials.email,
        password: credentials.password,
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigateBasedOnRole(response.data.user?.role_id);
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Send OTP for phone authentication
  const sendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      const phone = mobileCredentials.phone_number
        ? `+91${mobileCredentials.phone_number}` // Adjust country code as needed
        : null;
      if (!phone) throw new Error('Phone number is required');

      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      setError('OTP sent successfully');
    } catch (error) {
      setError(error.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP and authenticate with backend
  const verifyOtp = async () => {
    setError('');
    setLoading(true);
    try {
      if (!confirmationResult) throw new Error('No OTP session found');
      const credential = await confirmationResult.confirm(mobileCredentials.otp);
      const idToken = await credential.user.getIdToken();

      const response = await axios.post(
        'https://goudhan.life/admin/api/firebase-login',
        {},
        { headers: { Authorization: `Bearer ${idToken}` } }
      );

      if (response.data.status && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        navigateBasedOnRole(response.data.user?.role_id);
      } else {
        setError(response.data.error || 'Login failed');
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Navigate based on user role
  const navigateBasedOnRole = (roleId) => {
    const routes = { 1: '/dashboard', 2: '/Seller' };
    navigate(routes[roleId] || '/dashboard');
  };

  // Switch login mode
  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setOtpSent(false);
    setConfirmationResult(null);
  };
<style>{`
  #g-recaptcha, .grecaptcha-badge {
    visibility: hidden !important;
    opacity: 0 !important;
    height: 0 !important;
    width: 0 !important;
    pointer-events: none !important;
  }
`}</style>

  return (
    <section className="border-[#000] bg-[#fffaf8] py-18">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-[#fff] py-10 px-10 shadow-xl">
          <div>
            <img src={loginImage} alt="Login visual" />
          </div>
          <div className="pr-10">
            <h2 className="text-[#292929] text-[42px] font-bold leading-[48px]">
              Members Login
            </h2>

            <div className="flex bg-[#f4864314] p-3 rounded-full mt-6 mb-6 w-fit">
              <button
                onClick={() => switchMode('email')}
                className={`px-6 py-2 rounded-full font-semibold ${
                  mode === 'email' ? 'bg-[#F48643] text-white' : 'text-[#292929]'
                }`}
              >
                Email Login
              </button>
              <button
                onClick={() => switchMode('mobile')}
                className={`px-6 py-2 rounded-full font-semibold ${
                  mode === 'mobile' ? 'bg-[#F48643] text-white' : 'text-[#292929]'
                }`}
              >
                Mobile Login
              </button>
            </div>

            {error && <p className="text-red-600 mb-4">{error}</p>}

            {mode === 'email' ? (
              <div className="space-y-6">
                <input
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="border-b border-[#000000] text-[#000000] w-full p-2.5 placeholder-[#000000] focus:outline-none"
                  placeholder="Enter email"
                  type="email"
                />
                <input
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="border-b border-[#000000] text-[#000000] w-full p-2.5 placeholder-[#000000] focus:outline-none"
                  placeholder="Enter password"
                  type="password"
                />
              </div>
            ) : (
              <div className="space-y-6">
                <input
                  name="phone_number"
                  value={mobileCredentials.phone_number}
                  onChange={handleChange}
                  className="border-b border-[#000000] text-[#000000] w-full p-2.5 placeholder-[#000000] focus:outline-none"
                  placeholder="Enter mobile number"
                  type="text"
                />
                {otpSent && (
                  <input
                    name="otp"
                    value={mobileCredentials.otp}
                    onChange={handleChange}
                    className="border-b border-[#000000] text-[#000000] w-full p-2.5 placeholder-[#000000] focus:outline-none"
                    placeholder="Enter OTP"
                    type="text"
                  />
                )}
                {!otpSent && (
                  <button
                    type="button"
                    onClick={sendOtp}
                    className="bg-[#F48643] py-3 w-full text-white mt-10 hover:bg-[#4D953E] duration-200 hover:scale-95"
                    disabled={loading}
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                )}
              </div>
            )}

            {(mode === 'email' || otpSent) && (
              <button
                type="button"
                onClick={mode === 'email' ? handleEmailLogin : verifyOtp}
                className="bg-[#F48643] py-3 w-full text-white mt-10 hover:bg-[#4D953E] duration-200 hover:scale-95"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            )}

<div id="recaptcha-container" style={{ display: 'none' }} />

            <p className="mt-4 text-[#292929]">
              New User?{' '}
              <Link to="/signup" className="text-[#F48643] font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;