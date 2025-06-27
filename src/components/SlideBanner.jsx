import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { ArrowLeft, ArrowRight, MoveRight } from 'lucide-react';

// Swiper CSS
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// আপনার মিডিয়া ফাইলগুলো
import slider1Video from '../assets/main_slider.mp4';
import slider2Video from '../assets/slider2.mp4';
import slider3Image from '../assets/slider3.jpg';
import slider4Image from '../assets/slider4.jpg';

const brandOverlay = 'from-primary/70 via-secondary/60 to-primary/70';

const slides = [
  {
    type: 'video',
    src: slider1Video,
    title: 'Find Your Perfect Roommate',
    subtitle: 'Connect with thousands of verified users and find your ideal living space today.',
    cta: 'Browse Listings',
    link: '/browse',
    overlay: brandOverlay,
  },
  {
    type: 'video',
    src: slider2Video,
    title: 'List Your Extra Space',
    subtitle: 'Earn a steady income by renting out your spare room to a compatible roommate.',
    cta: 'Add Your Listing',
    link: '/add-listing',
    overlay: brandOverlay,
  },
  {
    type: 'image',
    src: slider3Image,
    title: 'Safety and Trust Guaranteed',
    subtitle: 'We prioritize your safety with a thorough verification process for all users.',
    cta: 'Learn More',
    link: '/about',
    overlay: brandOverlay,
  },
  {
    type: 'image',
    src: slider4Image,
    title: 'Manage Your Listings',
    subtitle: 'Easily update, pause, or remove your listings from your personal dashboard.',
    cta: 'Go to Dashboard',
    link: '/my-listings',
    overlay: brandOverlay,
  },
];

const SliderBanner = () => {
  return (
    // CHANGE: Adjusted height for mobile view
    <div className="relative w-full h-[65vh] sm:h-[70vh] max-h-[650px] bg-base-300  overflow-hidden shadow-lg">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        effect={'fade'}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (index, className) => `<span class="${className} bg-white/80 w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300"></span>`,
        }}
        navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
        }}
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        className="w-full h-full"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i} className="relative w-full h-full">
            {slide.type === 'video' ? (
              <video autoPlay muted loop playsInline className="w-full h-full object-cover" src={slide.src} />
            ) : (
              <img src={slide.src} className="w-full h-full object-cover" alt={slide.title} />
            )}
            
            {/* CHANGE: Darker overlay for better readability on mobile */}
            <div className="absolute inset-0 bg-black/50"></div>
            <div className={`absolute inset-0 bg-gradient-to-tr ${slide.overlay} opacity-80`}></div>

            {/* CHANGE: Responsive text, padding and spacing */}
            <div className="absolute inset-0 flex items-center justify-center text-center text-white p-6 sm:p-8">
              <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-base sm:text-lg text-white/90 max-w-2xl mx-auto drop-shadow-md">
                  {slide.subtitle}
                </p>
                <div>
                  <Link to={slide.link} className="btn btn-primary btn-md sm:btn-lg text-primary-content rounded-full shadow-lg transform hover:scale-105 group">
                    {slide.cta}
                    <MoveRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Custom Navigation Arrows */}
      <div className="swiper-button-prev-custom absolute top-1/2 left-3 sm:left-4 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-all duration-300 hover:scale-110">
        <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <div className="swiper-button-next-custom absolute top-1/2 right-3 sm:right-4 -translate-y-1/2 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-all duration-300 hover:scale-110">
        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
    </div>
  );
};

export default SliderBanner;