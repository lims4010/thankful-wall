import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { hasAdminPermission } from '../utils/auth-service';
import { useAppContext } from '../context/AppContext';

/**
 * Custom hook to check if the user has admin permissions
 * This hook decodes the JWT token and checks for the admin scope
 * @returns {Object} Authentication state including isAdmin flag
 */
const useAdminAuth = () => {
  const { user, isAuthenticated: isAuth0Authenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);
  const { setAlert } = useAppContext();
  
  // Single alert flag to prevent multiple alerts
  const alertShown = useState(false)[0];
  
  useEffect(() => {
    let isMounted = true;
    
    const checkAdminPermission = async () => {
      if (!isAuth0Authenticated || !user) {
        if (isMounted) {
          setIsAdmin(false);
          setAdminCheckComplete(true);
        }
        return;
      }
      
      try {
        // Get the token claims to check permissions
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: process.env.REACT_APP_AUTH0_AUDIENCE,
          }
        });
        
        // Decode the token to get scope
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          const scope = payload.scope || '';
          const scopes = scope.split(' ');
          
          const adminStatus = scopes.includes('admin');
          
          if (isMounted) {
            setIsAdmin(adminStatus);
            
            // Show alert if user is not an admin
            if (!adminStatus && isAuth0Authenticated && !alertShown) {
              setAlert('Access denied: Only admin users are allowed to log in...refreshing in 2 seconds', 'danger');
              
              // Automatically log out non-admin users after showing the alert
              setTimeout(() => {
                if (isAuth0Authenticated) {
                  // Get the base URL (protocol + hostname) without path
                  const baseUrl = window.location.origin;
                  logout({ returnTo: baseUrl });
                }
              }, 2000);
            }
          }
        } else if (isMounted) {
          setIsAdmin(false);
        }
      } catch (error) {
        if (isMounted) {
          setIsAdmin(false);
        }
      }
      
      if (isMounted) {
        setAdminCheckComplete(true);
      }
    };

    checkAdminPermission();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [isAuth0Authenticated, user, getAccessTokenSilently, setAlert, logout, alertShown]);

  // Return isAuthenticated as true only if the user is an admin
  return {
    isAuthenticated: isAdmin && isAuth0Authenticated,
    isAdmin,
    user,
    isLoading: isLoading || !adminCheckComplete
  };
};

export default useAdminAuth; 