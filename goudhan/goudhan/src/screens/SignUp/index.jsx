import React, { useState } from 'react';
import login from '../../assets/login.png';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    email: '',
    address: '',
    password: '',
    password_confirmation: '',
    agree: false
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async () => {
    if (!formData.agree) {
      alert("You must agree to the privacy policy.");
      return;
    }
  
    try {
      const response = await axios.post('https://mitdevelop.com/goudhan/api/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        address: formData.address,
        phone_number: formData.phone_number,
        mrp: 0,
        discount: 0,
        goudhan_discount: 0
      });
  
      console.log("✅ Registration successful:", response.data);
      const { token } = response.data;
      localStorage.setItem('token', token);
  
      alert('Registration successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error("❌ Registration error:", error);
  
      // Laravel validation errors come under response.data.errors
      if (error.response) {
        console.error("📥 Response data:", error.response.data);
        console.error("📄 Status code:", error.response.status);
        console.error("📄 Headers:", error.response.headers);
  
        if (error.response.data?.errors) {
          const messages = Object.values(error.response.data.errors).flat();
          alert(messages.join('\n'));
        } else {
          alert('Registration failed: ' + (error.response.data?.message || 'Unknown error'));
        }
      } else if (error.request) {
        console.error("📡 No response received:", error.request);
        alert('No response from server. Please try again later.');
      } else {
        console.error("⚠️ Axios setup error:", error.message);
        alert('Request error: ' + error.message);
      }
    }
  };
  

  return (
    <>
      <section className='login border-t-1 border-[#000] pt-18'>
        <div className='max-w-7xl mx-auto px-8'>
          <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-10 items-center bg-[#FFFAF8]'>
            <div>
              <img src={login} alt="Login" />
            </div>
            <div className='pr-10'>
              <h2 className='text-[#292929] text-[42px] font-bold leading-[48px]'>SignUp to your account</h2>
              <p className='text-[#292929] mt-4 mb-8'>
                Already have an account? <Link to="/Login" className='text-[#F48643] font-medium'>Login</Link>
              </p>
              <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-5 items-center'>
                <div>
                  <input id="name" className="border-b border-[#000000] text-[#000000] block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none" placeholder="Name" type="text" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div>
                  <input id="phone_number" className="border-b border-[#000000] text-[#000000] block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none" placeholder="Phone Number" name="Number" type="number" value={formData.phone_number} onChange={handleChange} />
                </div>
                <div>
                  <input id="email" className="border-b border-[#000000] text-[#000000] block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none" placeholder="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                  <input id="address" className="border-b border-[#000000] text-[#000000] block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none" placeholder="Address" name="address" type="text" value={formData.address} onChange={handleChange} />
                </div>
                <div className=''>
                  <input id="password" className="border-b border-[#000000] text-[#000000] block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none" placeholder="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
                </div>
                <div className=''>
                  <input id="password_confirmation" className="border-b border-[#000000] text-[#000000] block w-full p-2.5 placeholder-[#000000] focus-visible:outline-none" placeholder="Confirm Password" type="password" value={formData.password_confirmation} onChange={handleChange} />
                </div>
                <div className="col-span-2 flex items-center space-x-2">
                  <input type="checkbox" id="agree" checked={formData.agree} onChange={handleChange} className="accent-blue-600 w-4 h-4" />
                  <label htmlFor="agree" className="text-[#000] text-sm">I agree to the <Link to="#" className='underline'>privacy policy</Link>*</label>
                </div>
              </div>
              <button onClick={handleSubmit} type="submit" className='bg-[#F48643] py-3 w-full text-white mt-6 hover:bg-[#4D953E] duration-200 hover:scale-95'>Sign Up</button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SignUp;
