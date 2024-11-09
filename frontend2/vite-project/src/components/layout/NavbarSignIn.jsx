import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import "./Navbar.css";

const NavbarSignIn = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-30 bg-transparent px-8 py-5 flex items-center justify-between w-full">
            {/* Logo */}
            <div className="gdsclogo text-white font-bold tracking-wider ml-6 flex items-center">
                <Link to="/" className="text-shadow-md text-3xl lg:text-3xl flex items-center gdsclogolink">
                <img src="./images/logo.png" alt="G" className='logo-image w-12 h-12'/>
                    GDSC SLACK
                </Link>
            </div>

            {/* Desktop Links */}
            <div className="hidden lg:flex flex-col items-center space-x-8">
                <span
                    style={{
                        fontFamily: 'Quicksand, sans-serif',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        letterSpacing: '0.6px'
                    }}
                >
                    New to Slack?
                </span>
                <Link
                    to="/auth/register"
                    className="signuplink"
                >
                    Create an account
                </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
                className="lg:hidden text-white text-3xl lg:text-4xl hover:text-blue-400 transition duration-300 transform hover:scale-110"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                {menuOpen ? <HiOutlineX /> : <HiOutlineMenuAlt3 />}
            </button>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="absolute top-full left-0 right-0 bg-black bg-opacity-80 backdrop-blur-sm flex flex-col items-center py-6 lg:hidden space-y-4">
                    <Link
                        to="/auth/register"
                        className="text-white text-xl font-semibold py-4 py-8 rounded-md hover:text-blue-400 transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onClick={() => setMenuOpen(false)}
                    >
                        Create an account
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default NavbarSignIn;
