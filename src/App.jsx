import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './screens/INC/Navbar';
import Footer from './screens/INC/Footer';
import Banner from './screens/Banner';
import TopProducts from './screens/TopProducts';
import Pictures from './screens/Pictures';
import OurPromises from './screens/OurPromises';
import OurStory from './screens/OurStory';
import VisitOur from './screens/VisitOur';
import LatestBlog from './screens/LatestBlog';
import Login from './screens/Login';
import Footerimage from './screens/Footerimage';
import SignUp from './screens/SignUp';
import Testimonial from './screens/Testimonial';
import MyDashboard from './screens/MyDashboard';
import ContactUs from './screens/ContactUs';
import OurProducts from './screens/OurProducts';
import ProductDetail from './screens/ProductDetail';
import Cart from './screens/Cart';
import AboutUs from './screens/AboutUs';
import Checkout from './screens/Checkout';
import PaymentSuccess from './screens/PaymentSuccess';
import Seller from './screens/Seller';
import GoPoint from './screens/GoPoint';

import { AuthProvider } from "./contexts/AuthContext"; // ✅ import AuthProvider

// Home page section
function Home() {
  return (
    <>
      <Banner />
      <TopProducts />
      {/* <Pictures/> */}
      {/* <VisitOur/> */}
      <OurStory />
      {/* <OurPromises/> */}
      {/* <LatestBlog/> */}
      <Testimonial />
      {/* <Footerimage/> */}
    </>
  );
}

// Main App
function App() {
  return (
    <AuthProvider> {/* ✅ Wrap everything inside AuthProvider */}
      <Router basename='/'>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/dashboard" element={<MyDashboard />} />
          <Route path="/ContactUs" element={<ContactUs />} />
          <Route path="/OurProducts" element={<OurProducts />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Checkout" element={<Checkout />} />
          <Route path="/Seller" element={<Seller />} />
          <Route path="/signup/:referralPhone?" element={<SignUp />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/go-points" element={<GoPoint />} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
