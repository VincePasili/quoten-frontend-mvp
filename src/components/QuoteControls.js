import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PDFIcon, CopyIcon, DownloadIcon, ThumbsUpIcon } from './Icons';
import CustomTooltip from './CustomTooltip';
import { generatePDF, usePdfUrl, useGeneratedQuoteId, useQuoteText, useUpvoteQuoteMutation, useSelectedProject, useCreateNotificationMutation, useNotifications, useAdditionalInfo } from '../utilities/api';
import AlertContext from '../contexts/AlertContext';

const QuoteControls = ({ onGenerateQuote, isGeneratingQuote }) => {
  
  const { setPdfUrl } = usePdfUrl();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const { showAlert } = useContext(AlertContext);

  const { getGeneratedQuoteId } = useGeneratedQuoteId();
  const { getQuoteText } = useQuoteText();
  const { upvoteQuoteMutate } = useUpvoteQuoteMutation();
  const { getSelectedProject } = useSelectedProject();
  const { createNotificationMutate } = useCreateNotificationMutation();

  const { refreshNotifications } = useNotifications();
  const { proposedChanges, setProposedChanges} = useAdditionalInfo();
  

  // Effect to ensure we update the component when generation of the quote is done
  useEffect(() => {
  
  }, [isGeneratingQuote, isUpvoting]);
  
  const handleGeneratePDF = async () => {
    setIsGeneratingPDF(true);
  
    try {
      const url = await generatePDF(getGeneratedQuoteId());
      setPdfUrl(url);
    } catch (error) {
      showAlert({
        message: error.message || "PDF generation failed! Try Again.",
        severity: "error"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const copyToClipboard = () => {

    if(isGeneratingQuote)
    {
      showAlert({
        message: "Quote generation not yet complete!",
        severity: "info"
      });
    }
    else 
    {
        const text = getQuoteText();
        navigator.clipboard.writeText(text).then(() => {
          showAlert({
            message: "Quote copied!",
            severity: "success"
          });
        }).catch(err => {
          showAlert({
            message: "Failed to copy text! Try again.",
            severity: "error"
          });
        });
    }
    
  };


  const handleDownloadPDF = async () => {
    try {
      if(isGeneratingQuote)
        {
          showAlert({
            message: "Quote generation not yet complete!",
            severity: "info"
          });
        }
      else
      {
        setIsGeneratingPDF(true);
        const url = await generatePDF(getGeneratedQuoteId());
  
        const quote_id = getGeneratedQuoteId();
  
        const a = document.createElement('a');
        a.href = url;
        a.download = `quote_${quote_id}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
  
        window.URL.revokeObjectURL(url);
        showAlert({
          message: "PDF downloaded successfully!",
          severity: "success"
        });
      }
      
    } catch (error) {
      showAlert({
        message: "Failed to download PDF! Try again.",
        severity: "error"
      });

    }
    finally
    {
      setIsGeneratingPDF(false);
    }
  };

  const handleUpvoteQuote =  () => {
    try {
      if(isGeneratingQuote)
        {
          showAlert({
            message: "Quote generation not yet complete!",
            severity: "info"
          });
        }
      else
      {
        setIsUpvoting(true);
        const quote_id = getGeneratedQuoteId();
        const project = getSelectedProject();
        upvoteQuoteMutate({ quoteId: quote_id, projectId: project.id, quoteVersion: project.quote_version, voteType: 'upvote' }, {
          onSuccess: () => {
            showAlert({message: "Quote upvoted successfully.", severity: 'success'});            
            const notification = {            
              type: 'quote_upvoted',
              content: 'Quote upvoted and saved to memory.',
              scope: 'project',
              project: project.id,
              quote_version: project.quote_version
            }
            createNotificationMutate(notification);
            
            refreshNotifications();


          },
          onError: (error) => {
            showAlert({message: error.message || "An error occurred while upvoting the quote.", severity: 'error'});
          }
        });
      }

    }
    catch(error)
    {
      showAlert({
        message: "Failed to upvote quote! Try again.",
        severity: "error"
      });
    }
    finally 
    {
      setIsUpvoting(false);
    }
  }
  
  return (
    <div className="flex flex-col items-start">
      <div className="w-full flex items-center justify-between mb-4 mt-2">
        <button
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF || isGeneratingQuote}
          className={`inline-flex px-4 py-2 bg-blue-600 text-white text-sm font-normal rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isGeneratingPDF || isGeneratingQuote ? " opacity-70 cursor-not-allowed" : ""}`}
        >
          {isGeneratingPDF && !isGeneratingQuote ? (
            <>
              <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin-slow" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                   <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                   </path>
              </svg>
              <span>Generating PDF</span>
            </>
          ) : (
            <>
              <PDFIcon className="w-6 h-6 mr-3 text-gray-500"/>
              {"Generate PDF"}
            </>
          )}
        </button>
        <div className="flex space-x-2">
          <CustomTooltip title="Copy" placement="bottom">
            <div onClick={copyToClipboard}>
                <CopyIcon className="w-4 h-4 text-gray-500" />
            </div>
          </CustomTooltip>
          <CustomTooltip title="Download" placement="bottom">
            <div onClick={handleDownloadPDF}>
                <DownloadIcon className="w-4 h-4 text-gray-500" />
            </div>            
          </CustomTooltip>
          <CustomTooltip title="Upvote" placement="bottom">
            <div onClick={handleUpvoteQuote}>
              {isUpvoting ? (
                <svg width="20" height="20" fill="currentColor" className="w-4 h-4 text-gray-500 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                  <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
                  </path>
                </svg>
              ) : (
                <ThumbsUpIcon className="w-4 h-4 text-gray-500" />
              )}
            </div>
          </CustomTooltip>
        </div>
      </div>
      <div className="w-full flex flex-col border border-gray-300 pt-2 pl-2 pr-2 rounded" role="group" aria-label="Proposed changes section">
        <div className="flex flex-row items-start w-full">
          <div className="flex-shrink-0 mr-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4 text-gray-500 mt-[10px]"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </div>
          <textarea
            id="proposed-changes"
            className="w-full border-0 rounded-lg text-sm font-medium text-gray-700 focus:ring-0 resize-none overflow-y-auto pl-0"
            rows="2"
            placeholder="Propose any changes here"
            aria-label="Enter any changes here."
            value={proposedChanges}
            onChange={(e) =>setProposedChanges(e.target.value)}
          />
        </div>
        <div className="mb-2 text-right">
          <button 
            type='button'
            className={`inline-flex px-4 py-2 bg-white text-black text-sm border border-gray-800 font-normal rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isGeneratingPDF || isGeneratingQuote? " opacity-70 cursor-not-allowed" : ""}`}
            onClick={onGenerateQuote}
            disabled={isGeneratingPDF || isGeneratingQuote}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuoteControls;