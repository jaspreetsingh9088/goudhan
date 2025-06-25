import React, { useState } from 'react';
import { useEffect } from 'react';

import login from '../../assets/GIRGAU.jpg';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2'; // Add this at the top
import { useParams } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';



const SignUp = () => {

  const { referralPhone } = useParams(); // get the referral number from URL

const [showPassword, setShowPassword] = useState(false);


useEffect(() => {
  if (referralPhone) {
    axios.get(`https://goudhan.life/admin/api/referral-user?phone=${referralPhone}`)
      .then((res) => {
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


  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'user', 
    role_id: '',
    shop_name: '', 
    pincode: '',
    // buyer_type: '', 
     agree: false
  });

const handleChange = (e) => {
  const { id, value, type, checked } = e.target;

  let updatedData = {
    ...formData,
    [id]: type === 'checkbox' ? checked : value
  };

  if (id === 'role') {
    const roleMap = {
      user: 3,   // Business Associate
      buyer: 1,
      seller: 2
    };
    updatedData.role_id = roleMap[value];
    console.log("Role changed:", value, "-> role_id:", roleMap[value]); // Debugging log
  }

  setFormData(updatedData);
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
      goudhan_discount: 0
    };

    const response = await axios.post('https://goudhan.life/admin/api/register', payload);
    console.log("Registration successful:", response.data);

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
    } else {
      errorMessage = error.message;
    }

    Swal.fire({
      title: 'Error!',
      text: errorMessage,
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }

  const payload = {
  ...formData,
  mrp: 0,
  discount: 0,
  goudhan_discount: 0,
  referred_by: formData.referred_by || null,
};



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

            {/* Role selection */}
           <div className="mb-6">
                <label htmlFor="role" className="block mb-2 text-sm font-medium text-gray-700">Select Role</label>
                <div className="relative">
                  <select
                    id="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="block w-full appearance-none border border-gray-300 rounded-xl bg-white px-4 py-2 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition duration-150"
                  >
                    <option value="user">Bussiness Associate</option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>


            {/* Common Fields */}
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-5'>
              <div><input id="name" placeholder="Name" value={formData.name} onChange={handleChange} className="border-b p-2 w-full" />
</div>
              <div><input id="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} className="border-b p-2 w-full" />
</div>
              <div className='col-span-3'><input id="email" placeholder="Email" value={formData.email} onChange={handleChange} className="border-b p-2 w-full" />
</div>
             <div className="relative mt-2">
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

<div className="relative mt-2">
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
      if (e.target.value.length === 10) {
        axios
          .get(`https://goudhan.life/admin/api/referral-user?phone=${e.target.value}`)
          .then((res) => {
            setFormData(prev => ({ ...prev, referred_name: res.data.name || 'Name Not Found' }));
          })
          .catch(() => {
            setFormData(prev => ({ ...prev, referred_name: 'Name Not Found' }));
          });
      } else {
        setFormData(prev => ({ ...prev, referred_name: '' }));
      }
    }}
    className="mt-1 border border-gray-300 rounded-md p-2 w-full text-sm focus:ring-[#4D953E] focus:border-[#4D953E]"
  />
  <p className="text-xs text-gray-500 mt-1">Optional – used for referral recognition.</p>

  {formData.referred_name && (
    <p className="text-sm text-green-600 mt-1">
      Referred by: <strong>{formData.referred_name}</strong>
    </p>
  )}
</div>

    {/* {formData.referred_name && (
      <p className="text-sm text-gray-600 mt-1">Referred by: <strong>{formData.referred_name}</strong></p>
    )} */}
            {/* Conditional Fields */}
            {formData.role === 'seller' && (
              <>
              <div className="mt-4">
                <input id="shop_name" placeholder="Shop Name" value={formData.shop_name} onChange={handleChange} className="border-b p-2 w-full" />
              </div>
              <div className="mt-4">
                <input id="pincode" placeholder="Pin Code" value={formData.pincode} onChange={handleChange} className="border-b p-2 w-full" />
              </div>
              </>
            )}

         {/* {formData.role === 'buyer' && (
  <>
    <div className="mt-4">
      <input
        id="buyer_type"
        placeholder="Buyer Type (e.g., wholesaler, retailer)"
        value={formData.buyer_type}
        onChange={handleChange}
        className="border-b p-2 w-full"
      />
    </div>

    
  </>
)} */}


            <div className="mt-4 flex items-center space-x-2">
              <input type="checkbox" id="agree" checked={formData.agree} onChange={handleChange} />
              <label htmlFor="agree" className="text-sm">I agree to the <Link to="#" className="underline">privacy policy</Link></label>
            </div>

            <button onClick={handleSubmit} className='bg-[#F48643] py-3 w-full text-white mt-6 hover:bg-[#4D953E] duration-200 hover:scale-95'>
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
