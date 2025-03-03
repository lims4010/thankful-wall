import React, { Fragment, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Wall from './components/posts/Wall';
import About from './components/about/About';
import PrivateRoute from './components/auth/PrivateRoute';
import AuthErrorHandler from './components/auth/AuthErrorHandler';

// Context
import { AppProvider, useAppContext } from './context/AppContext';
import './App.css';

// Auth0
import Auth0ProviderWithHistory from './auth/auth0-provider';
import { useAuth0 } from '@auth0/auth0-react';
import { setupAuthInterceptor } from './utils/auth-service';
import useAdminAuth from './hooks/useAdminAuth';

// Setup component to initialize auth interceptor
const AuthInterceptorSetup = () => {
  const { getAccessTokenSilently } = useAuth0();
  const { isAuthenticated, isLoading } = useAdminAuth();
  const { setAlert } = useAppContext();
  const hasAlertedRef = useRef(false);
  
  useEffect(() => {
    setupAuthInterceptor(getAccessTokenSilently);
  }, [getAccessTokenSilently]);

  useEffect(() => {
    // Only attempt to get token if authenticated as admin and not already alerted
    if (isAuthenticated && !isLoading && !hasAlertedRef.current) {
      getAccessTokenSilently({
        authorizationParams: {
          audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        }
      })
        .catch(err => {
          // Prevent multiple alerts for the same error
          if (!hasAlertedRef.current) {
            hasAlertedRef.current = true;
            
            // Show error message to user
            if (err.name === 'Missing Refresh Token') {
              setAlert('Session expired. Please log in again.', 'danger');
            } else if (err.name === 'Login Required') {
              setAlert('Authentication required. Please log in.', 'danger');
            } else {
              setAlert(`Authentication error: ${err.message}`, 'danger');
            }
          }
        });
    }
    
    // Reset the alert flag when authentication state changes
    if (!isAuthenticated) {
      hasAlertedRef.current = false;
    }
  }, [isAuthenticated, getAccessTokenSilently, isLoading, setAlert]);
  
  return null;
};

const App = () => {
  return (
    <AppProvider>
      <Router>
        <Auth0ProviderWithHistory>
          <Fragment>
            <AuthInterceptorSetup />
            <AuthErrorHandler />
            <Navbar />
            <section className="container">
              <Alert />
              <Routes>
                <Route path="/" element={<Wall />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
              </Routes>
            </section>
          </Fragment>
        </Auth0ProviderWithHistory>
      </Router>
    </AppProvider>
  );
};

export default App;
