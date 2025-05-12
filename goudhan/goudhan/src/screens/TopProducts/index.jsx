import React from 'react'
import goseva from '../../assets/goseva.png';
import ghee from '../../assets/ghee.png';
import triphala from '../../assets/triphala.png';
import cart from '../../assets/cart.svg';
import heart from '../../assets/heart.svg';

const TopProducts = () => {
  return (
    <>
    <section className='top-products py-12 '>
        <div className='max-w-7xl mx-auto px-8'>
            <h2 className='text-center text-[#292929] text-[42px] font-bold'>Top Selling Products</h2>
            <p className='text-center text-[#292929] mt-2'>Explore our top-selling products, curated to meet your needs and<br></br> deliver exceptional quality</p>
          
          <div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 gap-8 mt-16'>
            <div>
              <div className='relative'>
                <img src={heart} className='absolute right-3 top-2' alt=''/>
              </div>
            <div className='border-1 border-[#000] hover:border-[#F48643] duration-300 '>
              <img src={goseva} className="w-[94%] block m-auto" alt=''/>
            </div>
              <h4 className='text-[20px] text-center mt-3 font-medium '>A2 Whole Gir Cow Milk Powder(100g)</h4>
              <div className='border-1 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 border-[#E2E2E2] mt-4 '>
               <div><p className='text-center border-r border-[#E2E2E2] p-2 text-[18px]'>₹80.00</p></div>
               <div className='block m-auto'><img src={cart} alt='' title='Add to Cart' className='hover:scale-150 duration-200'/></div>
              </div>
            </div>
            <div>
            <div className='relative'>
                <img src={heart} className='absolute right-3 top-2' alt=''/>
              </div>
            <div className='border-1 border-[#000] hover:border-[#F48643] duration-300'><img src={ghee} className="w-[94%] block m-auto" alt=''/></div>
            <h4 className='text-[20px] text-center mt-3 font-medium '>Go Seva A2 Belona Gir Cow Ghee(500g)</h4>
            <div className='border-1 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 border-[#E2E2E2] mt-4'>
               <div><p className='text-center border-r border-[#E2E2E2] p-2 text-[18px]'>₹80.00</p></div>
               <div className='block m-auto'><img src={cart} alt='' title='Add to Cart' className='hover:scale-150 duration-200'/></div>
              </div>
            </div>
            <div>
            <div className='relative'>
                <img src={heart} className='absolute right-3 top-2' alt=''/>
              </div>
            <div className='border-1 border-[#000] hover:border-[#F48643] duration-300'><img src={triphala} className="w-[94%] block m-auto" alt=''/></div>
            <h4 className='text-[20px] text-center mt-3 font-medium '>Triphala Nasal Drop</h4>
            <div className='border-1 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 border-[#E2E2E2] mt-4'>
               <div><p className='text-center border-r border-[#E2E2E2] p-2 text-[18px]'>₹80.00</p></div>
               <div className='block m-auto'><img src={cart} alt='' title='Add to Cart' className='hover:scale-150 duration-200'/></div>
              </div>
            </div>
            <div>
            <div className='relative'>
                <img src={heart} className='absolute right-3 top-2' alt=''/>
              </div>
            <div className='border-1 border-[#000] hover:border-[#F48643] duration-300'>
              <img src={goseva} className="w-[94%] block m-auto" alt=''/>
            </div>
              <h4 className='text-[20px] text-center mt-3 font-medium '>A2 Whole Gir Cow Milk Powder(100g)</h4>
              <div className='border-1 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 border-[#E2E2E2] mt-4'>
               <div><p className='text-center border-r border-[#E2E2E2] p-2 text-[18px]'>₹80.00</p></div>
               <div className='block m-auto'><img src={cart} alt='' title='Add to Cart' className='hover:scale-150 duration-200'/></div>
              </div>
            </div>
            <div>
            <div className='relative'>
                <img src={heart} className='absolute right-3 top-2' alt=''/>
              </div>
            <div className='border-1 border-[#000] hover:border-[#F48643] duration-300'><img src={ghee} className="w-[94%] block m-auto" alt=''/></div>
            <h4 className='text-[20px] text-center mt-3 font-medium '>Go Seva A2 Belona Gir Cow Ghee(500g)</h4>
            <div className='border-1 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 border-[#E2E2E2] mt-4'>
               <div><p className='text-center border-r border-[#E2E2E2] p-2 text-[18px]'>₹80.00</p></div>
               <div className='block m-auto'><img src={cart} alt='' title='Add to Cart' className='hover:scale-150 duration-200'/></div>
              </div>
            </div>
            <div>
            <div className='relative'>
                <img src={heart} className='absolute right-3 top-2' alt=''/>
              </div>
            <div className='border-1 border-[#000] hover:border-[#F48643] duration-300'><img src={triphala} className="w-[94%] block m-auto" alt=''/></div>
            <h4 className='text-[20px] text-center mt-3 font-medium '>Triphala Nasal Drop</h4>
            <div className='border-1 grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 border-[#E2E2E2] mt-4'>
               <div><p className='text-center border-r border-[#E2E2E2] p-2 text-[18px]'>₹80.00</p></div>
               <div className='block m-auto'><img src={cart} alt='' title='Add to Cart' className='hover:scale-150 duration-200'/></div>
              </div>
            </div>
          </div>

        </div>
    </section>
    </>
  )
}

export default TopProducts;
