import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import axios from 'axios';
import contactImage from '../../assets/contacUs.jpg'; 
const ContactUs = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get('https://mitdevelop.com/goudhan/admin/api/settings');
        if (response.data.success) {
          setSettings(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required.');
      return;
    }

    setError('');
    try {
      // Example POST request: await axios.post('/api/contact', formData);
      setSuccessMessage('Your message has been sent successfully!');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setError('There was an error sending your message. Please try again later.');
    }
  };

  return (
    <>
    <div class="py-8 bg-[#4d953e1f] mb-12 border-b-8 border-[#4D953E]"><h1 class="text-[52px] text-center font-bold text-[#292929]">Contact Us</h1><nav class="text-center"><ol class="inline-flex items-center space-x-2 text-[#4D953E] font-medium text-lg"><li><a href="/" class="hover:underline">Home</a></li><li><span>/</span></li><li><span class="text-[#292929]">Contact Us</span></li></ol></nav></div>
   
    <div className="max-w-screen-xl mx-auto px-8 py-10">
     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left section with image and contact info */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <img
            src={contactImage} // Replace with your actual image path
            alt="Contact"
            className="w-full h-64 object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-medium mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-4">
            Feel free to reach out to us. We would love to hear from you!
          </p>

          {settings && (
            <div className="text-gray-700">
              <div className="flex items-center mb-4">
                <FaPhoneAlt className="text-green-500 mr-2" />
                <p>{settings.phone_number}</p>
              </div>
              <div className="flex items-center mb-4">
                <FaEnvelope className="text-green-500 mr-2" />
                <p>{settings.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right section with contact form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-medium mb-4">Contact Form</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Your full name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Your email address"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="message" className="block text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="4"
                placeholder="Your message"
              />
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}
            {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition duration-200"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
     </>
  );
};

export default ContactUs;
