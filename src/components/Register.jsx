import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const Register = () => {
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    if (!/[A-Z]/.test(pwd)) {
      toast.error('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(pwd)) {
      toast.error('Password must contain at least one lowercase letter');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validatePassword(password)) return;

    // Frontend only: simulate success
    toast.success('Registration successful!');

    // Clear form
    setName('');
    setPhotoURL('');
    setEmail('');
    setPassword('');
  };

  const handleGoogleLogin = () => {
    toast('Google login clicked (frontend only)');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Register an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Photo URL</label>
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Optional profile photo URL"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your email address"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="At least 6 characters, with uppercase & lowercase"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Register
          </button>
        </form>

        <div className="divider text-sm text-gray-500 dark:text-gray-400 mt-6">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn btn-outline btn-block flex items-center justify-center gap-2 mt-4"
        >
          <FcGoogle className="text-2xl" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline dark:text-blue-400">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
