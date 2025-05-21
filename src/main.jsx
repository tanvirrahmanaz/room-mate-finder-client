import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
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

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // must include <Outlet />
    children: [
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
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>

    <RouterProvider router={router} />

  </StrictMode>
);
