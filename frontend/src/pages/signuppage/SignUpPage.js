import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../style/style.css';
import './SignUpPage.css';
import SpaceRobot from '../../components/SpaceRobot/SpaceRobot';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const apiUrl = 'http://localhost:8080/api/v1/auth/register';
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(apiUrl, formData);
      console.log('Registration successful', response.data);
      navigate('/dashboard');
    } catch (error) {
      if (error.response) {
        // Access error.response if it exists
        console.error('Registration failed', error.response.data);
      } else {
        // Handle other types of errors (e.g., network errors)
        console.error('Registration failed', error.message);
      }
    }
  };

  return (
    <PageLayout>
      <div className="upper-right-vector"></div>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">SLACK</Link>
        </div>
      </nav>
      <div className="centered-container">
        <h1>Sign up</h1>
        <p className="sign-in-sugg">We suggest using the email address that you use at work</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              placeholder="E-mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <button type="submit">
            <p className='reg-p'>Register</p>
          </button>
        </form>
        <p className='askbro'>Already a member? <Link to="/signin" className="login-link">Log in</Link></p>
      </div>
      <SpaceRobot/>
    </PageLayout>
  );
};

export default SignUpPage;
