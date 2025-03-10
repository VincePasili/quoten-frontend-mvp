import React, { useState, useContext, forwardRef } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { checkInternetConnection } from '../utilities/api';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AuthContext  from '../contexts/AuthContext';
import AlertContext from '../contexts/AlertContext';

import logo from '../assets/logo/logo.png';
import Spinner from '../components/Spinner';


const SignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleSignIn } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const { showAlert } = useContext(AlertContext);

  const formik = useFormik({ 
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
                .email('Invalid email address')
                .max(40, 'Must be 40 characters or less')
                .required('Required'),
      password: Yup.string()
                .min(8, 'Must be at least 8 characters')
                .max(70, 'Must be 70 characters or less')
                .required('Required')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await login(values);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        showAlert({
          message: error.message,
          severity: 'error',
        });
      }
    }
  });


  const googleLogin = useGoogleLogin({
    onSuccess: async tokenResponse => {
      googleSignIn(tokenResponse.access_token);
    },
    onError: (error) => {
      showAlert({
        message: error.message,
        severity: 'error',
      });
    },
    ux_mode: 'popup'
  });

  const signIn = async () => {
    const isOnline = await checkInternetConnection();
    if(!isOnline){
      showAlert({
        message: "Internet issue detected. Check connection and retry.",
        severity: 'error',
      });
    } else {
      googleLogin();
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white" aria-label="Sign In Page">
      <div className="flex items-center mb-10" aria-label="Logo">
        <img src={logo} alt="Logo" className="h-20 w-50 mr-2" />
      </div>
      <div className="w-full max-w-xs">
        <h2 className="text-xl font-semibold mb-4 text-center" aria-label="Sign in header">Sign in</h2>
        <button 
          type='button'
          onClick={signIn}
          className="w-full bg-white border border-gray-300 rounded-md px-4 py-2 mb-4 flex items-center justify-center"
          aria-label="Sign in with Google"
        >
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 48 48" className="h-5 w-5 mr-2">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Continue with Google
        </button>
        <form onSubmit={formik.handleSubmit} aria-label="Sign in form">
          <div className="relative mb-4" aria-label="Email input container">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <input 
                type="email" 
                name="email" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.email}
                className={`w-full pl-10 pr-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-200'} rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Enter your work email address" 
                aria-label="Email address"
                aria-invalid={formik.touched.email && formik.errors.email ? "true" : "false"}
                aria-describedby="email-error"
              />
              {formik.touched.email && formik.errors.email ? 
                <div id="email-error" className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
            </div>
          </div>
          <div className="relative mb-4" aria-label="Password input container">
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" fill="currentColor" className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600">
                <path d="M 25 3 C 18.363281 3 13 8.363281 13 15 L 13 20 L 9 20 C 7.355469 20 6 21.355469 6 23 L 6 47 C 6 48.644531 7.355469 50 9 50 L 41 50 C 42.644531 50 44 48.644531 44 47 L 44 23 C 44 21.355469 42.644531 20 41 20 L 37 20 L 37 15 C 37 8.363281 31.636719 3 25 3 Z M 25 5 C 30.566406 5 35 9.433594 35 15 L 35 20 L 15 20 L 15 15 C 15 9.433594 19.433594 5 25 5 Z M 9 22 L 41 22 C 41.554688 22 42 22.445313 42 23 L 42 47 C 42 47.554688 41.554688 48 41 48 L 9 48 C 8.445313 48 8 47.554688 8 47 L 8 23 C 8 22.445313 8.445313 22 9 22 Z M 25 30 C 23.300781 30 22 31.300781 22 33 C 22 33.898438 22.398438 34.6875 23 35.1875 L 23 38 C 23 39.101563 23.898438 40 25 40 C 26.101563 40 27 39.101563 27 38 L 27 35.1875 C 27.601563 34.6875 28 33.898438 28 33 C 28 31.300781 26.699219 30 25 30 Z"></path>
              </svg>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.password}
                className={`w-full pl-10 pr-12 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border ${formik.touched.password && formik.errors.password ? 'border-red-500' : 'border-slate-200'} rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Enter your Password" 
                aria-label="Password"
                aria-invalid={formik.touched.password && formik.errors.password ? "true" : "false"}
                aria-describedby="password-error"
              />
              {formik.touched.password && formik.errors.password ? 
                <div id="password-error" className="relative text-red-500 text-xs mt-1">{formik.errors.password}</div> : null}
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute w-5 h-5 top-2.5 right-5 text-blue-800 font-semibold focus:outline-none text-xs"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
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
                <span>Signing In</span>
              </>              
            ) : (
              "Continue"
            )}
          </button>
          <a href="/forgot-password" className="block text-center text-blue-600 mt-2" aria-label="Forgot password link">Forgot password?</a>
          <p className="text-center text-sm text-gray-600 mt-4" aria-label="Sign up prompt">
            Don’t have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline" aria-label="Sign up link">Sign Up</a>
          </p>
          <p className="mt-4 text-center text-gray-600 text-sm" aria-label="Legal agreements">
            By proceeding, you agree to the <a href="/legal" className="text-blue-600" aria-label="Terms of Service">Terms of Service</a> and <a href="/legal" className="text-blue-600" aria-label="Privacy Policy">Privacy Policy</a>
          </p>
        </form>
      </div>   
    </div>
  );
};

export default SignIn;