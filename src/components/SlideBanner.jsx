import React from 'react';
import slider1 from '../assets/main_slider.mp4';
import slider2 from '../assets/slider2.mp4';
import slider3 from '../assets/slider3.jpg';
import slider4 from '../assets/slider4.jpg';

const SliderBanner = () => {
  const slides = [
    { type: 'video', src: slider1 },
    { type: 'video', src: slider2 },
    { type: 'image', src: slider3 },
    { type: 'image', src: slider4 },
  ];

  return (
    <div className="w-full overflow-hidden rounded shadow-md">
      <div className="carousel w-full">
        {slides.map((slide, i) => (
          <div id={`slide${i}`} key={i} className="carousel-item relative w-full">
            {slide.type === 'video' ? (
              <video autoPlay muted loop className="w-full h-[400px] object-cover">
                <source src={slide.src} type="video/mp4" />
              </video>
            ) : (
              <img src={slide.src} className="w-full h-[400px] object-cover" alt={`slider-${i}`} />
            )}
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href={`#slide${(i + slides.length - 1) % slides.length}`} className="btn btn-circle">❮</a>
              <a href={`#slide${(i + 1) % slides.length}`} className="btn btn-circle">❯</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderBanner;
