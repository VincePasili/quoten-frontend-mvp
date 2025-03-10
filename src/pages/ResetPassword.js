import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import AlertContext from '../contexts/AlertContext';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import Spinner from '../components/Spinner';

import logo from '../assets/logo/logo.png';
import { resetPassword } from '../utilities/api';


const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });
  const [token, setToken] = useState(''); 
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const { showAlert } = useContext(AlertContext);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const resetToken = searchParams.get('token');
    
    if (resetToken) {
      setToken(resetToken);
    } 
    else {
      navigate(process.env.REACT_APP_SIGNIN_ROUTE);
    }

  }, [location, navigate]);

  const formik = useFormik({ 
    initialValues: {
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
                      .min(6, 'Password must be at least 6 characters')
                      .required('Required'),
      confirmPassword: Yup.string()
                           .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
                           .required('Required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await resetPassword({ ...values, token });
        setIsLoading(false);
        showAlert({
          message: response.message || 'Password reset successfully!',
          severity: 'success',
        });
        // Delay navigation for the message to be displayed
        setTimeout(() => {
          navigate(process.env.REACT_APP_SIGNIN_ROUTE);
        }, 4000);

      } catch (error) {
        setIsLoading(false);
        showAlert({
          message: error.message || 'An error occurred while resetting the password.',
          severity: 'error',
        });
      }
    }
  });


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <div className="flex items-center mb-10">
        <img src={logo} alt="Logo" className="h-20 w-50 mr-2" />
      </div>
      <div className="w-full max-w-xs">
        <h2 className="text-xl font-semibold mb-4 text-center">Reset your password</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* New Password Field */}
          <div className="relative mb-4">
            <div className="relative">
              <input 
                type={showPassword.newPassword ? "text" : "password"} 
                name="newPassword" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.newPassword}
                aria-label="New Password" 
                aria-required="true" 
                aria-invalid={formik.touched.newPassword && formik.errors.newPassword ? "true" : "false"} 
                aria-describedby="newPasswordError" 
                className={`w-full pl-10 pr-12 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border ${formik.touched.newPassword && formik.errors.newPassword ? 'border-red-500' : 'border-slate-200'} rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="New Password" 
              />
              {formik.touched.newPassword && formik.errors.newPassword ? (
                <div 
                  id="newPasswordError" 
                  role="alert" 
                  className="relative text-red-500 text-xs mt-1">
                  {formik.errors.newPassword}
                </div>
              ) : null}
              <button 
                type="button" 
                onClick={() => setShowPassword({ ...showPassword, newPassword: !showPassword.newPassword })}
                aria-label={showPassword.newPassword ? "Hide Password" : "Show Password"}
                className="absolute w-5 h-5 top-2.5 right-5 text-blue-800 font-semibold focus:outline-none text-xs"
              >
                {showPassword.newPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
            
          {/* Confirm Password Field */}
          <div className="relative mb-4">
            <div className="relative">
              <input 
                type={showPassword.confirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.confirmPassword}
                aria-label="Confirm Password" 
                aria-required="true" 
                aria-invalid={formik.touched.confirmPassword && formik.errors.confirmPassword ? "true" : "false"} 
                aria-describedby="confirmPasswordError" 
                className={`w-full pl-10 pr-12 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Confirm Password" 
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <div 
                  id="confirmPasswordError" 
                  role="alert" 
                  className="relative text-red-500 text-xs mt-1">
                  {formik.errors.confirmPassword}
                </div>
              ) : null}
              <button 
                type="button" 
                onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}
                aria-label={showPassword.confirmPassword ? "Hide Password" : "Show Password"}
                className="absolute w-5 h-5 top-2.5 right-5 text-blue-800 font-semibold focus:outline-none text-xs"
              >
                {showPassword.confirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
            
          <button
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin-slow" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                    <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                    </path>
                </svg>
                <span>Submitting</span>
              </>              
            ) : (
              "Submit"
            )}
          </button>
            
          <a 
            href="/" 
            className="block text-center text-blue-600 mt-2"
            aria-label="Go back to Sign In page"
          >
            Sign In
          </a>
  
          <p className="mt-4 text-center text-gray-600 text-sm">
            By proceeding, you agree to the <a href="#" className="text-blue-600">Terms of Service</a> and <a href="#" className="text-blue-600">Privacy Policy</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;