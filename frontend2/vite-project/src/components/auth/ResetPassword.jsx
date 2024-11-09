import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { resetPassword } from '../../features/authSlice';
import PageLayout from '../layout/PageLayout.jsx';
import Navbar from '../layout/Navbar.jsx';
import SpaceRobot2 from '../SpaceRobot/SpaceRobot2.jsx';
import { MdCheckCircle, MdErrorOutline } from 'react-icons/md';


const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password.length < 8) {
      setStatus({
        type: 'error',
        message: 'Password must be at least 8 characters long'
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setStatus({
        type: 'error',
        message: 'Passwords do not match'
      });
      setIsLoading(false);
      return;
    }

    try {
      await dispatch(resetPassword({
        token,
        ...formData
      })).unwrap();

      setStatus({
        type: 'success',
        message: 'Password reset successful! Redirecting to login...'
      });

      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Password reset failed';
      setStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="flex justify-between items-start w-full h-full">
        <div
          className="upper-left-vector top-0 left-0 w-1/3 lg:w-1/5 h-[315px] bg-contain bg-no-repeat bg-top-left z-1"
          style={{ backgroundImage: 'url("/images/Vector2.png")', position: 'relative' }}
        />
        <div
          className="upper-right-vector w-1/3 lg:w-1/5 h-[310px] bg-contain bg-no-repeat bg-top-right"
          style={{ backgroundImage: 'url("/images/Vector3.png")', position: 'relative' }}
        />
      </div>
      <div className="flex items-center justify-center bg-transparent">
        <Navbar variant='simple' />
        <SpaceRobot2 />
        <SpaceRobot2 />
        <div className="centered-container relative">
          <h1>
            Create new password
          </h1>
          <p>
            Please enter your new password below.
          </p>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                type="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm New Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            {status.message && (
              <div
                className={`flex items-center justify-center ${status.type === 'success' ? 'text-green-700 border-green-300 bg-green-100' : 'text-red-700 border-red-300 bg-red-100'
                  } text-sm border rounded-lg px-4 py-3 mt-3 shadow-md`}
                aria-live="polite"
              >
                {status.type === 'success' ? (
                  <MdCheckCircle className="text-white bg-green-500 rounded-full p-1 mr-2" size={30} />
                ) : (
                  <MdErrorOutline className="text-white bg-red-500 rounded-full p-1 mr-2" size={30} />
                )}
                <span className="font-bold">{status.message}</span>
              </div>
            )}
            <div>
              <button
                type="submit"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Resetting Password...' : 'Reset Password'}</span>
              </button>
            </div>
          </form>
          <div>
            <Link
              to="/auth/login"
            >
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ResetPassword;