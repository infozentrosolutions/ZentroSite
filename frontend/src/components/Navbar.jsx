import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { gsap } from 'gsap';
import logo from '../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(".mobile-menu",
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3 }
      );
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Programs', path: '/programs' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300`}>
        <nav className="relative bg-gradient-to-r from-purple-900 via-gray-100 to-black backdrop-blur-md px-4 py-1.5 shadow-2xl flex items-center justify-between pointer-events-auto h-full w-full">

          {/* Left: Logo Area */}
          <Link to="/" className="flex items-center space-x-3 shrink-0 pl-2">
            <div className="bg-white p-1 rounded-full shadow-sm flex items-center justify-center">
              <img src={logo} alt="Zentro" className="h-6 md:h-8 w-auto object-contain" />
            </div>
            <div className="hidden sm:flex text-lg md:text-xl font-bold font-heading">
              <span className="text-white tracking-tight drop-shadow-md">Zentro Solutions</span>
            </div>
          </Link>

          {/* Center: Desktop Links in Black Section */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="bg-black rounded-full px-1.5 py-1 flex items-center space-x-1 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-800">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-sm font-medium transition-all px-4 py-1.5 rounded-full ${isActive
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side Options & Login */}
          <div className="flex items-center space-x-2 shrink-0 pr-2">
            <Link to="/login" className="hidden lg:flex items-center bg-white px-6 py-2 rounded-full text-sm font-bold text-black border-2 border-transparent hover:border-purple-600 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
              Login
            </Link>

            {/* Mobile Menu Button Container */}
            <div className="lg:hidden flex items-center">
              <button
                className="text-white hover:text-gray-300 p-2 rounded-full transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isOpen && (
            <div className="absolute top-20 right-0 w-[240px] bg-black rounded-3xl p-4 shadow-2xl border border-gray-800 lg:hidden flex flex-col space-y-2 origin-top-right mobile-menu">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`p-3 font-medium transition-colors rounded-xl text-center ${isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <Link to="/login" onClick={() => setIsOpen(false)} className="bg-white text-black px-6 py-3 rounded-xl text-center font-bold mt-2 hover:bg-gray-200 shadow-sm">
                Login
              </Link>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
