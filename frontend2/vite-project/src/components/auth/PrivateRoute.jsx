// PrivateRoute.jsx
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);

  return token ? children : <Navigate to="/auth/login" replace />;
};

// Define prop types
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default PrivateRoute;
