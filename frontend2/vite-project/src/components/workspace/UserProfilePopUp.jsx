import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

const UserProfilePopup = ({ user, isOpen, onClose }) => {
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-end"
      style={{ pointerEvents: 'none' }}
    >
      <div 
        ref={popupRef}
        className="mt-20 mr-8 bg-white rounded-lg shadow-xl w-72 overflow-hidden transform transition-all duration-300 ease-in-out"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="p-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
            {user?.username?.[0]?.toUpperCase() || '@'}
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {user?.username || 'Guest'}
          </h3>
          <p className="text-gray-600 text-sm">
            {user?.email || 'No email provided'}
          </p>
        </div>
        <div className="bg-gray-50 px-6 py-4">
          <button
            onClick={onClose}
            className="w-full text-center text-gray-600 hover:text-gray-800 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
UserProfilePopup.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    email: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserProfilePopup;