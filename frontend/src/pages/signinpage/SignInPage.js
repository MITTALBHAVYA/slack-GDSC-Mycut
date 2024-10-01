import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from 'react-google-login';
import axios from 'axios';
import PageLayout from '../../components/PageLayout';
import SpaceRobot from '../../components/SpaceRobot/SpaceRobot';
import '../../style/style.css';
import './SignInPage.css';

const SignInPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const apiUrl = 'http://localhost:8080/api/v1/auth/signin';

  const responseGoogle = (googleData) => {
    handleSubmit(null, true, googleData);
  };

  const { signIn } = useGoogleLogin({
    onSuccess: responseGoogle,
    onFailure: responseGoogle,
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google Client ID
    isSignedIn: true,
  });

  const handleSubmit = async (e, isGoogleSignIn, googleData) => {
    e && e.preventDefault();

    try {
      if (isGoogleSignIn) {
        const response = await axios.post(apiUrl, { tokenId: googleData.tokenId });
        console.log('Google Sign-In successful', response.data);
      } else {
        // Handle email-based sign-in
        const response = await axios.post(apiUrl, formData);
        console.log('Email-based Sign-In successful', response.data);
      }

      // Redirect to dashboard after successful sign-in
      navigate('/dashboard');
    } catch (error) {
      console.error('Sign-In failed', error);
    }
  };

  return (
    <PageLayout>
      <div className="upper-right-vector"></div>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">SLACK</Link>
        </div>
        <div className="signin-nav-func">
          <div className='question'>New to slack?</div>
          <div className='links_signup'>
            <Link to="/signup">Create an account</Link>
          </div>
        </div>
      </nav>
      <div className="centered-container">
        <h1 className='signin-msg'>Sign in to Slack</h1>
        <p className='signin-sugg'>We suggest using the email address that you use at work</p>
      <button onClick={signIn} className='signin-ggl'>
        <img src='./images/google_icon.png' alt='G' className='gimg' />
        <span className='sgnggl'>Sign in with Google</span>
      </button>
      <span className='or'>OR</span>
      <form onSubmit={(e) => handleSubmit(e, false)}>
        <input
            type="text"
            placeholder="name@workemail.com"
            className="signin-email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        <button type="submit" className="sub-btn">Sign in with Email</button>
      </form>
      </div>
      <SpaceRobot/>
    </PageLayout>
  );
};

export default SignInPage;
