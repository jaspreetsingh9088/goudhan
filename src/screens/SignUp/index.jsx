import React, { useState, useEffect } from 'react';
import login from '../../assets/GIRGAU.jpg';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const SignUp = () => {
  const { referralPhone } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user',
    role_id: 3,
    shop_name: '',
    pincode: '',
    referred_by: '',
    referred_name: '',
    agree: false,
  });

  useEffect(() => {
    if (referralPhone) {
      axios.get(`https://goudhan.com/admin/api/referral-user?phone=${referralPhone}`)
        .then(res => {
          setFormData(prev => ({
            ...prev,
            referred_by: referralPhone,
            referred_name: res.data.name || ''
          }));
        })
        .catch(() => {
          setFormData(prev => ({
            ...prev,
            referred_by: referralPhone,
            referred_name: 'Not Found'
          }));
        });
    }
  }, [referralPhone]);

  const handleChange = (e) => {
    const { id, value, type, checked, name } = e.target;
    let updatedForm = {
      ...formData,
      [id || name]: type === 'checkbox' ? checked : value
    };

    if ((id === 'role' || name === 'role') && value) {
      const roleMap = { user: 3, buyer: 1, seller: 2 };
      updatedForm.role_id = roleMap[value];
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async () => {
    if (!formData.agree) {
      Swal.fire({
        title: 'Agreement Required',
        text: 'You must agree to the privacy policy.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      Swal.fire({
        title: 'Password Mismatch',
        text: 'Password and Confirm Password do not match.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    try {
      const payload = {
        ...formData,
        mrp: 0,
        discount: 0,
        goudhan_discount: 0,
        referred_by: formData.referred_by || null,
      };

      const response = await axios.post('https://goudhan.com/admin/api/register', payload);
      const { token } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      Swal.fire({
        title: 'Success!',
        text: 'Registration completed successfully.',
        icon: 'success',
        confirmButtonText: 'Go to Login'
      }).then(() => {
        navigate('/login');
      });

    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      if (error.response?.data?.errors) {
        const messages = Object.values(error.response.data.errors).flat();
        errorMessage = messages.join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      Swal.fire({
        title: 'Error!',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <section className='login border-t-1 border-[#000] pt-18'>
      <div className='max-w-7xl mx-auto px-8'>
        <div className='grid grid-cols-1 xl:grid-cols-2 gap-10 items-center bg-[#FFFAF8]'>
          <div>
            <img src={login} alt="Login" />
          </div>

          <div className='pr-10'>
            <h2 className='text-[#292929] text-[42px] font-bold'>SignUp to your account</h2>
            <p className='text-[#292929] mt-4 mb-8'>
              Already have an account? <Link to="/Login" className='text-[#F48643] font-medium'>Login</Link>
            </p>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-700">Select Role</label>
              <div className="space-y-2">
                {['user', 'buyer', 'seller'].map(role => (
                  <label key={role} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300"
                    />
                    <span className="text-gray-700 capitalize">
                      {role === 'user' ? 'Business Associate' : role.charAt(0).toUpperCase() + role.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Basic Fields */}
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>
              <input id="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border-b p-2 w-full" />
              <input id="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} className="border-b p-2 w-full" />
              <input id="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border-b p-2 w-full xl:col-span-2" />

              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="border-b p-2 w-full pr-10"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="relative">
                <input
                  id="password_confirmation"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="border-b p-2 w-full pr-10"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            {/* Referral Section */}
            <div className="mt-4">
              <label htmlFor="referred_by" className="block text-sm font-medium text-gray-700">
                Referred By (Phone Number)
              </label>
              <input
                id="referred_by"
                placeholder="Enter 10-digit phone number"
                value={formData.referred_by || ''}
                onChange={(e) => {
                  handleChange(e);
                  const phone = e.target.value;
                  if (phone.length === 10) {
                    axios.get(`https://goudhan.com/admin/api/referral-user?phone=${phone}`)
                      .then(res => setFormData(prev => ({ ...prev, referred_name: res.data.name || 'Name Not Found' })))
                      .catch(() => setFormData(prev => ({ ...prev, referred_name: 'Name Not Found' })));
                  } else {
                    setFormData(prev => ({ ...prev, referred_name: '' }));
                  }
                }}
                className="mt-1 border border-gray-300 rounded-md p-2 w-full text-sm focus:ring-[#4D953E] focus:border-[#4D953E]"
              />
              {formData.referred_name && (
                <p className="text-sm text-green-600 mt-1">
                  Referred by: <strong>{formData.referred_name}</strong>
                </p>
              )}
            </div>

            {/* Seller-specific fields */}
            {formData.role === 'seller' && (
              <>
                <input
                  id="shop_name"
                  placeholder="Shop Name"
                  value={formData.shop_name}
                  onChange={handleChange}
                  className="border-b p-2 w-full mt-4"
                />
                <input
                  id="pincode"
                  placeholder="Pin Code"
                  value={formData.pincode}
                  onChange={handleChange}
                  className="border-b p-2 w-full mt-4"
                />
              </>
            )}

            {/* Privacy Policy Checkbox */}
            <div className="mt-4 flex items-center space-x-2">
              <input type="checkbox" id="agree" checked={formData.agree} onChange={handleChange} />
              <label htmlFor="agree" className="text-sm">I agree to the <Link to="#" className="underline">privacy policy</Link></label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className='bg-[#F48643] py-3 w-full text-white mt-6 hover:bg-[#4D953E] duration-200 hover:scale-95'
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
