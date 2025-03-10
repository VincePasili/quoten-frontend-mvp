import React, { useEffect, useRef, useState } from 'react';

const AddFieldModal = ({ isOpen, onClose, columns, onToggleVisibility, clickPosition }) => {
  const modalRef = useRef(null);
  const [modalWidth, setModalWidth] = useState(15);

  useEffect(() => {
    const calculateModalWidth = () => {
      const longestName = columns
        .filter(col => !col.visible && col.id !== 'actions')
        .reduce((longest, col) => (col.name.length > longest.length ? col.name : longest), '');
      
      // Estimate width: 0.5rem per character + 7rem for padding and icon
      const estimatedWidth = longestName.length * 0.5 + 7;
      setModalWidth(estimatedWidth);
    };

    if (isOpen) calculateModalWidth();
  }, [isOpen, columns]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    // Add and remove event listener based on modal state
    document[isOpen ? 'addEventListener' : 'removeEventListener']('mousedown', handleClickOutside);

    // Cleanup function to ensure removal of listener
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef} 
      className="fixed z-50 bg-white border border-gray-400 rounded-lg shadow-lg p-6"
      style={{
        top: `${clickPosition.y + 15}px`,
        // Center the modal horizontally relative to the click position
        left: `calc(${clickPosition.x}px - ${modalWidth}rem)`,
        maxWidth: `${modalWidth}rem`,
        width: '100%'
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Add Field</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {columns.filter(col => !col.visible && col.id !== 'actions').map((col, index) => (
          <div 
            key={index} 
            className="flex items-center p-2 cursor-pointer hover:bg-gray-100"
            onClick={() => onToggleVisibility(col.accessorKey)}
          >
            {col.icon}
            <span className="ml-2">{col.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddFieldModal;