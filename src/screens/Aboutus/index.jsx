import React from 'react'

import mission from '../../assets/mission.png';
import milk from '../../assets/milk.png';
import value from '../../assets/value.png';
import panchagavya from '../../assets/panchagavya.png';

const AboutUs = () => {
  return (
    <div>
      <section className="bg-[#9d9d9d1f] py-10">
         <div className='max-w-7xl mx-auto px-8'>
        <h1 className="text-[52px] text-center font-bold text-[#292929] ">About Us</h1>
        <nav className="text-center">
          <ol className="inline-flex items-center space-x-2 text-[#4D953E] font-medium text-lg">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><span>/</span></li>
            <li><span className="text-[#292929]">About Us</span></li>
          </ol>
        </nav>
        </div>
      </section>
      <div className='whoweare py-12 mb-18'>
        <div className='max-w-7xl mx-auto px-8'>
           <h2 className='text-[48px] font-bold text-center pb-3 text-[#292929]'>Who We Are</h2>
           <p className='text-[18px] text-center'>We are like minded group of people committed to bring total prosperity, love and peace in the society by the art of serving and spreading awareness. We all are highly educated and well placed in society by the grace of almighty but always have the eagerness to bring full proof systems for the people that brings financial independence and social harmony in life.</p>
         <img src={panchagavya} className='mt-12' alt=''/>
        </div>
        </div>
      <section className='mission mb-18'>
        <div className='max-w-7xl mx-auto px-8'>
          <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-8 items-center'>
            <div>
              <img src={mission} alt='' className='w-[96%]'/>
            </div>
            
              <div>
                <p class="text-[#F48643] text-[18px] mb-3">Our Mission</p>
                <h2 class=" text-[#292929] text-[42px] font-bold leading-[48px]">Our Mission is to create a platform | framework</h2>
                <p class=" text-[#292929] mt-4"> That facilitates and promotes product and services based on cow and related allied technologies. The platform will generate huge revenues by collaboration of people, business and technology.
Our single and, focused mission is to always engage our self to commercialise all cow based product and services so that cows are not treated as burden or overload rather as blessings that brings prosperity and happiness to each individuals.</p>
                </div>
          </div>
        <div className='relative'>
                  <img src={milk} alt='' className='w-[18%] absolute right-0 -bottom-18 -z-10' />
                </div>
        </div>
      </section>
      
        
       <section className="bg-[#f486430d] py-12">
         <div className='max-w-7xl mx-auto px-8'>
        <div className='grid grid-cols-1 xl:grid-cols-4 lg:grid-cols-4 justify-between gap-2.5 items-center text-center'>
          <div>
            
            <h3 className='text-[48px] font-bold text-[#f48643]'>41k+</h3>
            <p className='text-[18px]'>Happy Customer</p>
          </div>
          <div>
             <h3 className='text-[48px] font-bold text-[#f48643]'>20+</h3>
            <p className='text-[18px]'>Years in Business</p>
          </div>
          <div>
             <h3 className='text-[48px] font-bold text-[#f48643]'>97%</h3>
            <p className='text-[18px]'>Return Clients</p>
          </div>
          <div>
             <h3 className='text-[48px] font-bold text-[#f48643]'>15</h3>
            <p className='text-[18px]'>Awards Won</p>
          </div>

        </div>
        </div>
      </section>
        <section className='Vision mb-18 mt-18'>
        <div className='max-w-7xl mx-auto px-8'>
          <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-8 items-center'>
          
            
              <div>
                <p class="text-[#F48643] text-[18px] mb-3">Our Vision</p>
                <h2 class=" text-[#292929] text-[42px] font-bold leading-[48px]">Our vision is to bring back </h2>
                <p class=" text-[#292929] mt-4">The prosperity and harmony of ancient saint age in the society by the end of our life time while leading an ideal family life, power of collaboration and healthy relationship in the society.</p>
                </div>
                  <div>
              <img src={value} alt='' className='w-[96%]'/>
            </div>
          </div>
       
        </div>
      </section>
    </div>
  )
}

export default AboutUs;
