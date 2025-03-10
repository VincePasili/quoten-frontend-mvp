import React, { useState } from 'react';
import '@fontsource/inter';
import APIKeys from './APIKeys';
import QuoteCustomization from './QuoteCustomization';
import CurrentQuoteTemplate from './CurrentQuoteTemplate';
import TemplateSelection from './TemplateSelection';

const Resources = () => {
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null); // Holds the PDF URL

  const handleManageTemplates = () => {
    setShowTemplateSelection(true);
  };

  const handleCloseTemplateSelection = () => {
    setShowTemplateSelection(false);
  };

  const handleClosePdfViewer = () => {
    setPdfUrl(null); // Unset PDF URL when closed
  };

  return (
    <>
      {pdfUrl ? (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-lg shadow-lg p-4">
            <button
              onClick={handleClosePdfViewer}
              className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            >
              Close
            </button>
            <iframe src={pdfUrl} className="w-full h-full" title="About Us PDF" />
          </div>
        </div>
      ) : showTemplateSelection ? (
        <TemplateSelection onClose={handleCloseTemplateSelection} />
      ) : (
        <div className="p-6 w-full font-inter overflow-y-auto max-h-[80vh]" role="main" aria-label="Resources">
          <div className="space-y-6">
            {/* APIKeys Section */}
            <div id="api-keys" className="bg-white rounded-xl shadow-card p-6 lg:p-8">
              <APIKeys />
            </div>

            {/* Divider */}
            <hr className="border-t border-gray-800" />

            {/* Quote Customization Section */}
            <div id="quote-customization" className="bg-white rounded-xl shadow-card p-6 lg:p-8">
              <QuoteCustomization setPdfUrl={setPdfUrl} />
            </div>

            {/* Divider */}
            <hr className="border-t border-gray-800" />

            {/* Current Quote Template Section */}
            <div id="templates" className="bg-white rounded-xl shadow-card p-6 lg:p-8">
              <CurrentQuoteTemplate onManageTemplates={handleManageTemplates} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Resources;
