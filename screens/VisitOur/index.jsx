import React from 'react'
import phoneone from '../../assets/phoneone.svg';
import emailtwo from '../../assets/emailtwo.svg';
import watch from '../../assets/watch.svg';

const VisitOur = () => {
  return (
    <>
    <section className='Visit bg-[#F2F7F1] py-16 my-20'>
    <div className='max-w-7xl mx-auto px-8'>
    <p className='text-[#4D953E] text-[18px] mb-3 text-center'>visit us anytime</p>
    <h2 className=' text-[#292929] text-[42px] font-bold leading-[48px] text-center'>Why are our dairy products so delicious? <br></br>Discover the secret!</h2>
    <div className='grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 gap-8 items-center mt-16'>
        <div className='text-center bg-[#4d953e] p-8'>
            <img src={phoneone} alt='' className='block m-auto mb-3 bg-[#fff] p-3 rounded-full w-[20%]'/>
            <h3 className='font-medium text-[20px] text-white'>Phone :</h3>
            <p className='text-white'>+0123 456 789</p>
        </div>
        <div className='text-center bg-[#4d953e] p-8'>
            <img src={emailtwo} alt='' className='block m-auto mb-3 bg-[#fff] p-3 rounded-full w-[20%]'/>
            <h3 className='font-medium text-[20px] text-white'>Email :</h3>
            <p className='text-white'>support@goudhan.com</p>
        </div>
        <div className='text-center bg-[#4d953e] p-8'>
            <img src={watch} alt='' className='block m-auto mb-3 bg-[#fff] p-3 rounded-full w-[20%]'/>
            <h3 className='font-medium text-[20px] text-white'>Working Hours :</h3>
            <p className='text-white'>9AM To 9PM</p>
        </div>
    </div>
    </div>
    </section>
    </>
  )
}

export default VisitOur;