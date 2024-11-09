// Login.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../features/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar.jsx';
import { MdOutlineMailOutline } from "react-icons/md";
import SpaceRobot2 from '../SpaceRobot/SpaceRobot2.jsx';
import PageLayout from '../layout/PageLayout.jsx';
import { MdErrorOutline } from 'react-icons/md';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    const handleAuthError = () => {
      navigate('/auth/login', { replace: true });
    };
    window.addEventListener('authError', handleAuthError);
    return () => {
      window.addEventListener('authError', handleAuthError);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(login({ email, password })).unwrap();
      if (result.token) {
        navigate('/workspace');
      }
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <PageLayout>
      <div className="flex justify-end items-start w-full h-full">
        <div
          className="upper-right-vector w-1/3 lg:w-1/5 h-[310px] bg-contain bg-no-repeat bg-top-right"
          style={{ backgroundImage: 'url("/images/Vector3.png")', position: 'relative' }}
        />
      </div>

      <div className="flex items-center justify-center bg-transparent">
        {/* <NavbarSignIn /> */}
        <Navbar variant='signin'/>
        <SpaceRobot2 />
        <div className="centered-container relative">
          <h1>
            Sign in to GDSC SLACK
          </h1>
          <p>
            We suggest using the email address that you use at work
          </p>
          <button className='signin-ggl-btn'>
            <img src="/images/google_icon.png" alt='G'/>
            <span>Sign in with Google</span>
          </button>
          <span className='or'>OR</span>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                placeholder="name@workemail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-center justify-center text-red-700 text-sm border border-red-300 bg-red-100 rounded-lg px-4 py-3 mt-3 shadow-md">
                <MdErrorOutline className="text-white bg-red-500 rounded-full p-1 mr-2" size={30} />
                <span className="font-bold">{error}</span>
              </div>
            )}



            <div>
              <button
                type="submit"
                disabled={isLoading}
              >
                <MdOutlineMailOutline />
                <span>
                  {isLoading ? 'Signing in...' : 'Sign in with Email'}
                </span>
              </button>
            </div>
          </form>

          <div>
            <Link
              to="/auth/forgot-password"
            >
              Forgot Password ? Click Here !
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Login;