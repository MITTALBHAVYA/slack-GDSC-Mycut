import { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';

const Navbar = ({ variant = 'simple' }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const Logo = () => (
    <div className="gdscslacklogo text-white font-bold tracking-wider ml-6 flex items-center">
      <Link to="/" className="text-shadow-md text-3xl lg:text-3xl flex items-center gdsclogolink">
        <img src="/images/logo.png" alt="G" className="logo-image w-12 h-12" />
        GDSC SLACK
      </Link>
    </div>
  );

  const DesktopNav = () => {
    switch (variant) {
      case 'simple':
        return null;
      case 'signin':
        return (
          <div className="hidden lg:flex flex-col items-center space-x-8">
            <span
              className="text-white font-bold tracking-wider"
              style={{
                fontFamily: 'Quicksand, sans-serif',
                letterSpacing: '0.6px'
              }}
            >
              New to Slack?
            </span>
            <Link to="/auth/register" className="signuplink">
              Create an account
            </Link>
          </div>
        );
      case 'landing':
        return (
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/explore" className="flex items-center text-white text-2xl lg:text-3xl">
              <FaSearch className="w-6 h-6 lg:w-8 lg:h-8 mr-3 lg:mr-4" />
              <span className="text-shadow-md text-lg lg:text-2xl">Explore</span>
            </Link>
            <Link
              to="/auth/login"
              className="border-4 border-white text-white rounded-lg px-6 py-3 lg:px-8 lg:py-4 font-bold text-lg lg:text-2xl hover:bg-blue-500 hover:text-white transition duration-300"
            >
              SIGN IN
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  const MobileMenu = () => {
    if (!menuOpen) return null;

    const getMobileMenuContent = () => {
      switch (variant) {
        case 'simple':
          return null;
        case 'signin':
          return (
            <Link
              to="/auth/register"
              className="text-white text-xl font-semibold py-4 px-8 rounded-md hover:text-blue-400 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setMenuOpen(false)}
            >
              Create an account
            </Link>
          );
        case 'landing':
          return (
            <>
              <Link
                to="/explore"
                className="text-white text-2xl font-semibold py-4 px-8 rounded-md hover:text-blue-400 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setMenuOpen(false)}
                aria-label="Explore"
              >
                Explore
              </Link>
              <Link
                to="/auth/login"
                className="text-white text-2xl font-semibold py-4 px-8 rounded-md hover:text-blue-400 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onClick={() => setMenuOpen(false)}
                aria-label="Sign In"
              >
                Sign In
              </Link>
            </>
          );
        default:
          return null;
      }
    };

    const menuContent = getMobileMenuContent();
    if (!menuContent) return null;

    return (
      <div className="absolute top-full left-0 right-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center py-6 lg:hidden space-y-4">
        {menuContent}
      </div>
    );
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-transparent px-8 py-5 flex items-center justify-between w-full">
      <Logo />
      <DesktopNav />
      {variant !== 'simple' && (
        <button
          className="lg:hidden text-white text-3xl lg:text-4xl hover:text-blue-400 transition duration-300 transform hover:scale-110"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
        </button>
      )}
      <MobileMenu />
    </nav>
  );
};

Navbar.propTypes = {
  variant: PropTypes.oneOf(['simple', 'signin', 'landing']),
};

export default Navbar;