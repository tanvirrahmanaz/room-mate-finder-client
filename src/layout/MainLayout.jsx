import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* ✅ this is REQUIRED to show child routes */}
    </>
  );
};

export default MainLayout;
