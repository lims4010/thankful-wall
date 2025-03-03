import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

// Global variable to track if an error has been handled
let errorHandled = false;

/**
 * Component to detect and handle Auth0 authentication errors
 * This component checks for error parameters in the URL that Auth0 might return
 * after a failed authentication attempt
 */
const AuthErrorHandler = () => {
  const location = useLocation();
  const { setAlert } = useAppContext();

  useEffect(() => {
    // Check URL for error parameters that Auth0 might return
    const urlParams = new URLSearchParams(location.search);
    const error = urlParams.get('error');
    const errorDescription = urlParams.get('error_description');
    
    // Only handle the error once
    if (error && !errorHandled) {
      errorHandled = true;
      
      // Show user-friendly error message
      let errorMessage = 'Authentication failed. Please try again.';
      
      // Customize message based on error type
      if (error === 'unauthorized') {
        errorMessage = 'You are not authorized to access this application.';
      } else if (error === 'access_denied') {
        errorMessage = 'Access denied. Please check your credentials and try again.';
      } else if (errorDescription) {
        // Use the error description if available
        errorMessage = errorDescription;
      }
      
      // Show error message to user
      setAlert(errorMessage, 'danger');
      
      // Reset the error handled flag after some time
      setTimeout(() => {
        errorHandled = false;
      }, 5000);
    } else if (!error) {
      // Reset the flag when there's no error
      errorHandled = false;
    }
  }, [location, setAlert]);

  // This component doesn't render anything
  return null;
};

export default AuthErrorHandler; 