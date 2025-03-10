import React, { useEffect, useContext, useState, useCallback } from "react";
import { useQuotes, useDeleteQuoteMutation, usePdfUrl, generatePDF } from "../utilities/api";
import FlexibleTable from "./FlexibleTable";
import AlertContext from "../contexts/AlertContext";
import { useUpvoteQuoteMutation, useCreateNotificationMutation, useNotifications } from '../utilities/api';
import { ThumbsUpIcon } from './Icons';


const QuotesTable = () => {
  const { showAlert } = useContext(AlertContext);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { quotes, isLoading, isError, error, refreshQuotes } = useQuotes();
  const { deleteQuoteMutate } = useDeleteQuoteMutation();


  const { upvoteQuoteMutate } = useUpvoteQuoteMutation();
  const { createNotificationMutate } = useCreateNotificationMutation();

  const { refreshNotifications } = useNotifications();
  
  // Define columns for the table, including an actions column
  const columns = [
    { name: "Client", accessorKey: "client_name", visible: true },
    { name: "Project Name", accessorKey: "project_name", visible: true },
    { name: "Quote Version", accessorKey: "quote_version", visible: true },
    { name: "Upvotes", accessorKey: "upvotes", visible: true },
    { id: "buttons", name: "Upvote", buttonIcon: <ThumbsUpIcon className={"bg-gray-300 text-gray-700 w-8 h-8 p-2 rounded-full"}/>, clicked: (recordData) => onAction('upvote', recordData), visible: true },
    { id: 'actions', name: 'Actions', visible: true },
  ];

  const actionItems = [
    { item: 'Delete Quote', action: 'delete' },
    { item: 'Generate PDF', action: 'create_pdf' },
  ];

  const { setPdfUrl } = usePdfUrl();
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  const handleGeneratePDF = async (quoteId) => {
    setIsGeneratingPDF(true);
  
    try {
      const url = await generatePDF(quoteId);
      setPdfUrl(url);
    } catch (error) {
      showAlert({
        message: "PDF generation failed! Try Again.",
        severity: "error"
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  

  useEffect(() => {
    if (isError) {
      showAlert({
        message: error.message || 'An error occurred while fetching quotes',
        severity: 'error',
      });
    }
  }, [isError, error, showAlert]);

  useEffect(() => {
    refreshQuotes();
  }, [isUpvoting]);

  const loading = () => {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  };

  const onAction = useCallback((action, recordData = null) => {
    switch(action) {
      case 'upvote':
        if (recordData) {
          try {
            setIsUpvoting(true);
            const quote_id = recordData.quote_id;
            const project_id = recordData.project_id;
            const quote_version = recordData.quote_version;

            upvoteQuoteMutate({ 
              quoteId: quote_id, 
              projectId: project_id, 
              quoteVersion: quote_version, 
              voteType: 'upvote' 
            }, {
              onSuccess: async () => {
                showAlert({message: "Quote upvoted successfully.", severity: 'success'});            
                const notification = {            
                  type: 'quote_upvoted',
                  content: 'Quote upvoted and saved to memory.',
                  scope: 'project',
                  project: project_id,
                  quote_version: quote_version
                }
                createNotificationMutate(notification);
  
               await refreshNotifications();
               await refreshQuotes();
  
              },
              onError: (error) => {
                showAlert({message: error.message || "An error occurred while upvoting the quote.", severity: 'error'});
              }
            });
  
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
        break;
      case 'delete':
        if (recordData) {
          setDeleting(true);
          deleteQuoteMutate(recordData.quote_id, {
            onSuccess: () => {
              setDeleting(false);
              showAlert({message: "Quote deleted successfully.", severity: 'success'});
              refreshQuotes();
            },
            onError: (error) => {
              setDeleting(false);
              showAlert({message: error.message || "An error occurred while deleting the quote.", severity: 'error'});
            }
          });
        }
        break;
      case 'create_pdf':
        if (recordData) {
          handleGeneratePDF(recordData.quote_id);
        }
        break;
      default:
        showAlert({
          message: "Unknown Action.",
          severity: 'info',
        });
    }
  }, [upvoteQuoteMutate, createNotificationMutate, showAlert, refreshNotifications, deleteQuoteMutate, refreshQuotes]);

  if (isLoading || deleting) {
    return loading();
  }
  
  return (
    <div className="quotes-component">
      {quotes && quotes?.length > 0 ? (
        <>
            <FlexibleTable 
              data={quotes} 
              columns={columns} 
              showBottomToolbar={true} 
              showColumnActions={false} 
              enableColumnOrdering={false}
              firstColumnClassNames="text-sm font-bold"
              customCellClasses="text-xs font-semibold"
              noAddButton={true}
              actionItems={actionItems}
              onAction={onAction}
              buttonActionActive={isUpvoting}
            />
            {isGeneratingPDF && (
                <div className="flex items-center justify-center mt-4">
                  <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                  <span className="ml-4 text-blue-500">Generating PDF...</span>
                </div>
            )}
        </>
        
      ) : (
        <div className="flex flex-col items-center justify-center px-4 py-3 border-t border-gray-200">
          <span className="col-2 mb-2">No quotes found.</span>
        </div>
      )}
    </div>
  );
}

export default QuotesTable;