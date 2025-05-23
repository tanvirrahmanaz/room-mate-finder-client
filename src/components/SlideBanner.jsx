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
      overlay: 'bg-gradient-to-r from-indigo-500/30 to-purple-500/30'
    },
    { 
      type: 'video', 
      src: slider2,
      title: 'List Your Space',
      subtitle: 'Earn money by renting out your extra space',
      cta: 'Add Listing',
      link: '/add-listing',
      overlay: 'bg-gradient-to-r from-emerald-500/30 to-teal-500/30'
    },
    { 
      type: 'image', 
      src: slider3,
      title: 'Safe & Verified Profiles',
      subtitle: 'All users go through our verification process',
      cta: 'Sign Up',
      link: '/signup',
      overlay: 'bg-gradient-to-r from-amber-500/30 to-orange-500/30'
    },
    { 
      type: 'image', 
      src: slider4,
      title: 'Manage Your Listings',
      subtitle: 'Easily update or remove your posted listings',
      cta: 'My Listings',
      link: '/my-listings',
      overlay: 'bg-gradient-to-r from-rose-500/30 to-pink-500/30'
    },
  ];

  return (
    <div className="w-full overflow-hidden rounded-lg shadow-xl">
      <div className="carousel w-full h-[500px] md:h-[600px]">
        {slides.map((slide, i) => (
          <div id={`slide${i}`} key={i} className="carousel-item relative w-full">
            {/* Media Content */}
            {slide.type === 'video' ? (
              <video autoPlay muted loop className="w-full h-full object-cover">
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <img 
                src={slide.src} 
                className="w-full h-full object-cover" 
                alt={`slider-${i}`} 
              />
            )}
            
            {/* Overlay with Content */}
            <div className={`absolute inset-0 ${slide.overlay} flex items-center`}>
              <div className="container mx-auto px-6 text-white">
                <div className="max-w-xl">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fadeIn">
                    {slide.title}
                  </h2>
                  <p className="text-xl mb-8 animate-fadeIn delay-100">
                    {slide.subtitle}
                  </p>
                  <Link 
                    to={slide.link}
                    className="btn btn-primary btn-lg animate-fadeIn delay-200 hover:scale-105 transition-transform"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a 
                href={`#slide${(i + slides.length - 1) % slides.length}`} 
                className="btn btn-circle btn-outline btn-sm md:btn-md glass hover:bg-white/20"
              >
                ❮
              </a>
              <a 
                href={`#slide${(i + 1) % slides.length}`} 
                className="btn btn-circle btn-outline btn-sm md:btn-md glass hover:bg-white/20"
              >
                ❯
              </a>
            </div>

            {/* Indicators */}
            <div className="absolute flex justify-center w-full bottom-4 gap-2">
              {slides.map((_, index) => (
                <a 
                  key={index}
                  href={`#slide${index}`}
                  className={`w-3 h-3 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`}
                ></a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderBanner;