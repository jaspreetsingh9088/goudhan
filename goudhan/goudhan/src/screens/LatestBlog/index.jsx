import React from 'react'
import gaushala from '../../assets/gaushala.png';
import gaushalaone from '../../assets/gaushalaone.png';
import gaushalatwo from '../../assets/gaushalatwo.png';

const LatestBlog = () => {
  return (
    <>
    <section className='Latest-Blog mb-20'>
    <div className='max-w-7xl mx-auto px-8'>
    <h2 className=' text-[#292929] text-[42px] font-bold leading-[48px] text-center'>Latest Blog</h2>
    <p className=' text-[#292929] mt-4 text-center'>Discover insights, tips, and the latest updates in <br></br>our newest blog posts</p>
        <div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 gap-8 items-center mt-18'>
            <div>
          <div className='border-1 border-[#292929] p-4 hover:bg-[#fff9f5] duration-200'>
            <img src={gaushala} alt=''/>
            <div className='flex gap-2 justify-center mt-3'>
                <div className='bg-[#DFECDC] w-[50%] text-center p-1'>Admin : Rihaan</div>
                <div className='bg-[#FDEBDF] w-[50%] text-center p-1'>Date: 21/03/2025</div>
            </div>
                <h3 className='font-semibold text-[20px] text-[#292929] leading-6.5 mt-3'>Successfully passed an organic production standards audit</h3>
          </div>
          <button className='border-1 border-t-0 border-[#292929] w-full p-2 text-[18px] hover:bg-[#F48643] duration-200 hover:text-white '>Read More</button>
          </div>
            <div>
          <div className='border-1 border-[#292929] p-4 hover:bg-[#fff9f5] duration-200'>
            <img src={gaushalaone} alt=''/>
            <div className='flex gap-2 justify-center mt-3'>
                <div className='bg-[#DFECDC] w-[50%] text-center p-1'>Admin : Rihaan</div>
                <div className='bg-[#FDEBDF] w-[50%] text-center p-1'>Date: 21/03/2025</div>
            </div>
                <h3 className='font-semibold text-[20px] text-[#292929] leading-6.5 mt-3'>Successfully passed an organic production standards audit</h3>
          </div>
          <button className='border-1 border-t-0 border-[#292929] w-full p-2 text-[18px] hover:bg-[#F48643] duration-200 hover:text-white '>Read More</button>
          </div>
            <div>
          <div className='border-1 border-[#292929] p-4 hover:bg-[#fff9f5] duration-200'>
            <img src={gaushalatwo} alt=''/>
            <div className='flex gap-2 justify-center mt-3'>
                <div className='bg-[#DFECDC] w-[50%] text-center p-1'>Admin : Rihaan</div>
                <div className='bg-[#FDEBDF] w-[50%] text-center p-1'>Date: 21/03/2025</div>
            </div>
                <h3 className='font-semibold text-[20px] text-[#292929] leading-6.5 mt-3'>Successfully passed an organic production standards audit</h3>
          </div>
          <button className='border-1 border-t-0 border-[#292929] w-full p-2 text-[18px] hover:bg-[#F48643] duration-200 hover:text-white '>Read More</button>
          </div>
          
        </div>
    </div>
   
    </section>
    </>
  )
}

export default LatestBlog;
