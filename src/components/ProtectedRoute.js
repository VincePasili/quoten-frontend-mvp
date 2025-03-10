// src/components/ProtectedRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { retrieveCsrfToken } from '../utilities/api';
import Cookies from 'js-cookie'

const ProtectedRoute = ({ children }) => {
  const token = retrieveCsrfToken();

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
