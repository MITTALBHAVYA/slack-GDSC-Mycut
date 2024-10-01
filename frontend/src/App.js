import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landingpage/LandingPage';
import SignUpPage from './pages/signuppage/SignUpPage';
import SignInPage from './pages/signinpage/SignInPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/signin" element={<SignInPage />} />
      </Routes>
    </Router>
  );
};

export default App;