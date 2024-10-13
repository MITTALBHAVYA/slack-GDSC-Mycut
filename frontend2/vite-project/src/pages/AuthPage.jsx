// AuthPage.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import ForgotPassword from '../components/auth/ForgotPassword';
import { useSelector } from 'react-redux';

const AuthPage = () => {
  const { token } = useSelector((state) => state.auth);

  // Redirect to /workspaces if already authenticated
  if (token) {
    return <Navigate to="/workspace" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <main className="w-full max-w-md space-y-8">
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="*" element={<Navigate to="login" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AuthPage;
