// AuthPage.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import ResetPassword from '../components/auth/ResetPassword';
import { useSelector } from 'react-redux';
// import PageLayout from '../components/layout/PageLayout.jsx';

const AuthPage = () => {
  const { token } = useSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/workspace" replace />;
  }

  return (
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="*" element={ <Navigate to="/auth/login" replace />} />
      </Routes>
  );
};

export default AuthPage;
