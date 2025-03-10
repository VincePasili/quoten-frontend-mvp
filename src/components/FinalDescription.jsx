import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const FinalDescription = ({ onSubmit, onBack }) => {
  const formik = useFormik({
    initialValues: {
      finalDescription: '',
    },
    validationSchema: Yup.object({
      finalDescription: Yup.string()
        .max(1500, 'Description can be at most 1500 characters'),
    }),
    onSubmit: (values) => {
      onSubmit(values.finalDescription);
    },
  });

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Final Description:</label>
          <textarea
            name="finalDescription"
            value={formik.values.finalDescription}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
          />
          {formik.touched.finalDescription && formik.errors.finalDescription ? (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.finalDescription}
            </div>
          ) : null}
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Submit
        </button>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md ml-4"
        >
          Back
        </button>
      </form>
    </div>
  );
};

export default FinalDescription;
