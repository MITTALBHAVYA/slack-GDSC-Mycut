// Header.jsx
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../features/authSlice.js';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const user = useSelector((state) => state.auth.user);
  const currentWorkspace = useSelector((state) => state.workspace.currentWorkspace);
  const authLoading = useSelector((state) => state.auth.loading);
  const workspaceLoading = useSelector((state) => state.workspace.loading);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/auth/login');
    }
  };

  return (
    <header className="bg-gray-800 text-white h-14 flex items-center justify-between px-4">
      <div className="flex items-center">
        <h1 className="text-xl font-bold">
          {workspaceLoading ? 'Loading workspace...' : (currentWorkspace?.name || 'GDSC Slack')}
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <span>{authLoading ? 'Loading user...' : (user?.username || 'Guest')}</span>
        <button
          onClick={handleLogout}
          className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 transition-colors"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
