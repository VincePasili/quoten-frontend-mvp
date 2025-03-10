import React, { useState, useContext, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom'; 
import AlertContext from '../contexts/AlertContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from '../utilities/api';

import logo from '../assets/logo/logo.png';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  
  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
                   .required('Required'),
      email: Yup.string()
                .email('Invalid email address')
                .max(40, 'Must be 40 characters or less')
                .required('Required'),
      password: Yup.string()
                   .min(8, 'Must contain at least 8 characters')
                   .max(70, 'Must be 70 characters or less')
                   .required('Required'),
      confirmPassword: Yup.string()
                          .oneOf([Yup.ref('password'), null], 'Passwords must match')
                          .required('Required')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await registerUser(values);
        setIsLoading(false);
        showAlert({
          message: response.message || 'Account created successfully!',
          severity: 'success',
        });

        // Delay navigation for the message to be displayed
        setTimeout(() => {
          navigate(process.env.REACT_APP_SIGNIN_ROUTE);
        }, 4000);

      } catch (error) {
        setIsLoading(false);
        showAlert({
          message: error.message,
          severity: 'error',
        });
      }
    }
  });

  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white" aria-label="Sign Up Page">
      <div className="flex items-center mb-10" aria-label="Logo">
        <img src={logo} alt="Logo" className="h-20 w-50 mr-2" />
      </div>
      <div className="w-full max-w-xs">
        <h2 className="text-xl font-semibold mb-4 text-center" aria-label="Sign Up header">Create your account</h2>
        <form onSubmit={formik.handleSubmit} aria-label="Sign Up form">
          <div className="mb-4" aria-label="Full name input container">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input 
              type="text" 
              name="fullName" 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              value={formik.values.fullName}
              className={`w-full p-2 border ${formik.touched.fullName && formik.errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your full name" 
              aria-label="Full name"
              aria-invalid={formik.touched.fullName && formik.errors.fullName ? "true" : "false"}
              aria-describedby="fullName-error"
            />
            {formik.touched.fullName && formik.errors.fullName ? 
              <div id="fullName-error" className="text-red-500 text-xs mt-1">{formik.errors.fullName}</div> : null}
          </div>
          <div className="mb-4" aria-label="Email input container">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur} 
              value={formik.values.email}
              className={`w-full p-2 border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter your work email address" 
              aria-label="Email address"
              aria-invalid={formik.touched.email && formik.errors.email ? "true" : "false"}
              aria-describedby="email-error"
            />
            {formik.touched.email && formik.errors.email ? 
              <div id="email-error" className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
          </div>
          <div className="mb-4 relative" aria-label="Password input container">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Create Password</label>
            <div className="relative">
              <input 
                type={showPassword.password ? "text" : "password"} 
                name="password" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.password}
                className={`w-full p-2 pr-12 border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Must contain at least 8 characters" 
                aria-label="Password"
                aria-invalid={formik.touched.password && formik.errors.password ? "true" : "false"}
                aria-describedby="password-error"
              />
              {formik.touched.password && formik.errors.password ? 
                <div id="password-error" className="text-red-500 text-xs mt-1">{formik.errors.password}</div> : null}
              <button 
                type="button" 
                onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
                className="absolute w-5 h-5 top-2.5 right-5 text-blue-800 font-semibold focus:outline-none text-xs"
                aria-label={showPassword.password ? "Hide password" : "Show password"}
              >
                {showPassword.password ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          <div className="mb-4 relative" aria-label="Confirm Password input container">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input 
                type={showPassword.confirmPassword ? "text" : "password"} 
                name="confirmPassword" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.confirmPassword}
                className={`w-full p-2 pr-12 border ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                placeholder="Confirm password" 
                aria-label="Confirm Password"
                aria-invalid={formik.touched.confirmPassword && formik.errors.confirmPassword ? "true" : "false"}
                aria-describedby="confirmPassword-error"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? 
                <div id="confirmPassword-error" className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div> : null}
              <button 
                type="button" 
                onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}
                className="absolute w-5 h-5 top-2.5 right-5 text-blue-800 font-semibold focus:outline-none text-xs"
                aria-label={showPassword.confirmPassword ? "Hide confirm password" : "Show confirm password"}
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
                <span>Signing Up</span>
              </>              
            ) : (
              "Sign Up"
            )}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm" aria-label="Legal agreements">
          By proceeding, you agree to the <a href="#" className="text-blue-600" aria-label="Terms of Service">Terms of Service</a> and <a href="#" className="text-blue-600" aria-label="Privacy Policy">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;