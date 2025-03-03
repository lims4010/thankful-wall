import React from 'react';
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Auth0ProviderWithHistory = ({ children }) => {
  const navigate = useNavigate();
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;
  
  // Get the base URL (protocol + hostname) without path
  const baseUrl = window.location.origin;

  // Handle redirect callback
  const onRedirectCallback = (appState) => {
    // Navigate to the intended destination
    navigate(appState?.returnTo || window.location.pathname);
  };

  if (!domain || !clientId || !audience) {
    return <div>Error: Auth0 configuration is incomplete. Check environment variables.</div>;
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      redirectUri={baseUrl}
      onRedirectCallback={onRedirectCallback}
      audience={audience}
      cacheLocation="localstorage"
      useRefreshTokens={true}
      authorizationParams={{
        audience: audience,
        redirect_uri: baseUrl,
        scope: 'openid profile email read:admin write:admin admin'
      }}
    >
      {children}
    </Auth0Provider>
  );
};

export default Auth0ProviderWithHistory; 