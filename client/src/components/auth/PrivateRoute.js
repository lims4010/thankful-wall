import React from 'react';
import { Navigate } from 'react-router-dom';
import useAdminAuth from '../../hooks/useAdminAuth';

// This component will render the protected component if authenticated
// For admin routes, it will also check for admin status
const PrivateRoute = ({ component: Component, requireAdmin = false, ...args }) => {
  const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();
  
  if (isLoading) {
    return <div className="container"><p>Loading...</p></div>;
  }
  
  // For admin routes, check both authentication and admin status
  if (requireAdmin) {
    return isAuthenticated && isAdmin ? 
      <Component {...args} /> : 
      <Navigate to="/login" />;
  }
  
  // For regular protected routes, just check authentication
  return isAuthenticated ? 
    <Component {...args} /> : 
    <Navigate to="/login" />;
};

export default PrivateRoute; 