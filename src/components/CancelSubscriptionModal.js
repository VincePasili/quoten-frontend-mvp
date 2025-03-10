import React from 'react';
import { useCancelSubscriptionMutation } from '../utilities/api';

const CancelSubscriptionModal = ({ onClose }) => {
  const { cancelSubscriptionMutate, isCancelling, isError, error } = useCancelSubscriptionMutation();

  const breakText = (text, width) =>
    text.split(' ').reduce((acc, word) => {
      if (!acc.length || acc[acc.length - 1].length + word.length + 1 > width / 8) {
        acc.push(word);
      } else {
        acc[acc.length - 1] += ' ' + word;
      }
      return acc;
    }, []).join('\n');

  const handleCancel = () => {
    cancelSubscriptionMutate(null, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 transform transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <svg className="h-6 w-6 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Cancel Subscription
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 focus:outline-none">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {isError && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center">
            <svg className="h-5 w-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error.message}</span>
          </div>
        )}
        <div className="bg-yellow-50 rounded-lg p-4 mb-6 flex items-start">
          <svg className="h-5 w-5 text-yellow-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-gray-700 whitespace-pre-line">
            {breakText('Are you sure you want to cancel? You will lose all premium benefits upon cancellation.', 400)}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={handleCancel}
            disabled={isCancelling}
            className={`bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center justify-center ${isCancelling ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isCancelling ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cancelling...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Confirm Cancellation
              </>
            )}
          </button>
          <button
            onClick={onClose}
            disabled={isCancelling}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelSubscriptionModal;