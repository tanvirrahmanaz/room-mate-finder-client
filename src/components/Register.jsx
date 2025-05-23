import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Image, Chrome, UserPlus } from 'lucide-react';
import { auth } from '../firebase/firebase.config';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Typewriter } from 'react-simple-typewriter';
import { Tooltip } from 'react-tooltip';
import { Fade } from 'react-awesome-reveal';

// Mock Lottie component (replace with real import if you have animation)
const Lottie = ({ style }) => (
  <div style={style} className="flex items-center justify-center">
    <div className="animate-pulse text-6xl">👤</div>
  </div>
);

const Register = () => {
  const [name, setName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light');

  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

  // Theme effect - fixed to work with localStorage
  useEffect(() => {
    const updateTheme = () => {
      try {
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
      } catch (error) {
        console.error('Error reading theme from localStorage:', error);
        setTheme('light');
      }
    };

    // Initial theme load
    updateTheme();

    // Listen for localStorage changes (theme toggle)
    const handleStorageChange = (e) => {
      if (e.key === 'theme') {
        setTheme(e.newValue || 'light');
      }
    };

    // Listen for custom theme change events
    const handleThemeChange = () => {
      updateTheme();
    };

    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('themeChanged', handleThemeChange);

    // Also check for theme changes periodically (fallback)
    const themeCheckInterval = setInterval(updateTheme, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('themeChanged', handleThemeChange);
      clearInterval(themeCheckInterval);
    };
  }, []);
  

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) return;
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      await updateProfile(userCredential.user, {
        displayName: name,
        photoURL: photoURL || null,
      });

      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Login successful!');
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSubmit(e);
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900' 
        : 'bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50'
    }`}>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 w-full max-w-6xl items-center">
          
          {/* Left Side */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <Fade direction="left" delay={200}>
              <div className="mb-8">
                <Lottie
                  animationData={null}
                  loop={true}
                  autoplay={true}
                  style={{ width: 300, height: 300 }}
                />
              </div>
              
              <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Join{' '}
                <span className={`${
                  theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                } inline-block min-w-[120px]`}>
                  <Typewriter
                    words={['Us!', 'Today!', 'Now!']}
                    loop={true}
                    cursor={true}
                    typeSpeed={70}
                    deleteSpeed={50}
                    delaySpeed={2000}
                  />
                </span>
              </h1>
              
              <p className={`text-xl mb-8 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Create your account and start your amazing journey with us
              </p>
            </Fade>
          </div>

          {/* Right Side - Register Form */}
          <div className="flex justify-center lg:justify-end">
            <Fade direction="right" delay={400}>
              <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-lg border transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gray-800/90 border-gray-700/50 shadow-indigo-900/20'
                  : 'bg-white/90 border-gray-200/50 shadow-indigo-900/20'
              }`}>
                
                <div className="text-center mb-8">
                  <div className={`inline-flex p-3 rounded-full mb-4 ${
                    theme === 'dark' ? 'bg-indigo-600' : 'bg-indigo-600'
                  }`}>
                    <UserPlus className="text-white" size={24} />
                  </div>
                  
                  <h2 className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    Sign Up
                  </h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <Fade cascade damping={0.1}>
                    {/* Name Field */}
                    <div className="relative">
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Full Name
                      </label>
                      <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} size={20} />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                          placeholder="Your full name"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Photo URL Field */}
                    <div className="relative">
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Photo URL (Optional)
                      </label>
                      <div className="relative">
                        <Image className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} size={20} />
                        <input
                          type="url"
                          value={photoURL}
                          onChange={(e) => setPhotoURL(e.target.value)}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                          placeholder="Optional profile photo URL"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div className="relative">
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} size={20} />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className={`w-full pl-10 pr-4 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                          placeholder="Your email address"
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="relative">
                      <label className={`block text-sm font-medium mb-2 ${
                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        Password
                      </label>
                      <div className="relative">
                        <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`} size={20} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className={`w-full pl-10 pr-12 py-3 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
                            theme === 'dark'
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500'
                          }`}
                          placeholder="Create a strong password"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-300 ${
                        loading
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    {/* Google Sign In */}
                    <button
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={loading}
                      className={`w-full py-3 px-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 ${
                        theme === 'dark'
                          ? 'border-gray-600 text-white hover:bg-gray-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Chrome size={20} />
                      Continue with Google
                    </button>

                    {/* Login Link */}
                    <p className={`text-center text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Already have an account?{' '}
                      <Link
                        to="/login"
                        className={`font-medium hover:underline ${
                          theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                        }`}
                      >
                        Sign In
                      </Link>
                    </p>
                  </Fade>
                </form>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;