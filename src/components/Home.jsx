import React from 'react';
import SliderBanner from '../components/SlideBanner';
import FeaturedRoommates from '../components/FeaturedRoommates';
import WhyChooseUs from '../components/WhyChooseUs';
import TestimonialSection from '../components/TestimonialSection';
import HowItWorks from './HowItWorks';
import Newsletter from './Newsletter';
const Home = () => {
  return (
    <div className='pt-16'>
      <SliderBanner />
      <FeaturedRoommates />
      <WhyChooseUs />
      <HowItWorks></HowItWorks>
      <TestimonialSection />
      <Newsletter></Newsletter>
    </div>
  );
};

export default Home;
