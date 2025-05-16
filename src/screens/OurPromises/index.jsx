import React from 'react'
import freeshiping from '../../assets/freeshiping.svg';
import freereturn from '../../assets/freereturn.svg';
import info from '../../assets/info.svg';
import support from '../../assets/support.svg';
const OurPromises = () => {
  return (
    <>
      <section className='our-promises py-8 border-b-2 border-[#f4864359]'>
        <div className='max-w-7xl mx-auto px-8 '>
              <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-4 gap-8'>
                 <div className='flex gap-2 items-center'>
                  <div><img src={freeshiping} alt=''/></div>
                  <div><h3 className='font-medium text-[20px]'>Free Shipping</h3>
                   <p>orders ₹500 or more</p>
                  </div>
                 </div>
                 <div className='flex gap-2 items-center'>
                  <div><img src={freereturn} alt=''/></div>
                  <div><h3 className='font-medium text-[20px]'>Free Return</h3>
                   <p>within 30 days</p>
                  </div>
                 </div>
                 <div className='flex gap-2 items-center'>
                  <div><img src={info} alt=''/></div>
                  <div><h3 className='font-medium text-[20px]'>Get 20% Off 1 Item</h3>
                   <p>When you sign up</p>
                  </div>
                 </div>
                 <div className='flex gap-2 items-center'>
                  <div><img src={support} alt=''/></div>
                  <div><h3 className='font-medium text-[20px]'>We Support</h3>
                   <p>24/7 amazing services</p>
                  </div>
                 </div>
                
              </div>
              </div>
      </section>
    </>
  )
}

export default OurPromises;
