import React from 'react';
import { useInitiateCheckoutMutation } from '../utilities/api';
import { plans } from '../components/SubscriptionPlans';

const UpgradeModal = ({ onClose }) => {
  const [selectedPlan] = React.useState('premium');
  const { initiateCheckoutMutate, isInitiating, isError, error } = useInitiateCheckoutMutation();

  const handleUpgrade = () => {
    initiateCheckoutMutate(selectedPlan);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-8 transform transition-all">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Upgrade to {plans[selectedPlan].label}
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
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg text-gray-700">
              Price: <span className="font-semibold text-gray-900">$ {plans[selectedPlan].priceMonthly}</span> / month
            </p>
          </div>
          <ul className="space-y-3">
            {plans[selectedPlan].features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg className="h-5 w-5 text-green-500 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={handleUpgrade}
            disabled={isInitiating}
            className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center ${isInitiating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isInitiating ? (
              <>
                <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin-slow" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                  <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5z"></path>
                </svg>
              </>
            ) : (
              <>                     
              {'Proceed to Payment'}
            </>)}
          </button>
          
          <button
            onClick={onClose}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;