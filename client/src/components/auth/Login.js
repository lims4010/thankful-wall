import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import useAdminAuth from '../../hooks/useAdminAuth';

const Login = () => {
  const { loginWithRedirect, error: auth0Error } = useAuth0();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { setAlert } = useAppContext();
  const location = useLocation();

  // Handle Auth0 errors
  useEffect(() => {
    if (auth0Error) {
      setAlert(auth0Error.message || 'Authentication error. Please try again.', 'danger');
    }
  }, [auth0Error, setAlert]);

  // If loading, show a loading message
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If already authenticated as admin, redirect to home
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  // Handle login with additional parameters
  const handleLogin = () => {
    loginWithRedirect({
      appState: { returnTo: location.state?.from?.pathname || '/' }
    });
  };

  return (
    <div className="login-container">
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Sign into your account
      </p>
      <div className="alert alert-info">
        <p>Note: Only admin users can access the authenticated experience.</p>
      </div>
      <button 
        onClick={handleLogin} 
        className="btn btn-primary"
      >
        Log In with Auth0
      </button>
    </div>
  );
};

export default Login;
