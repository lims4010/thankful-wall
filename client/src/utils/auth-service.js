import axios from 'axios';

// Add a request interceptor to add the auth token to requests
const setupAuthInterceptor = (getAccessTokenSilently) => {
  // Remove any existing interceptors to avoid duplicates
  axios.interceptors.request.eject(axios.interceptors.request.handlers?.[0]);
  
  axios.interceptors.request.use(
    async (config) => {
      // For API calls to our backend, add the token
      if (config.url.startsWith('/api')) {
        try {
          // Get the token silently
          const token = await getAccessTokenSilently();
          
          // Add the token to the Authorization header
          config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          // Silent fail - the API call will proceed without the token
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

// Check if the user has admin permissions
const hasAdminPermission = (user) => {
  if (!user) return false;
  
  // Check scope from the token
  if (user.scope) {
    const scopes = user.scope.split(' ');
    return scopes.includes('admin');
  }
  
  return false;
};

export { setupAuthInterceptor, hasAdminPermission }; 