import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import dot from '../../assets/dot.svg';
import gau from '../../assets/gau.png';

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get('https://goudhan.life/admin/api/getBanner');
        if (response.data && response.data.banners) {
          setBanners(response.data.banners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
        setError('Failed to load banners. Please try again later.');
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

  // Resume autoplay after manual interaction
  useEffect(() => {
    if (!isAutoplay) {
      const timeout = setTimeout(() => setIsAutoplay(true), 10000);
      return () => clearTimeout(timeout);
    }
  }, [isAutoplay]);

  const handleManualChange = (index) => {
    setIsAutoplay(false);
    setCurrentIndex(index);
  };

  const renderBanner = useCallback((banner) => (
    <div key={banner.id} className="min-w-full flex items-center">
      <div className="grid grid-cols-1 xl:grid-cols-2 lg:grid-cols-2 items-center w-full">
        {/* Left content */}
        <div>
          <h1 className="text-[52px] text-[#292929] font-extrabold leading-[68px]">
            {banner.title?.split('\n').map((line, i) => (
              <div key={`${banner.id}-title-${i}`}>{line}</div>
            ))}
          </h1>
          <p className="text-[18px] mt-3">
            {banner.description?.split('\n').map((line, i) => (
              <div key={`${banner.id}-desc-${i}`}>{line}</div>
            ))}
          </p>

          <div className="flex gap-6 mt-3 flex-wrap">
            {(banner.items || ['Handwash', 'Vermicompost', 'Dhupbati']).map((item) => (
              <div key={item} className="flex items-center gap-2">
                <img src={dot} alt="" />
                <p>{item}</p>
              </div>
            ))}
          </div>
          <a
            href={banner.button_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-[#F48643] px-6 py-3 mt-8 text-white rounded-full text-center w-[30%]"
          >
            {banner.button_text}
          </a>
        </div>

        {/* Right image */}
        <div className="relative">
          <img
            src={banner.image || gau}
            alt={banner.title}
            className="w-full mx-auto"
            onError={(e) => { e.target.src = gau; }}
          />
        </div>
      </div>
    </div>
  ), []);

 
  return (
  <section className="py-4 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 sm:px-10 relative">
      {banners.length > 0 ? (
        <>
          {/* Slider container */}
          <div className="overflow-hidden rounded-2xl shadow-md">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {banners.map((banner) => (
                <div key={banner.id} className="min-w-full flex items-center">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center w-full p-6 lg:p-12 bg-white rounded-2xl">
                    {/* Left content */}
                    <div className="text-center lg:text-left">
                      <h2 className="text-4xl md:text-5xl font-extrabold leading-tight text-[#292929]">
                        {banner.title?.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </h2>
                      <p className="text-base md:text-lg text-[#555] mt-4 leading-relaxed">
                        {banner.description?.split('\n').map((line, i) => (
                          <div key={i}>{line}</div>
                        ))}
                      </p>

                      {/* <div className="flex flex-wrap justify-center lg:justify-start gap-4 mt-5">
                        {['Handwash', 'Vermicompost', 'Dhupbati'].map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-[#292929]">
                            <img src={dot} alt="" className="w-2.5 h-2.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div> */}

                      <a
                        href={banner.link}
                        className="inline-block bg-[#F48643] hover:bg-[#d96c2c] transition duration-300 px-8 py-3 mt-6 text-white rounded-full text-sm font-semibold shadow-md"
                      >
                        {banner.button_text || 'Explore'} &nbsp;→
                      </a>
                    </div>

                    {/* Right image */}
                    <div className="flex justify-center">
                      <img
                        src={banner.image || gau}
                        alt={banner.title}
                        className="max-h-[380px] object-contain rounded-xl shadow-lg"
                        onError={(e) => {
                          e.target.src = gau;
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleManualChange(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? 'bg-[#F48643] scale-125 shadow-md'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
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