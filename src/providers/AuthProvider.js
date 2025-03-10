// src/contexts/AuthProvider.js
import React, { useState, useContext, useEffect } from 'react';
import AuthContext from '../contexts/AuthContext';
import { loginUser, fetchCsrfToken, googleOAuth, deleteCSRFToken, useUserData } from '../utilities/api';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import AlertContext from '../contexts/AlertContext';

const AuthProvider = ({ children }) => {
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const setCSRFToken = async () => {
    try {
      const { csrfToken } = await fetchCsrfToken();
      
      const isProduction = process.env.NODE_ENV === "production";
      const expiresInDays = process.env.REACT_APP_CSRF_EXPIRATION_HOURS / 24;
  
      Cookies.set(process.env.REACT_APP_CSRF_TOKEN_COOKIE_NAME, csrfToken, { 
        expires: expiresInDays,
        secure: isProduction, 
        sameSite: isProduction ? 'Strict' : 'Lax', 
      });
  
      return true; // Return success
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
      return false; // Return failure
    }
  };
  
  const setTokenAndRedirect = async (data) => {
    setUser(data);
    const csrfSuccess = await setCSRFToken();
    if (!csrfSuccess) return;
  
    navigate('/dashboard');
  };
 
  
  const handleAuthResponse = (data) => {
    if (!data) {
      throw new Error('Login failed! Please try again.');
    }
    
    if (data.success) {     
      setTokenAndRedirect(data);
    } else {
      throw new Error(data.error || 'Login failed! Please try again.');
    }
  };

  const login = async (credentials) => {
    try {
      const data = await loginUser(credentials);
      handleAuthResponse(data);
      showAlert({
        message: "Signed In Successfully.",
        severity: 'success',
      });
    } catch (error) {
      showAlert({
        message: error.message,
        severity: 'error',
      });
    }
  };

  const googleSignIn = async (access_token) => {
    try {
      const data = await googleOAuth(access_token);
      handleAuthResponse(data);
      showAlert({
        message: "Signed In Successfully.",
        severity: 'success',
      });
    } catch (error) {
      showAlert({
        message: error.message,
        severity: 'error',
      });
    }
  };

  const logout = () => {
    setUser(null);
    deleteCSRFToken();
    showAlert({
      message: "You are logged out.",
      severity: 'success',
    });
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{user, login, googleSignIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
