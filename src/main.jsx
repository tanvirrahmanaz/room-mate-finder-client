import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import AuthProvider from './context/AuthContext'; // ✅ Now default export works


import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';

import './index.css';
import MainLayout from './layout/MainLayout';
import Login from './components/Login';
import Register from './components/Register';
import AddListing from './components/AddListing';
import BrowseListings from './components/BrowseListing';
import MyListings from './components/MyListings';
import Home from './components/Home';
import NotFound from './pages/NotFound';
import UpdateListing from './components/UpdateListing';
import RoomDetails from './components/RoomDetails';
import { ThemeProvider } from './context/ThemeContext'; // ✅ Now default export works
import { Edit } from 'lucide-react';
import EditListing from './components/EditListing';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // must include <Outlet />
    children: [
      {
        path: '/',
        element: <Home /> // ✅ This is what shows at http://localhost:5173/
      },
      {
        path: '/login',
        element: <Login />, // ✅ login must be inside children
      },
      {
        path: '/signup',
        element: <Register />,
      },
      {
        path: '/add-listing',
        element: <AddListing />,
      },
      {
        path: 'browse',
        element: <BrowseListings />
      },
      {
        path: 'my-listings',
        element: <MyListings />
      },
      {
        path: '*',
        element: <NotFound></NotFound>
      },
      { path: '/details/:id', 
        element: <RoomDetails></RoomDetails>
      },
      {
        path: '/edit-listing/:id',
        element: <EditListing></EditListing>
      },
      {
        path: '/update/:id',
        element: <UpdateListing></UpdateListing>
      },

    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ThemeProvider>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
    </ThemeProvider>

  </StrictMode>
);
