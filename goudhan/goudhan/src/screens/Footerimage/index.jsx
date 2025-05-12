import React from 'react'
import imagefooter from '../../assets/imagefooter.png';
const Footerimage = () => {
  return (
    <div>
      <section className='bg h-[308px]  bg-no-repeat bg-cover' style={{ backgroundImage: `url(${imagefooter})` }}>
      </section>
    </div>
  )
}

export default Footerimage
