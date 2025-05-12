import React from 'react'
import ourstosry from '../../assets/ourstosry.png';
import milk from '../../assets/milk.png';

const OurStory = () => {
  return (
    <>
    <section className='our-story'>
        <div className='max-w-7xl mx-auto px-8'>
            <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-8 items-center'>
            <div>
             <img src={ourstosry} className='w-[82%]' alt=''/>
            </div>
            <div>
            <p className='text-[#F48643] text-[18px] mb-3'>Our Story</p>
            <h2 className=' text-[#292929] text-[42px] font-bold leading-[48px]'>We are like minded group of people</h2>
            <p className=' text-[#292929] mt-4'>Committed to bring total prosperity, love and peace in the society by <br></br>the art of serving and spreading awareness.</p>
            <button className='w-[30%] bg-[#F48643] p-3 mt-8 text-white rounded-[100px]'>Read More</button>
            </div>
            </div>
            <div className='relative'>
          <img src={milk} alt='' className='w-[18%] absolute right-0 -bottom-21' />
        </div>
        </div>
        
    </section>
    </>
  )
}

export default OurStory;
