import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Logging in with:', { email, password });
    // No backend call, just console for now
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full hover:bg-blue-700 dark:hover:bg-indigo-600 transition-colors"
          >
            Sign In
          </button>
        </form>

        <div className="divider text-sm text-gray-500 dark:text-gray-400">OR</div>

        <button
          onClick={handleGoogleLogin}
          className="btn w-full bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
        >
          <FcGoogle className="text-xl mr-2" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mt-4">
          Don't have an account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline dark:text-blue-400">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
