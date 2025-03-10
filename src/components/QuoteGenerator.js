import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom'

import { 
  generateQuoteStream, 
  useQuoteGenerationStatus, 
  QuoteGenerationStatus, 
  useQuoteText, 
  useGeneratedQuoteId, 
  usePdfUrl,
  waitForElement 
} from '../utilities/api';
import AlertContext from '../contexts/AlertContext';

import StreamingQuoteViewer from '../components/QuoteDisplay';
import QuoteControls from '../components/QuoteControls';
import { useSelectedProject, useCreateNotificationMutation, useNotifications, useQuoteFiles, useAdditionalInfo } from '../utilities/api'; // Assuming this is where you've placed your custom hook
import QuotesTable from './QuotesTable';

const QuoteGenerator = () => {
  // Use the selected project hook
  const { getSelectedProject } = useSelectedProject();

  // State and Refs
  const hasReceivedFirstChunk = useRef(false);

  // Custom hooks
  const { getQuoteGenerationStatus, setQuoteGenerationStatus } = useQuoteGenerationStatus();
  const { quoteText, getQuoteText, setQuoteText } = useQuoteText();
  const { setGeneratedQuoteId } = useGeneratedQuoteId();
  const { getPdfUrl, setPdfUrl } = usePdfUrl();
  const { createNotificationMutate } = useCreateNotificationMutation();
  const { refreshNotifications } = useNotifications();
  const { getQuoteFiles } = useQuoteFiles();
  const { getAdditionalInfo, getProposedChanges } = useAdditionalInfo();

  // Context
  const { showAlert } = useContext(AlertContext);

  // Navigator
  const navigate = useNavigate();

  // Effects
  useEffect(() => {
    if ([QuoteGenerationStatus.BEGINNING, QuoteGenerationStatus.ACTIVE].includes(getQuoteGenerationStatus())) {
      if (!getSelectedProject()) {
         // Alert user to select a project first
        showAlert({ 
          message: "Please select a project before generating a quote.", 
          severity: "warning" 
        });
        setQuoteGenerationStatus(QuoteGenerationStatus.IDLE); // Reset to IDLE to prevent further processing
      }
    } 

    if (getQuoteGenerationStatus() === QuoteGenerationStatus.BEGINNING) {
      handleGenerateQuote();
    }
  }, [getQuoteGenerationStatus, showAlert]);

  // Event handlers
  const handleGenerateQuote = async () => {
    setQuoteText('');
    hasReceivedFirstChunk.current = false;
    setQuoteGenerationStatus(QuoteGenerationStatus.ACTIVE);
    

    try {
      const additionalInfo = getAdditionalInfo();
      const proposedChanges = getProposedChanges();
      const combinedInfo = `${additionalInfo} \n\n${proposedChanges}`.trim();

      await generateQuoteStream(getSelectedProject(), getQuoteFiles(), combinedInfo,  updateQuoteText);
    } catch (error) {
      navigate("/dashboard");
      showAlert({ message: error.message, severity: "error" });
    } finally {
      setQuoteGenerationStatus(QuoteGenerationStatus.IDLE);
            
      await refreshNotifications();

    }
  };

   

  const updateQuoteText = ({ text, status, quoteId }) => {
    // Track first chunk for initialization
    if (!hasReceivedFirstChunk.current) {
      hasReceivedFirstChunk.current = true;
    }
  
    // Update text based on status
    const currentText = getQuoteText();
    const updatedText = updateTextByStatus(currentText, text, status);
    setQuoteText(updatedText);
  
    // Handle additional status actions
    handleStatusActions(status, text, quoteId);
  };
  
  // Helper to update text based on status
  const updateTextByStatus = (currentText, text, status) => {
    switch (status) {
      case "new-section":
        return `${currentText}<b>\n\n${text}\n</b>`;
      case "in-progress":
        return currentText + text;
      case "completed":
        return `${currentText}${text}<i> (Quote generation completed)</i>`;
      default:
        return currentText; // No change for unrecognized statuses
    }
  };
  
  // Helper to handle status-specific actions
  const handleStatusActions = (status, text, quoteId) => {
    switch (status) {
      case "quote-id":
        setGeneratedQuoteId(quoteId);
        break;
      case "completed":
        setQuoteGenerationStatus(QuoteGenerationStatus.IDLE);
        showAlert({ message: "Quote generation completed successfully!", severity: "success" });
        break;
      case "error":
        navigate("/dashboard");
        handleErrorFlow(text);
        break;
      default:
        break; // No action for other statuses
    }
  };
  
  // Async helper for error flow
  const handleErrorFlow = async (errorMessage) => {
    try {
      const optionsMenu = await waitForElement("#options-menu", 5000);
      optionsMenu.click();
  
      const projectsList = await waitForElement("#projects-list", 5000);
      const selectedProject = getSelectedProject();
  
      const projectButtons = projectsList.querySelectorAll('button[role="option"]');
      const projectSelected = Array.from(projectButtons).some((button) => {
        if (button.textContent.includes(selectedProject.project_name)) {
          button.click();
          return true;
        }
        return false;
      });
  
      if (!projectSelected) {
        console.warn("Selected project not found in list.");
      }
    } catch (error) {
      console.error("Error in handleErrorFlow:", error);
    } finally {
      showAlert({ message: errorMessage, severity: "error" });
    }
  };

  const handleClosePdf = () => setPdfUrl('');

  // Render logic
  const currentStatus = getQuoteGenerationStatus();
  if (currentStatus !== QuoteGenerationStatus.BEGINNING && 
      currentStatus !== QuoteGenerationStatus.ACTIVE && 
      getQuoteText() === '' && getPdfUrl() === '') {
    return (
      <QuotesTable/>
    );
  }

  // Main component render
  return (
    <>
      {getPdfUrl() ? (
        <div className="w-3/4 max-h-[800px] mx-auto mt-10 flex">
          <iframe 
            title="PDF Viewer"
            className="rounded-lg flex-1"
            src={`${getPdfUrl()}#navpanes=0`}
            style={{ height: '80vh', border: 'none' }}
          />
          <div className="ml-2 flex items-start">
            <button 
              type="button" 
              className="text-gray-800 bg-red-500 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm py-2 px-4 inline-flex items-center"
              onClick={handleClosePdf}
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
         !hasReceivedFirstChunk.current && (getQuoteGenerationStatus() !== QuoteGenerationStatus.ACTIVE) && getQuoteText() === '' ? (
          <div className="flex items-center justify-center h-screen">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="relative overflow-y-auto max-w-[720px] mx-auto" aria-label="Generate quote for the project">
          <StreamingQuoteViewer generatedQuote={getQuoteText()} />
          <QuoteControls 
            onGenerateQuote={handleGenerateQuote} 
            isGeneratingQuote={getQuoteGenerationStatus() !== QuoteGenerationStatus.IDLE}
          />
        </div>
        )
      )}
    </>
  );
};

export default QuoteGenerator;