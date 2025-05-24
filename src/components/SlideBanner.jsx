import React from 'react';
import { Link } from 'react-router-dom';
import slider1 from '../assets/main_slider.mp4';
import slider2 from '../assets/slider2.mp4';
import slider3 from '../assets/slider3.jpg';
import slider4 from '../assets/slider4.jpg';

const SliderBanner = () => {
  const slides = [
    { 
      type: 'video', 
      src: slider1,
      title: 'Find Your Perfect Roommate',
      subtitle: 'Connect with compatible roommates in your area',
      cta: 'Browse Listings',
      link: '/browse',
      overlay: 'bg-gradient-to-br from-indigo-600/80 via-purple-600/70 to-blue-700/80'
    },
    { 
      type: 'video', 
      src: slider2,
      title: 'List Your Space',
      subtitle: 'Earn money by renting out your extra space',
      cta: 'Add Listing',
      link: '/add-listing',
      overlay: 'bg-gradient-to-br from-emerald-600/80 via-teal-600/70 to-green-700/80'
    },
    { 
      type: 'image', 
      src: slider3,
      title: 'Safe & Verified Profiles',
      subtitle: 'All users go through our verification process',
      cta: 'Sign Up',
      link: '/signup',
      overlay: 'bg-gradient-to-br from-amber-600/80 via-orange-600/70 to-red-600/80'
    },
    { 
      type: 'image', 
      src: slider4,
      title: 'Manage Your Listings',
      subtitle: 'Easily update or remove your posted listings',
      cta: 'My Listings',
      link: '/my-listings',
      overlay: 'bg-gradient-to-br from-rose-600/80 via-pink-600/70 to-purple-600/80'
    },
  ];

  return (
    <div className="w-full overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-r from-slate-900 to-slate-800">
      <div className="carousel w-full h-[400px] sm:h-[500px] lg:h-[600px]">
        {slides.map((slide, i) => (
          <div id={`slide${i}`} key={i} className="carousel-item relative w-full group">
            {/* Media Content */}
            {slide.type === 'video' ? (
              <video 
                autoPlay 
                muted 
                loop 
                playsInline
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              >
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <img 
                src={slide.src} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                alt={`slider-${i}`} 
              />
            )}
            
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Gradient Overlay with Content */}
            <div className={`absolute inset-0 ${slide.overlay}`}>
              <div className="flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-4xl mx-auto">
                  {/* Content Container with better mobile spacing */}
                  <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                    <h2 className="text-2xl sm:text-4xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight animate-fadeIn drop-shadow-2xl">
                      {slide.title}
                    </h2>
                    <p className="text-sm sm:text-lg lg:text-xl xl:text-2xl text-white/90 animate-fadeIn delay-100 drop-shadow-lg max-w-2xl mx-auto">
                      {slide.subtitle}
                    </p>
                    <div className="animate-fadeIn delay-200 pt-2 sm:pt-4">
                      <Link 
                        to={slide.link}
                        className="inline-flex items-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white text-gray-900 font-semibold text-sm sm:text-base lg:text-lg rounded-full hover:bg-gray-100 transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 shadow-2xl hover:shadow-3xl backdrop-blur-sm"
                      >
                        {slide.cta}
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Arrows - Improved positioning for mobile */}
            <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-2 sm:px-4 lg:px-6 pointer-events-none">
              <a 
                href={`#slide${(i + slides.length - 1) % slides.length}`} 
                className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </a>
              <a 
                href={`#slide${(i + 1) % slides.length}`} 
                className="pointer-events-auto w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110 shadow-lg"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Indicators - Better mobile positioning */}
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-2 sm:gap-3">
                {slides.map((_, index) => (
                  <a 
                    key={index}
                    href={`#slide${index}`}
                    className={`block w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                      i === index 
                        ? 'bg-white scale-125 shadow-lg' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  ></a>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderBanner;