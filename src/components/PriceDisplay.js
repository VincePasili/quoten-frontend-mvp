import React from 'react';
import { FiDollarSign } from 'react-icons/fi';

const PriceDisplay = ({ finalPrice, billingCycle }) => {
  return (
    <div className="mt-4 flex items-center gap-2">
      <FiDollarSign className="text-gray-600" />
      <span className="text-2xl font-semibold text-gray-700">
        ${finalPrice}
      </span>
      <span className="text-sm text-gray-500">
        {billingCycle === 'monthly' ? '/month' : '/year'}
      </span>
    </div>
  );
};

export default PriceDisplay;