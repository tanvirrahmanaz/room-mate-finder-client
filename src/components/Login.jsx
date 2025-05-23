import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, Chrome } from 'lucide-react';
import { auth } from '../firebase/firebase.config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

// Mock implementations of the packages (since they're not available in this environment)
const Lottie = ({  style }) => (
  <div style={style} className="flex items-center justify-center">
    <div className="animate-pulse text-6xl">🔐</div>
  </div>
);

const Typewriter = ({ words, cursor, typeSpeed, deleteSpeed, delaySpeed }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < word.length) {
        setCurrentWord(word.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentWord(word.slice(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === word.length) {
        setTimeout(() => setIsDeleting(true), delaySpeed);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setWordIndex((wordIndex + 1) % words.length);
      }
    }, isDeleting ? deleteSpeed : typeSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, delaySpeed]);

  return (
    <span>
      {currentWord}
      {cursor && <span className="animate-pulse">|</span>}
    </span>
  );
};

const Reveal = ({ children = true, direction = 'up', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) {
      switch (direction) {
        case 'up': return 'translate-y-8 opacity-0';
        case 'down': return '-translate-y-8 opacity-0';
        case 'left': return 'translate-x-8 opacity-0';
        case 'right': return '-translate-x-8 opacity-0';
        default: return 'opacity-0';
      }
    }
    return 'translate-y-0 translate-x-0 opacity-100';
  };

  return (
    <div className={`transition-all duration-700 ease-out ${getAnimationClass()}`}>
      {children}
    </div>
  );
};

const Tooltip = ({ content, children, position = 'top' }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const getTooltipPosition = () => {
    switch (position) {
      case 'top': return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom': return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left': return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right': return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default: return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {children}
      {showTooltip && (
        <div className={`absolute ${getTooltipPosition()} z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md shadow-lg whitespace-nowrap animate-fade-in`}>
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      )}
    </div>
  );
};

// Main Login Component
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Navigation and routing
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  // Firebase Google Provider
  const googleProvider = new GoogleAuthProvider();

  // Listen for theme changes
  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage?.getItem('theme') || 'light';
      const darkMode = savedTheme === 'dark';
      setIsDark(darkMode);
      
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    
    handleThemeChange();
    setMounted(true);
    
    // Listen for storage changes
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleThemeChange);
      
      // Check for theme changes every 100ms
      const interval = setInterval(handleThemeChange, 100);
      
      return () => {
        window.removeEventListener('storage', handleThemeChange);
        clearInterval(interval);
      };
    }
  }, []);

  // Handle email/password login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setLoading(true);
    
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success('Login successful!');
      navigate(from, { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleLogin(e);
    }
  };

  if (!mounted) return null;

  const theme = isDark ? 'dark' : 'light';

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 w-full max-w-6xl items-center">
          
          {/* Left Side - Animation and Welcome Text */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <Reveal direction="left" delay={200}>
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
                Welcome{' '}
                <span className={`${
                  theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
                } inline-block min-w-[120px]`}>
                  <Typewriter
                    words={['Back!', 'Home!', 'Friend!']}
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
                Sign in to continue your amazing journey with us
              </p>
            </Reveal>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex justify-center lg:justify-end">
            <Reveal direction="right" delay={400}>
              <div className={`w-full max-w-md p-8 rounded-3xl shadow-2xl backdrop-blur-lg border transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-gray-800/90 border-gray-700/50 shadow-purple-900/20'
                  : 'bg-white/90 border-gray-200/50 shadow-blue-900/20'
              }`}>
                
                <div className="text-center mb-8">
                  <div className={`inline-flex p-3 rounded-full mb-4 ${
                    theme === 'dark' ? 'bg-purple-600' : 'bg-blue-600'
                  }`}>
                    <Lock className="text-white" size={24} />
                  </div>
                  
                  <h2 className={`text-3xl font-bold ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    Sign In
                  </h2>
                  
                  <p className={`mt-2 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Access your account
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                  <Reveal direction="up" delay={600}>
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
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                          }`}
                          placeholder="Enter your email"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </Reveal>

                  <Reveal direction="up" delay={800}>
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
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-purple-500 focus:border-purple-500'
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500'
                          }`}
                          placeholder="Enter your password"
                          disabled={loading}
                        />
                        <Tooltip content={showPassword ? 'Hide password' : 'Show password'}>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors ${
                              theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                            }`}
                          >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  </Reveal>

                  <Reveal direction="up" delay={1000}>
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                        theme === 'dark'
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg shadow-purple-600/25'
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/25'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Signing In...
                        </div>
                      ) : (
                        'Sign In'
                      )}
                    </button>
                  </Reveal>
                </form>

                <Reveal direction="up" delay={1200}>
                  <div className="my-6">
                    <div className="relative">
                      <div className={`absolute inset-0 flex items-center ${
                        theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                      }`}>
                        <div className={`w-full border-t ${
                          theme === 'dark' ? 'border-gray-600' : 'border-gray-300'
                        }`}></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className={`px-2 ${
                          theme === 'dark' ? 'bg-gray-800/90 text-gray-400' : 'bg-white/90 text-gray-500'
                        }`}>
                          Or continue with
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] border flex items-center justify-center gap-3 ${
                      theme === 'dark'
                        ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white'
                        : 'bg-white hover:bg-gray-50 border-gray-300 text-gray-700'
                    }`}
                  >
                    <Chrome size={20} className="text-blue-500" />
                    {loading ? 'Connecting...' : 'Continue with Google'}
                  </button>
                </Reveal>

                <Reveal direction="up" delay={1400}>
                  <p className={`text-center text-sm mt-6 ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    Don't have an account?{' '}
                    <Link 
                      to="/signup"
                      className={`font-semibold hover:underline transition-colors ${
                        theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-blue-600 hover:text-blue-500'
                      }`}
                    >
                      Create Account
                    </Link>
                  </p>
                </Reveal>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;