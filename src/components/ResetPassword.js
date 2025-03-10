import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { resetPassword } from '../utilities/api';

const ResetPasswordForm = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      newPassword: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .max(40, 'Must be 40 characters or less')
        .required('Required'),
      newPassword: Yup.string()
        .min(6, 'Must be at least 6 characters')
        .max(70, 'Must be 70 characters or less')
        .required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Required')
    }),
    onSubmit: async (values) => {
      try {
        await resetPassword({
          email: values.email,
          newPassword: values.newPassword
        });
        alert('Password reset successfully');
      } catch (error) {
        alert(error.message);
      }
    }
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 w-full" aria-label="Reset Password Form">
      <div className="relative z-0 w-full mb-5 group" role="group" aria-labelledby="email-label">
        <label id="email-label" htmlFor="email" className="sr-only">Email address</label>
        <input
          type="email"
          name="email"
          id="email"
          className={`block py-2.5 px-0 w-full text-sm ${formik.touched.email && formik.errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
          placeholder=" "
          {...formik.getFieldProps('email')}
          aria-required="true"
          aria-invalid={formik.touched.email && formik.errors.email ? "true" : "false"}
          aria-describedby="email-error"
        />
        <label htmlFor="email" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Email address
        </label>
        {formik.touched.email && formik.errors.email ? (
          <div id="email-error" className="text-red-500 text-xs mt-1" role="alert">{formik.errors.email}</div>
        ) : null}
      </div>
      <div className="relative z-0 w-full mb-5 group" role="group" aria-labelledby="newPassword-label">
        <label id="newPassword-label" htmlFor="newPassword" className="sr-only">New Password</label>
        <input
          type="password"
          name="newPassword"
          id="newPassword"
          className={`block py-2.5 px-0 w-full text-sm ${formik.touched.newPassword && formik.errors.newPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
          placeholder=" "
          {...formik.getFieldProps('newPassword')}
          aria-required="true"
          aria-invalid={formik.touched.newPassword && formik.errors.newPassword ? "true" : "false"}
          aria-describedby="newPassword-error"
        />
        <label htmlFor="newPassword" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          New Password
        </label>
        {formik.touched.newPassword && formik.errors.newPassword ? (
          <div id="newPassword-error" className="text-red-500 text-xs mt-1" role="alert">{formik.errors.newPassword}</div>
        ) : null}
      </div>
      <div className="relative z-0 w-full mb-5 group" role="group" aria-labelledby="confirmPassword-label">
        <label id="confirmPassword-label" htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          className={`block py-2.5 px-0 w-full text-sm ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 bg-transparent border-0 border-b-2 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
          placeholder=" "
          {...formik.getFieldProps('confirmPassword')}
          aria-required="true"
          aria-invalid={formik.touched.confirmPassword && formik.errors.confirmPassword ? "true" : "false"}
          aria-describedby="confirmPassword-error"
        />
        <label htmlFor="confirmPassword" className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">
          Confirm Password
        </label>
        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
          <div id="confirmPassword-error" className="text-red-500 text-xs mt-1" role="alert">{formik.errors.confirmPassword}</div>
        ) : null}
      </div>
      <button
        type="submit"
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        aria-label="Submit Reset Password"
      >
        Reset Password
      </button>
    </form>
  );
};

export default ResetPasswordForm;