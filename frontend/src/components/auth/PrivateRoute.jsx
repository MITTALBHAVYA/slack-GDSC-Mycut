// PrivateRoute.jsx
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ children }) => {
  const {token} = useSelector((state)=>state.auth);
  if(token){
    try{
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now()/1000;
      
      if(decodedToken.exp < currentTime){
        console.log("Token expired. Logging out...");
        localStorage.removeItem('token');
        return <Navigate to="/auth/login" replace/>;
      }
    }catch(error){
      console.error("Error decoding token: ",error);
      localStorage.removeItem('token');
      return <Navigate to="/auth/login" replace/>;
    }
  }
  return token ? children : <Navigate to="/auth/login" replace/>;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired, 
};

export default PrivateRoute;
