import React from 'react'

import goudhanlogo from '../../assets/goudhanlogo.svg';
import Contact from '../../assets/Contact.svg';
import facebook from '../../assets/facebook.svg';
import insta from '../../assets/insta.svg';
import linkedin from '../../assets/linkedin.svg';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
    
    <section className='Footer'>
    <div className='max-w-7xl mx-auto px-8 '>
     
<div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-4 gap-8 py-8'>
    <div >
     <img src={goudhanlogo} alt='' className='mb-4' />
     <p className='mb-4'>We serve with love to uplift society through peace, prosperity, and awareness.</p>
     <div className='flex gap-3 items-center'>
        {/* <div> <img src={Contact} alt='' /></div>
        <div>
            <h3 className='font-medium text-[20px]'>Customer Support</h3>
        <p>+0123 456 789</p>
        </div> */}
     </div>
    </div>
    <div className='block mx-auto'>
     <h3 className='font-medium text-[20px] pb-3'>Products</h3>
     <Link to="/" className='hover:text-[#F48643] duration-150'><p className='pb-2'>Anti Radiation Chip</p></Link>
     <Link to="/" className='hover:text-[#F48643] duration-150'><p className='pb-2'>Gir Cow Milk Powder</p></Link>
     <Link to="/" className='hover:text-[#F48643] duration-150'><p>Gir Cow Ghee</p></Link>
    </div>
    <div className='block mx-auto'>
     <h3 className='font-medium text-[20px] pb-3'>Information</h3>
     <Link to="/" className='hover:text-[#F48643] duration-150'><p className='pb-2'>About Goudhan</p></Link>
     <Link to="/" className='hover:text-[#F48643] duration-150'><p>Contact us</p></Link>
    </div>
    <div className='block mx-auto'>
     <h3 className='font-medium text-[20px] pb-3'>Customer Service</h3>
     <Link to="/" className='hover:text-[#F48643] duration-150'><p className='pb-2'>Returns</p></Link>
     <Link to="/" className='hover:text-[#F48643] duration-150'><p className='pb-2'>Shipping</p></Link>
     <Link to="/" className='hover:text-[#F48643] duration-150'><p className='pb-2'>Terms and conditions</p></Link>
     <Link to="/" className='hover:text-[#F48643] duration-150'><p>Privacy Policy</p></Link>
    </div>
</div>
    </div>
    <div className='bg-[#4D953E] py-2 mt-12 text-white'>
    <div className='max-w-7xl mx-auto px-8 '>
    <div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 gap-8'>
    <div className='col-span-2'><p>Copyright © 2025 goudhan.com. All Rights Reserved.</p></div>
    <div className='flex gap-3 justify-end'>
       <div><img src={facebook} alt='' /></div>
       <div><img src={insta} alt='' /></div>
       <div><img src={linkedin} alt='' /></div>
    </div>
    </div>
    </div>
    </div>
    </section>
    </>
  )
}

export default Footer
