import React, { useContext, useState, useEffect } from 'react';
import { FiTrash2, FiPlus, FiCheckCircle } from 'react-icons/fi';
import AddAPIKeyModal from './AddAPIKeyModal';
import { useCreateAPIKeyMutation, useUpdateAPIKeyMutation, useAPIKeys, useDeleteAPIKeysMutation } from '../utilities/api';
import AlertContext from '../contexts/AlertContext';

const APIKeys = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showAlert } = useContext(AlertContext);

  const [activatingKeyId, setActivatingKeyId] = useState(null);

  // Fetch API keys
  const { apiKeys, isLoading, isError, error, setApiKeys, getApiKeys, refetch } = useAPIKeys();

  // Mutations for creating and updating API keys
  const { createAPIKeyMutate } = useCreateAPIKeyMutation();
  const { updateAPIKeyMutate } = useUpdateAPIKeyMutation();
  const { deleteAPIKeyMutate } = useDeleteAPIKeysMutation();

  // Fetch API keys on component mount
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Handle adding a new API key
  const handleAddAPIKey = async ({ name, value }) => {
    const newKey = {
      id: Date.now(), // Temporary ID until the server responds
      name,
      value,
      created: new Date().toISOString().split('T')[0],
      status: "inactive",
    };

    // Optimistically update local state
    setApiKeys((prevKeys) =>
      [...(prevKeys || []), newKey].sort((a, b) => a.name.localeCompare(b.name))
    );

    // Call the mutation to create the key on the server
    createAPIKeyMutate(
      { name, value },
      {
        onSuccess: () => {
          showAlert({ message: "API key added successfully.", severity: 'success' });
          refetch(); // Refetch keys to sync with the server
        },
        onError: (error) => {
          showAlert({ message: error.message || "An error occurred while creating the key.", severity: 'error' });
          // Revert optimistic update on error
          setApiKeys((prevKeys) => prevKeys?.filter((key) => key.id !== newKey.id) || []);
        },
      }
    );
  };

  // Handle deleting an API key
  const handleDeleteKey = (id) => {
    // Optimistically update local state
    setApiKeys((prevKeys) =>
      (prevKeys?.filter((key) => key.id !== id) || []).sort((a, b) => a.name.localeCompare(b.name))
    );
    

    // Call the mutation to delete the key on the server
    deleteAPIKeyMutate(
      id,
      {
        onSuccess: () => {
          showAlert({ message: "API key deleted successfully.", severity: 'success' });
          refetch(); // Refetch keys to sync with the server
        },
        onError: (error) => {
          showAlert({ message: error.message || "An error occurred while deleting the key.", severity: 'error' });
          // Revert optimistic update on error
          setApiKeys((prevKeys) => [...(prevKeys || []), apiKeys?.find((key) => key.id === id)]);
        },
      }
    );
  };

  // Handle activating an API key
  const handleActivateKey = (id) => {

    setActivatingKeyId(id);
    setApiKeys((prevKeys) =>
      (prevKeys?.map((key) => ({
        ...key,
        status: key.id === id ? 'active' : 'inactive',
      })) || []).sort((a, b) => a.name.localeCompare(b.name))
    );
    
    
    // Call the mutation to update the key status on the server
    updateAPIKeyMutate(
      { id, status: 'active' },
      {
        onSuccess: () => {
          showAlert({ message: "API key activated.", severity: 'success' });
          setActivatingKeyId(null);
          refetch(); // Refetch keys to sync with the server
        },
        onError: (error) => {
          showAlert({ message: error.message || "An error occurred while activating the key.", severity: 'error' });
          setApiKeys((prevKeys) =>
            (prevKeys?.map((key) => ({
              ...key,
              status: key.id === id ? 'inactive' : key.status,
            })) || []).sort((a, b) => a.name.localeCompare(b.name))
          );
          

          setActivatingKeyId(null);
        },
      }
    );
  };

  
  if (isError) {
    return <div>Error: {error?.message || "Failed to fetch API keys."}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-xl shadow-card">
      {showAlert.message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center ${
            showAlert.severity === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          <FiCheckCircle className="mr-3 flex-shrink-0" />
          <span className="text-sm">{showAlert.message}</span>
        </div>
      )}
  
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          OpenAI API Keys
        </h2>
      </div>
  
      <AddAPIKeyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAPIKey={handleAddAPIKey}
      />
  
      <div className="border border-gray-100 rounded-xl overflow-x-auto">
        {isLoading || !apiKeys ? (
          <div className="flex justify-center items-center h-32">
            <svg
              width="40"
              height="40"
              fill="currentColor"
              className="animate-spin-slow"
              viewBox="0 0 1792 1792"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5z"></path>
            </svg>
          </div>
        ) : (
          <table className="w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Created', 'Status', 'Actions'].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {apiKeys?.map((key) => (
                <tr key={key.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{key.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{key.created}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        key.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {key.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {key.status !== 'active' && (
                        <button
                          onClick={() => handleActivateKey(key.id)}
                          className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 flex items-center"
                          disabled={activatingKeyId === key.id}
                        >
                          {activatingKeyId === key.id ? (
                            <>
                              <svg
                                width="20"
                                height="20"
                                fill="currentColor"
                                className="mr-2 animate-spin-slow"
                                viewBox="0 0 1792 1792"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5z"></path>
                              </svg>
                              Activating...
                            </>
                          ) : (
                            'Activate'
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteKey(key.id)}
                        className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500 hover:text-red-600"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Create Key
        </button>
      </div>
    </div>
  );
}  

export default APIKeys;