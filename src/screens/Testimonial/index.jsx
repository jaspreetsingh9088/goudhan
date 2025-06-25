import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import client from '../../assets/client.png';
import star from '../../assets/star.svg';

const reviews = [
  {
    name: 'Debashish Bhuyan',
    date: '2 days ago',
    rating: 5,
    message: 'High-quality cow product, easy to use, improves health, great value—highly recommended!',
  },
  {
    name: 'Anita Sharma',
    date: '1 week ago',
    rating: 4,
    message: 'Good results. My cows are more active now. Will purchase again.',
  },
  {
    name: 'Ravi Kumar',
    date: '3 days ago',
    rating: 5,
    message: 'Top-notch quality and fast delivery. Very satisfied with this product.',
  },
  {
    name: 'Sunita Patel',
    date: '5 days ago',
    rating: 4,
    message: 'Nice product and packaging. Saw improvement in milk production.',
  },
];

const Testimonial = () => {
  return (
    <section className='customer-review bg-[#fff7f2] py-15 pb-18'>
      <div className='max-w-7xl mx-auto px-8'>
        <h2 className='text-[#292929] text-[42px] font-bold leading-[48px] text-center'>
          Customer Review
        </h2>
        <p className='text-[#292929] mt-4 text-center'>
          Customer support was responsive and helpful at every step.
          The overall experience <br /> exceeded my expectations
        </p>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          navigation={false}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 2,
            },
          }}
          className='mt-10'
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className='bg-white p-6 h-full shadow-lg'>
                <div className='grid grid-cols-1 xl:grid-cols-4 gap-5'>
                  <div>
                    <img src={client} alt='client' className='w-[143px] block m-auto' />
                  </div>
                  <div className='col-span-3'>
                    <h4 className='text-[20px] font-medium'>{review.name}</h4>
                    <p className='text-[#9c9c9c]'>{review.date}</p>
                    <div className='flex gap-2 my-3'>
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <img key={i} src={star} alt='star' />
                      ))}
                    </div>
                    <p>{review.message}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonial;
