import SliderBanner from '../components/SlideBanner';
import FeaturedRoommates from '../components/FeaturedRoommates';
import WhyChooseUs from '../components/WhyChooseUs';
import TestimonialSection from '../components/TestimonialSection';
import HowItWorks from './HowItWorks';
import Newsletter from './Newsletter';
const Home = () => {
  return (
    <div className='pt-16 bg-base-100 min-h-screen'>
      <SliderBanner />
      <FeaturedRoommates />
      <WhyChooseUs />
      <TestimonialSection />
      <Newsletter></Newsletter>
    </div>
  );
};

export default Home;
