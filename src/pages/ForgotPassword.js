import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import AlertContext from '../contexts/AlertContext';
import logo from '../assets/logo/logo.png';
import { requestPasswordReset } from '../utilities/api';

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { showAlert } = useContext(AlertContext);
  const formik = useFormik({ 
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
                .email('Invalid email address')
                .max(40, 'Must be 40 characters or less')
                .required('Required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await requestPasswordReset(values);
        setIsLoading(false);
        showAlert({
          message: response.message,
          severity: 'success',
        });
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-white" role="main">
      <div className="flex items-center mb-10">
        <img src={logo} alt="Company Logo" className="h-20 w-50 mr-2" />
      </div>
      <div className="w-full max-w-xs">
        <h2 className="text-xl font-semibold mb-4 text-center" aria-label="Forgot your password?">Forgot your password?</h2>
        <form onSubmit={formik.handleSubmit} aria-label="Forgot Password Form">
          <div className="relative mb-4" role="group" aria-labelledby="email-label">
            <label id="email-label" htmlFor="email" className="sr-only">Email address</label>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
              <input 
                type="email" 
                name="email" 
                id="email"
                onChange={formik.handleChange} 
                onBlur={formik.handleBlur} 
                value={formik.values.email}
                className={`w-full pl-10 pr-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-slate-200'} rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
                placeholder="Enter your work email address" 
                aria-required="true"
                aria-invalid={formik.touched.email && formik.errors.email ? "true" : "false"}
                aria-describedby="email-error"
              />
              {formik.touched.email && formik.errors.email ? 
                <div id="email-error" className="text-red-500 text-xs mt-1" role="alert">{formik.errors.email}</div> : null}
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
                <span>Processing</span>
              </>              
            ) : (
              "Continue"
            )}
          </button>
          <a href="/" className="block text-center text-blue-600 mt-2" aria-label="Go to sign in page">Sign In</a>
  
          <p className="mt-4 text-center text-gray-600 text-sm">
            By proceeding, you agree to the <a href="#" className="text-blue-600" aria-label="Terms of Service">Terms of Service</a> and <a href="#" className="text-blue-600" aria-label="Privacy Policy">Privacy Policy</a>
          </p>
        </form>
      </div>     
    </div>
  );
};

export default ForgotPassword;