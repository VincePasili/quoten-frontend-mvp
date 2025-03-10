import React, { useState } from "react";
import { FiX } from "react-icons/fi";

import default_template from '../assets/default_template.pdf';

// Utility function to break text into lines based on a max character width
const breakText = (text, width) =>
  text
    .split(" ")
    .reduce((acc, word) => {
      if (!acc.length || acc[acc.length - 1].length + word.length + 1 > width) {
        acc.push(word);
      } else {
        acc[acc.length - 1] += " " + word;
      }
      return acc;
    }, [])
    .join("\n");

// BrowseTemplatesModal component
const BrowseTemplatesModal = ({ onClose, onPreview }) => {
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-6 bg-black/30">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
          aria-label="Close Browse Templates Modal"
        >
          <FiX className="w-6 h-6" />
        </button>
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Browse Templates</h3>
          {/* Template preview button */}
          <div className="bg-gray-50 rounded-lg border shadow p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Default Template</h4>
            <button
              onClick={() => onPreview(default_template)}
              className="border border-gray-800 text-gray-800 px-3 py-1 rounded hover:bg-gray-100"
            >
              Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TemplateSelection = ({ onClose }) => {
  const [showBrowseModal, setShowBrowseModal] = useState(false);
  const [ pdfUrl, setPdfUrl ] = useState('');

  
  return (
    <div className="relative flex flex-col items-center justify-center max-h-[80vh] p-6">
      {/* Conditionally render the Browse Templates Modal */}
      {showBrowseModal && (
        <BrowseTemplatesModal
          onClose={() => setShowBrowseModal(false)}
          onPreview={(url) => {
            setPdfUrl(url);
            setShowBrowseModal(false); // Close modal when previewing
          }}
        />
      )}

      {/* If PDF URL is set, show the PDF display */}
      {pdfUrl ? (
        <div className="w-3/4 max-h-[800px] mx-auto mt-10 flex">
          <iframe 
            title="PDF Viewer"
            className="rounded-lg flex-1"
            src={`${pdfUrl}#navpanes=0`}
            style={{ height: '80vh', border: 'none' }}
          />
          <div className="ml-2 flex items-start">
            <button 
              type="button" 
              className="text-gray-800 bg-red-500 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm py-2 px-4 inline-flex items-center"
              onClick={() => {
                setPdfUrl('');
              }}
              aria-label="Close modal"
            >
              <svg 
                className="w-5 h-5" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg" 
                aria-hidden="true"
              >
                <path 
                  fillRule="evenodd" 
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-1">Close</span>
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Close Icon (top right) */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
            aria-label="Close Template Selection"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Existing content remains unchanged */}
          <div className="flex flex-col items-center justify-center min-h-screen p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Looks like you haven't uploaded any templates... yet
            </h2>
            <p className="text-gray-500 text-center max-w-lg mb-6">
              Use our generic templates to start, or upload your own to automatically
              generate your custom quotes.
            </p>

            <div className="flex space-x-6">
              {/* Browse Templates Card */}
              <div className="bg-white rounded-lg shadow-md border p-6 w-80 text-center">
                <div className="bg-gray-100 h-20 rounded-t-lg mb-4"></div>
                <h3 className="font-semibold text-gray-900">Browse templates</h3>
                <p className="text-gray-500 text-sm mb-4 whitespace-pre-wrap text-left">
                  {breakText(
                    "Select one of our templates to get started, Quoten will use this to structure and format all your quotes.",
                    45
                  )}
                </p>
                <button
                  onClick={() => setShowBrowseModal(true)}
                  className="border border-gray-800 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Browse our templates
                </button>
              </div>

              {/* Upload Your Own Card */}
              <div className="bg-white rounded-lg shadow-md border p-6 w-80 text-center">
                <div className="bg-gray-100 h-20 rounded-t-lg mb-4"></div>
                <h3 className="font-semibold text-gray-900">Upload your own</h3>
                <p className="text-gray-500 text-sm mb-4 whitespace-pre-wrap text-left">
                  {breakText(
                    "Upload your existing quote template to teach Quoten how you like your quotes structured and formatted.",
                    40
                  )}
                </p>
                <button className="border border-gray-800 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-100">
                  Upload your template
                </button>
              </div>
            </div>
          </div>

          {/* Cancel Button (bottom) */}
          <div className="mt-2">
            <button
              onClick={onClose}
              className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateSelection;
