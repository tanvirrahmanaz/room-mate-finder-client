import React from 'react';
import SliderBanner from '../components/SlideBanner';
import FeaturedRoommates from '../components/FeaturedRoommates';
import WhyChooseUs from '../components/WhyChooseUs';
import TestimonialSection from '../components/TestimonialSection';
const Home = () => {
  return (
    <div className='pt-16'>
      <SliderBanner />
      <FeaturedRoommates />
      <WhyChooseUs />
      <TestimonialSection />
    </div>
  );
};

export default Home;
