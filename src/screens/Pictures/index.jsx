import React from 'react'
import gauone from '../../assets/gauone.png';
import gautwo from '../../assets/gautwo.png';
const Pictures = () => {
  return (
    <>
      <section className='picture-o py-16 pt-12'>
      <div className='max-w-7xl mx-auto px-8 '>
      <div className='grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 gap-8'>
         <div><img src={gauone} className='w-full' alt=''/> </div>
         <div><img src={gautwo} className='w-full' alt=''/> </div>
      </div>
      </div>
      </section>
    </>
  )
}

export default Pictures;
