import React, { useState, useEffect } from 'react';
import axios from 'axios';
import dot from '../../assets/dot.svg';
import gau from '../../assets/gau.png';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('https://mitdevelop.com/goudhan/admin/api/getBanner');
        if (response.data && response.data.banners) {
            console.log('Banner Images:', response.data.banners.map(b => b.image)); 
          setBanners(response.data.banners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    };

    fetchBanners();
  }, []);

  // Autoplay effect
  useEffect(() => {
    if (isAutoplay && banners.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isAutoplay, banners.length]);

  const handleManualChange = (index) => {
    setIsAutoplay(false);
    setCurrentIndex(index);
  };

  return (
    <section className="bg-[#FEF9F5] py-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 relative">
        {banners.length > 0 ? (
          <>
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {banners.map((banner) => (
                  
                  <div key={banner.id} className="min-w-full flex items-center">
                    <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 items-center w-full">
                      {/* Left content */}
                      <div>
                        <h1 className="text-[52px] text-[#292929] font-extrabold leading-[68px]">
                          {banner.title?.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </h1>
                        <p className="text-[18px] mt-3">
                          {banner.description?.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </p>

                        <div className="flex gap-6 mt-3 flex-wrap">
                          {['Handwash', 'Vermicompost', 'Dhupbati'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <img src={dot} alt="" />
                              <p>{item}</p>
                            </div>
                          ))}
                        </div>
                        <a
                        href={banner.button_link}
                        className="inline-block bg-[#F48643] px-6 py-3 mt-8 text-white rounded-full text-center w-[30%]"
                      >
                        {banner.button_text} Read More
                      </a>
                      </div>

                      {/* Right image */}
                    <div className="relative">
                      <img
                        src={banner.image ? `https://mitdevelop.com//goudhan/admin/storage/app/public/banners/${banner.image}` : gau}
                        alt={banner.title}
                        className="w-full mx-auto"
                        onError={(e) => { e.target.src = gau; }}
                      />
                    </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {banners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleManualChange(idx)}
                  className={`w-4 h-4 rounded-full ${currentIndex === idx ? 'bg-[#F48643]' : 'bg-gray-300'}`}
                ></button>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Loading banners...</p>
        )}
      </div>
    </section>
  );
};

export default Banner;
