// ForgotPassword.jsx
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../features/authSlice.js';
import { Link } from 'react-router-dom';
import PageLayout from '../layout/PageLayout.jsx';
import Navbar from '../layout/Navbar.jsx';
import SpaceRobot2 from '../SpaceRobot/SpaceRobot2.jsx';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setStatus({
        type: 'success',
        message: 'Password reset link has been sent to your email',
      });
    } catch (error) {
      const errorMessage = error?.response?.data?.message || 'Failed to send reset link';
      setStatus({
        type: 'error',
        message: errorMessage,
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
            Reset your password
          </h1>
          <p>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {status.message && (
              <div
                className={`text-sm text-center ${status.type === 'success' ? 'text-green-600' : 'text-red-600'
                  }`}
                aria-live="polite"
              >
                {status.message}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
              >
                <span>{isLoading ? 'Sending...' : 'Send reset link'}</span>

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

export default ForgotPassword;
