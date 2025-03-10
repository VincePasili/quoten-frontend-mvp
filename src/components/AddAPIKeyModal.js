import React, { useContext, useState, useRef, useEffect } from 'react';
import AlertContext from '../contexts/AlertContext';

const AddAPIKeyModal = ({ isOpen, onClose, onAddAPIKey }) => {
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyValue, setNewKeyValue] = useState('');

  const { showAlert } = useContext(AlertContext);
  
  const modalRef = useRef(null);
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
          onClose();
        }
      };
  
      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen, onClose]);

  const handleAddAPIKey = () => {
    if (!newKeyName.trim() || !newKeyValue.trim()) {
      showAlert({
        message: 'Please fill in both the key name and key value.',
        severity: "error"
      })
      return;
    }


    onAddAPIKey({ name: newKeyName.trim(), value: newKeyValue.trim() });

    setNewKeyName('');
    setNewKeyValue('');
    onClose();
  };

  if (!isOpen) return null;


  return (
    <div className="fixed sm:max-w-lg z-10 inset-0 m-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div ref={modalRef} className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Add API Key
              </h3>
              <button type="button" className="text-gray-800 hover:text-gray-900 hover:bg-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={onClose} aria-label="Close modal">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>
            <div className="mt-2">
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2"
                placeholder="API Key Name..."
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="API Key Value..."
                value={newKeyValue}
                onChange={(e) => setNewKeyValue(e.target.value)}
              />
              
            </div>
            <div className="mt-4 flex justify-center">
              <button 
                onClick={handleAddAPIKey}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Add API Key"
              >
                Add API Key
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddAPIKeyModal;