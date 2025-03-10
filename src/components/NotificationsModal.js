import React, { useState, useCallback, useEffect, useRef, useContext } from 'react';
import NotificationItem from './NotificationItem';
import { updateNotifications, deleteNotifications, formatTimeAgo, useUpvoteQuoteMutation, useNotifications, useUpdateNotificationsMutation, useDeleteNotificationsMutation } from '../utilities/api';
import AlertContext from '../contexts/AlertContext';

const LoadingSpinner = ({ className }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

const NotificationsModal = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);

  const { upvoteQuoteMutate } = useUpvoteQuoteMutation();
  const { notifications, refreshNotifications, getNotifications } = useNotifications();
  const { updateNotificationsMutate } = useUpdateNotificationsMutation();
  const { deleteNotificationsMutate } = useDeleteNotificationsMutation();

  const modalRef = useRef(null);

  const { showAlert } = useContext(AlertContext);

  
  const handleUndo = (quote_id, project_id, quote_version ) => {
    try {
      setIsUndoing(true);
      
      upvoteQuoteMutate({ quoteId: quote_id, projectId: project_id, quoteVersion: quote_version, voteType: 'downvote' }, {
        onSuccess: async () => {
          showAlert({message: "Quote upvote undone successfully.", severity: 'success'});
          await refreshNotifications();
        },
        onError: (error) => {
          showAlert({message: error.message || "An error occurred while undoing quote upvote.", severity: 'error'});
        }
      });
    }
    catch(error)
    {
      showAlert({
        message: "Failed to undo quote upvote! Try again.",
        severity: "error"
      });
    }
    finally
    {
      setIsUndoing(false);
    }
      
  }

  const handleClearAll = useCallback(() => {
    if (notifications?.length > 0) {
      setIsClearing(true);
      const allIds = notifications?.map((n) => n.id);
      deleteNotificationsMutate(allIds, {
        onSuccess: async () => {
          showAlert({ message: "All notifications cleared.", severity: 'success' });
          await refreshNotifications();
          setIsClearing(false);
        },
        onError: (error) => {
          setIsClearing(false);
          showAlert({ message: "Failed to clear notifications.", severity: 'error' });
        },
      });
    } else {
      showAlert({ message: "No notifications to clear.", severity: 'info' });
    }
  }, [notifications, getNotifications, showAlert, deleteNotificationsMutate]);

  const handleClickOutside = useCallback(
    (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div
      className="fixed right-2 top-20 bg-white border border-gray-300 rounded-md p-4 shadow-lg w-full sm:w-1/4 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - (64px + 2rem))', zIndex: 1000 }}
    >
      <div ref={modalRef} className="modal-content flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <div
            className="flex justify-end mb-2 w-full text-gray-600 hover:text-gray-900"
            aria-label="Close"
            onClick={onClose}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>
          <div className="flex justify-between items-center mb-4 w-full">
            <h2 className="text-lg font-bold">Notifications</h2>
            <button
              className="text-sm text-blue-700 font-semibold cursor-pointer disabled:text-gray-400"
              onClick={handleClearAll}
              disabled={isClearing}
            >
              {isClearing ? <LoadingSpinner className="h-6 w-6" /> : 'Clear All'}
            </button>
          </div>
          <div className="space-y-2 w-full">
            {isLoading || (isLoading && !notifications)  ? (
              <LoadingSpinner className="h-40" />
            ) : notifications?.length > 0 ? (
              notifications?.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  type={notification.type}
                  content={notification.content}
                  scope={notification.scope}
                  projectName={notification.scope === 'project' ? notification.project_name : null}
                  timeAgo ={notification.created_at}
                  onUndo={notification.type === 'quote_upvoted' ? () => handleUndo(notification?.quote_id, notification?.project_id, notification?.quote_version) : null}
                  className="w-full"
                />
              ))
            ) : (
              <p className="text-gray-500 text-center">No notifications available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsModal;
