import { useRef, useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch,useSelector} from 'react-redux';
import { logout } from '../../features/authSlice';
import { User, LogOut, Settings, HelpCircle } from 'lucide-react';

const UserProfilePopup = () => {
  const popupRef = useRef(null);
  const buttonRef = useRef(null);
  const [isPopUp, setIsPopUp] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  console.log(user);
  const {username,email} = user;
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/auth/login');
    }
  };

  const handlePopUp = () => {
    setIsPopUp(!isPopUp);
  };

  const getUserInitials = () => {
    if (username) {
      const initials = username.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      return initials;
    }
    return '@';
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && 
          !popupRef.current.contains(event.target) &&
          buttonRef.current &&
        !buttonRef.current.contains(event.target)) {
        setIsPopUp(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        className="w-12 h-12 bg-gradient-to-br from-[#41278a] to-[#81298d]  text-white 
        border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 
        rounded-full flex items-center justify-center 
        transform hover:scale-105 active:scale-95 
        focus:outline-none focus:ring-2 focus:ring-cyan-300"
        onClick={handlePopUp}
        aria-label="User Profile"
      >
        <span className="font-bold text-[2rem]">{getUserInitials()}</span>
      </button>

      {isPopUp && (
        <div 
          ref={popupRef}
          className="absolute top-14 right-0 w-72 bg-white 
          rounded-xl shadow-2xl border border-gray-200 
          transition-all duration-300 ease-in-out 
          animate-fade-in-down z-50"
        >
          {/* User Profile Header */}
          <div className="bg-gradient-to-r from-[#41278a] to-[#81298d]
            text-white p-4 rounded-t-xl flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full 
              flex items-center justify-center text-xl font-bold">
              {getUserInitials()}
            </div>
            <div>
              <h3 className="text-lg font-semibold truncate max-w-[200px]">
                {username.toUpperCase() || "User"}
              </h3>
              <p className="text-6 opacity-75 truncate max-w-[200px]">
                {email || "N/A"}
              </p>
            </div>
          </div>

          {/* Popup Menu Items */}
          <div className="p-2">
            <button 
              onClick={() => navigate('/profile')}
              className="w-full flex items-center p-3 hover:bg-gray-100 
              rounded-lg transition-colors group"
            >
              <User className="mr-3 text-[#133044] group-hover:text-[#0faab8]" />
              <span className="text-[#133044]">Profile</span>
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="w-full flex items-center p-3 hover:bg-gray-100 
              rounded-lg transition-colors group"
            >
              <Settings className="mr-3 text-[#133044] group-hover:text-[#0faab8]" />
              <span className="text-[#133044]">Settings</span>
            </button>
            <button 
              onClick={() => navigate('/help')}
              className="w-full flex items-center p-3 hover:bg-gray-100 
              rounded-lg transition-colors group"
            >
              <HelpCircle className="mr-3 text-[#133044] group-hover:text-[#0faab8]" />
              <span className="text-[#133044]">Help</span>
            </button>

            {/* Logout Button */}
            <div className="border-t mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="w-full bg-[#660000] text-white py-2 px-4 
                rounded-lg hover:bg-[#ff0800] transition-colors 
                flex items-center justify-center space-x-2"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfilePopup;