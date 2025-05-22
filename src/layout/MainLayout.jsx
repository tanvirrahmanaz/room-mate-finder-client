import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* ✅ this is REQUIRED to show child routes */}
      <Footer></Footer>
    </>
  );
};

export default MainLayout;
