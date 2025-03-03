import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    // Get the base URL (protocol + hostname) without path
    const baseUrl = window.location.origin;
    logout({ returnTo: baseUrl });
  };

  return (
    <button
      className="btn btn-danger"
      onClick={handleLogout}
    >
      Log Out
    </button>
  );
};

export default LogoutButton; 