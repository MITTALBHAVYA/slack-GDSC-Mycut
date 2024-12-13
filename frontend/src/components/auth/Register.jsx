// Register.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../features/authSlice.js';
import { Link, useNavigate } from 'react-router-dom';
import PageLayout from '../layout/PageLayout.jsx';
import Navbar from '../layout/Navbar.jsx';
import SpaceRobot2 from '../SpaceRobot/SpaceRobot2.jsx';
import { MdErrorOutline } from 'react-icons/md';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...registrationData } = formData;
      console.log("Confirm password : ", confirmPassword);
      const result = dispatch(register(registrationData))
      if (!isLoading) {
        if (!result.error) {
          navigate('/auth/login');
        }
      }
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
        <Navbar variant='simple' />
        <SpaceRobot2 />
        <div className="centered-container relative">
          <h1>
            SIGN UP
          </h1>
          <p>
            We suggest using the email address that you use at work
          </p>
          <form onSubmit={handleSubmit}>
            <div>
              <input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1">{errors.username}</p>
              )}
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
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
                <span>
                  {isLoading ? 'Creating account...' : 'Create account'}
                </span>
              </button>
            </div>
          </form>

          <div>
            <Link
              to="/auth/login"
            >
              Already have an account? Log In
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Register;