import { RouterProvider } from 'react-router-dom';
import { router } from './main';
import { Toaster } from 'react-hot-toast';
import './App.css'

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
