/* eslint-disable no-unused-vars */
 
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Using Vite environment variable format
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/status`, {
          withCredentials: true
        });
        if (res.data.isAuthenticated) {
          setUser(res.data.user);
        }
      } catch (error) {
        console.log('Not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  useEffect(() => {
    // Close mobile menu when route changes
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {}, {
        withCredentials: true
      });
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const githubLogin = () => {
    // Using Vite environment variable format
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
  };

  // Navigation items array
  const navItems = [
    { to: '/templates', label: 'Templates' },
    { to: '/insights', label: 'Insights' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-10px) scale(1.03); }
        }
        @keyframes subtleBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes gradientPulse {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-float-delay { animation: float 6s ease-in-out infinite 1s; }
        .animate-bounce { animation: subtleBounce 3s ease-in-out infinite; }
        
        /* Mobile menu animation */
        .mobile-menu {
          transition: all 0.3s ease-in-out;
          max-height: 0;
          overflow: hidden;
        }
        .mobile-menu.open {
          max-height: 500px;
        }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="flex justify-center px-4">
          {/* Enhanced background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full filter blur-[80px] opacity-20 animate-float"></div>
            <div className="absolute top-0 right-1/4 w-56 h-56 bg-gradient-to-br from-purple-500/20 to-blue-400/20 rounded-full filter blur-[70px] opacity-20 animate-float-delay"></div>
          </div>

          {/* Main Navbar with enhanced gradient */}
          <div 
            className={`relative bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-full px-4 md:px-8 flex items-center justify-between md:justify-center space-x-0 md:space-x-8 shadow-xl backdrop-blur-lg border border-gray-700/60 hover:border-gray-600/80 transition-all duration-500 ${
              scrolled ? 'h-12 shadow-lg' : 'h-14 shadow-xl'
            } w-full md:w-auto`}
            style={{ 
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            <div className="flex items-center group relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-500/40 opacity-0 group-hover:opacity-80 blur-md transition-opacity duration-300"></div>
              
              <Link to="/" className="text-white font-medium text-xl tracking-tight relative z-10">
                <span 
                  className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                  style={{
                    backgroundSize: '200% 200%',
                    animation: 'gradientPulse 6s ease infinite'
                  }}
                >
                  Despicable Me
                </span>
              </Link>
            </div>

            <button 
              className="md:hidden p-2 rounded-full focus:outline-none"
              onClick={toggleMobileMenu}
            >
              <div className="w-6 flex flex-col items-center">
                <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-0.5'}`}></span>
                <span className={`block h-0.5 w-6 bg-white transition-all duration-300 my-1 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`block h-0.5 w-6 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0.5'}`}></span>
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <div key={item.to} className="group relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/30 opacity-0 group-hover:opacity-80 blur-md transition-opacity duration-300"></div>
                  <Link
                    to={item.to}
                    className={`relative text-gray-300 hover:text-white transition-all duration-300 px-3 py-0.5 ${
                      location.pathname === item.to ? 'text-white font-medium' : ''
                    }`}
                  >
                    <span className="font-normal tracking-wide relative z-10">
                      {item.label}
                    </span>
                  </Link>
                </div>
              ))}
            </div>

            {/* CTA button with enhanced gradient - hidden on mobile */}
            <div className="hidden md:block group relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-500/40 opacity-0 group-hover:opacity-80 blur-md transition-opacity duration-300"></div>
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link 
                    to="/dashboard" 
                    className="relative px-4 py-1 rounded-full bg-gradient-to-r from-blue-500/70 to-purple-600/70 text-white font-medium text-sm tracking-wide transition-all duration-500 shadow-lg z-10 border border-gray-600/50"
                  >
                    Dashboard
                  </Link>
                  
                  <div className="relative group">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-8 h-8 rounded-full cursor-pointer border-2 border-gray-700 hover:border-blue-400 transition-all duration-300"
                    />
                    
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-20 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 border border-gray-700">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  onClick={githubLogin}
                  className="relative px-4 py-1 rounded-full bg-gradient-to-r from-gray-800 to-gray-700 text-white font-medium text-sm tracking-wide hover:from-blue-500/70 hover:to-purple-600/70 transition-all duration-500 shadow-lg z-10 border border-gray-600/50"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''} md:hidden`}>
          <div className="bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-lg rounded-2xl mx-4 mt-2 p-6 shadow-xl border border-gray-700/60">
            <div className="flex flex-col space-y-4">
              {user && (
                <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-700 mb-2">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full border-2 border-gray-700"
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                </div>
              )}
              
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`text-gray-300 hover:text-white transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-900 ${
                    location.pathname === item.to ? 'bg-gray-800 text-white' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-900"
                  >
                    Dashboard
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-left text-gray-300 hover:text-white transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-900"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <button 
                  onClick={githubLogin}
                  className="w-full mt-4 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/70 to-purple-600/70 text-white font-medium text-sm tracking-wide transition-all duration-500 shadow-lg border border-gray-600/50 text-center"
                >
                  Get Started
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
