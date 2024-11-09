import { Link } from 'react-router-dom';
import "./Navbar.css";

const NavbarRegister = () => {

    return (
        <nav className="fixed top-0 left-0 right-0 z-30 bg-transparent px-8 py-5 flex items-center justify-between w-full">
            {/* Logo */}
            <div className="gdsclogo text-white font-bold tracking-wider ml-6 flex items-center">
                <Link to="/" className="text-shadow-md text-3xl lg:text-3xl flex items-center gdsclogolink">
                <img src="./images/logo.png" alt="G" className='logo-image w-12 h-12'/>
                    GDSC SLACK
                </Link>
            </div>
        </nav>
    );
};

export default NavbarRegister;
