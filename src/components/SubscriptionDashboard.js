import React, {useEffect, useState, useContext} from 'react';
import { useSearchParams } from 'react-router-dom';
import UpgradeModal from './UpgradeModal';
import CancelSubscriptionModal from './CancelSubscriptionModal';
import { useSubscriptionStatus, verifyStripeSession, useUpdatePaymentMethodMutation } from '../utilities/api';
import AlertContext from "../contexts/AlertContext";

const toSentenceCase = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const breakText = (text, width) => text.split(' ').reduce((acc, word) => {
  if (!acc.length || acc[acc.length - 1].length + word.length + 1 > width) {
    acc.push(word);
  } else {
    acc[acc.length - 1] += ' ' + word;
  }
  return acc;
}, []).join('\n');



const getBreakpoint = () => {
  const width = window.innerWidth;
  if (width < 640) return 32;  // Mobile
  if (width < 1024) return 60; // Tablet
  return 90;                   // Desktop
};


const SubscriptionDashboard = () => {
  const { showAlert } = useContext(AlertContext);
  const [showUpgradeModal, setShowUpgradeModal] = React.useState(false);
  const [showCancelModal, setShowCancelModal] = React.useState(false);
  const { subscription, isLoading, isError, error, rawTimeRemaining, formattedTimeRemaining, downgraded } = useSubscriptionStatus();

  const [paymentMethod, setPaymentMethod] = useState('');
  const { updatePaymentMethodMutate, isUpdating } = useUpdatePaymentMethodMutation();
  
  const [isWorking, setIsWorking] = React.useState(false)
  
  const handleUpdate = () => {
    setIsWorking(true);
    updatePaymentMethodMutate(paymentMethod);
    console.log(isWorking);
  };

  // Applying word wrap responsively for the subscription downgrade warning
  const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState(getBreakpoint());
  
    useEffect(() => {
      const handleResize = () => setBreakpoint(getBreakpoint());
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
  
    return breakpoint;
  };

  const charLimit = useBreakpoint();

  const [searchParams] = useSearchParams();


  useEffect(() => {
    const status = searchParams.get('status');
    const sessionId = searchParams.get('session_id');
  
    if (status === 'success' && sessionId) {
      verifyStripeSession(sessionId).then(() => {
        sessionStorage.setItem("showSuccessAlert", "true");
        window.history.replaceState({}, '', window.location.pathname);
        window.location.reload();
      });
    } else if (status === 'canceled') {
      sessionStorage.setItem("showCancelAlert", "true");
      window.history.replaceState({}, '', window.location.pathname);
      window.location.reload();
    }
  }, []);
  
  useEffect(() => {
    if (sessionStorage.getItem("showSuccessAlert") === "true") {
      showAlert({
        message: "Plan upgraded successfully.",
        severity: 'success'
      });
      sessionStorage.removeItem("showSuccessAlert");
    }
  
    if (sessionStorage.getItem("showCancelAlert") === "true") {
      showAlert({
        message: "Process canceled successfully.",
        severity: 'success'
      });
      sessionStorage.removeItem("showCancelAlert");
    }
  }, []);
  

  const freeTierLimits = [
    { label: 'Team Members', limit: 'Up to 1' },
    { label: 'Projects', limit: 'Up to 3' },
    { label: 'Quotes', limit: 'Up to 3' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Loading subscription details...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">Error: {error.message}</p>
      </div>
    );
  }

  const isFreePlan = subscription?.name === 'free';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {rawTimeRemaining !== 0 && !isFreePlan && !downgraded && (
          <div className="bg-red-500 text-white text-center py-3 px-4 rounded-md mb-6">
            <pre className="text-sm font-medium break-all">
              {breakText(`Action Required: Your plan will be downgraded in ${formattedTimeRemaining} unless payment is updated.`, charLimit)}
            </pre>

          </div>
        )}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Subscription Details</h2>

            {subscription && (
              <div className="space-y-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Current Plan</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900">
                        {toSentenceCase(subscription.name)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Status</dt>
                      <dd className="mt-1 text-lg font-semibold text-gray-900 capitalize">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            subscription.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {subscription.status || 'active'}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">What's Included</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    {isFreePlan ? (
                      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {freeTierLimits.map((item, index) => (
                          <li key={index} className="flex items-center">
                            <svg
                              className="h-5 w-5 text-blue-500 mr-2"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            <span className="text-gray-700">
                              <strong>{item.label}:</strong> {item.limit}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-center py-2">
                        <p className="text-gray-700 font-medium">Unlimited Access</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  {isFreePlan ? (
                    <button
                      onClick={() => setShowUpgradeModal(true)}
                      className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Upgrade to Premium
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => handleUpdate()}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      >
                        Update Payment Method
                      </button>
                      <button
                        onClick={() => setShowCancelModal(true)}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Cancel Subscription
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showUpgradeModal && <UpgradeModal onClose={() => setShowUpgradeModal(false)} />}
      {showCancelModal && <CancelSubscriptionModal onClose={() => setShowCancelModal(false)} />}
    </div>
  );
};

export default SubscriptionDashboard;
