import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../auth/LogoutButton';
import useAdminAuth from '../../hooks/useAdminAuth';

const Navbar = () => {
  const { isAuthenticated, isAdmin, isLoading } = useAdminAuth();

  const adminLinks = (
    <ul>
      <li>
        <span className="admin-badge">Admin</span>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <LogoutButton />
      </li>
    </ul>
  );
  
  const guestLinks = (
    <ul>
      <li>
        <Link to="/about">About</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );
  
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-signature"></i> Thankful Wall
        </Link>
      </h1>

      {!isLoading && (
        <Fragment>
          {isAuthenticated ? adminLinks : guestLinks}
        </Fragment>
      )}
    </nav>
  );
};

export default Navbar;
