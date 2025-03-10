import React from 'react';

const CurrentQuoteTemplate = ({ activeTemplate, onManageTemplates }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-xl shadow-card">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Current Quote Template
      </h3>
    
      <div className="mb-6 text-center">
        {activeTemplate ? (
          <div>
            <p className="text-gray-700 font-medium">{activeTemplate.name}</p>
            <p className="mt-1 text-gray-500">{activeTemplate.description}</p>
            {activeTemplate.previewImage && (
              <img
                src={activeTemplate.previewImage}
                alt={activeTemplate.name}
                className="mt-4 mx-auto w-full h-48 object-cover rounded-md border border-gray-200"
              />
            )}
          </div>
        ) : (
          <div className="py-8">
            <p className="text-gray-500 italic">Default template selected</p>
          </div>
        )}
      </div>
    
      <div className="flex justify-center">
        <button 
          onClick={onManageTemplates}
          className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Manage Templates
        </button>
      </div>
    </div>
  );
};

export default CurrentQuoteTemplate;
