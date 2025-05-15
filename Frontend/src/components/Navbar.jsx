import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { protect, setProtect, user, loading, githubLogin, logout } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setProtect(false); // Explicitly set protect to false on logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const navItems = [
    { to: '/templates', label: 'Templates' },
    { to: '/insights', label: 'Insights' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  // Show loading state if needed
  if (loading) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-700/60">
        <div className="container mx-auto px-4 py-3 flex justify-center">
          <div className="animate-pulse h-8 w-32 bg-gray-700 rounded-full"></div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <style jsx="true">{`
        .mobile-menu {
          transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 0;
          overflow: hidden;
        }
        .mobile-menu.open {
          max-height: 600px;
        }
      `}</style>

      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="flex justify-center px-4">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full filter blur-[80px] opacity-20 animate-float"></div>
            <div className="absolute top-0 right-1/4 w-56 h-56 bg-gradient-to-br from-purple-500/20 to-blue-400/20 rounded-full filter blur-[70px] opacity-20 animate-float-delay"></div>
          </div>

          <div
            className={`relative bg-gradient-to-r from-gray-900/95 via-gray-800/95 to-gray-900/95 rounded-full px-4 md:px-8 flex items-center justify-between md:justify-center space-x-0 md:space-x-8 shadow-xl backdrop-blur-lg border border-gray-700/60 hover:border-gray-600/80 transition-all duration-500 ${
              scrolled ? 'h-12 shadow-lg' : 'h-14 shadow-xl'
            } w-full md:w-auto`}
          >
            <div className="flex items-center group relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-500/40 opacity-0 group-hover:opacity-80 blur-md transition-opacity duration-300"></div>
              <Link to="/" className="text-white font-medium text-xl tracking-tight relative z-10">
                <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  ResYouMe
                </span>
              </Link>
            </div>

            <button
              className="md:hidden p-2 rounded-full focus:outline-none"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
            >
              <div className="w-6 flex flex-col items-center">
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-0.5'
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 my-1 ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                ></span>
                <span
                  className={`block h-0.5 w-6 bg-white transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-0.5'
                  }`}
                ></span>
              </div>
            </button>

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
                    <span className="font-normal tracking-wide relative z-10">{item.label}</span>
                  </Link>
                </div>
              ))}
            </div>

            <div className="hidden md:block group relative">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-400/30 to-purple-500/40 opacity-0 group-hover:opacity-80 blur-md transition-opacity duration-300"></div>
              {protect && user ? (
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
                    <div className="absolute right-0 mt-[1rem] w-[16rem] bg-gray-800 rounded-lg shadow-lg py-2 z-20 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-300 border border-gray-700">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm font-medium text-white">{user.name}</p>
                        <p className="text-xs break-all text-gray-400">{user.email}</p>
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

        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''} md:hidden`}>
          <div className="bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-lg rounded-2xl mx-4 mt-2 p-6 shadow-xl border border-gray-700/60">
            <div className="flex flex-col space-y-4">
              {protect && user && (
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
              {protect && user ? (
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