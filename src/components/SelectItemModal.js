import React, { useState, useEffect, useCallback, useRef } from 'react';

const SelectItemModal = ({ isOpen, onClose, onSelect, items, isProjectSelection = false, userProjects = [] }) => {
  const [filteredItems, setFilteredItems] = useState(items || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState(isProjectSelection ? userProjects : []);
  
  const fieldName = isProjectSelection ? 'project_name' : 'name';

  useEffect(() => {
    if (Array.isArray(items)) {
      const results = items.filter(item => 
        item && item[fieldName] && item[fieldName].toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredItems(results);
    } else {
      setFilteredItems([]);
    }
  }, [searchTerm, items, isProjectSelection]);

  const modalRef = useRef(null);

  const handleOutsideClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    } else {
      document.removeEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, handleOutsideClick]);

  if (!isOpen) return null;

  const handleItemSelect = (item) => {
    if (isProjectSelection) {
      setSelectedItems(prev => 
        prev.includes(item[fieldName]) 
        ? prev.filter(name => name !== item[fieldName]) 
        : [...prev, item]
      );
    } else {
      setSelectedItems(prev => 
        prev.includes(item.id) 
        ? prev.filter(id => id !== item.id) 
        : [...prev, item.id]
      );
    }
  };

  const handleAddSelected = () => {
    if (isProjectSelection) {
      onSelect(selectedItems);
    } else {
      const selected = items.filter(member => selectedItems.includes(member.id));
      onSelect(selected);
    }
    onClose();
  };

  return (
    <div className="fixed sm:max-w-lg z-10 inset-0 m-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div ref={modalRef} className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {isProjectSelection ? 'Select Project' : 'Add Team Member'}
              </h3>
              <button type="button" className="text-gray-800 hover:text-gray-900 hover:bg-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={onClose} aria-label="Close modal">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>
            <div className="mt-2">
              <input
                type="text"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder={isProjectSelection ? "Search projects..." : "Search members..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {filteredItems.length > 0 ? (
              <div className="mt-4 max-h-[50vh] overflow-y-auto">
                {filteredItems.map((item) => (
                  <div 
                    key={isProjectSelection ? item.project_name : item.id} 
                    className="flex items-center p-2 border-b border-gray-200"
                    role="listitem"
                  >
                    {isProjectSelection ? (
                    <>
                      <input 
                        type="checkbox" 
                        checked={selectedItems.some(project => project.id === item.id) }
                        onChange={() => handleItemSelect(item)}
                        id={`project-checkbox-${item[fieldName]}`}
                        className="form-checkbox h-5 w-5 rounded text-blue-600"
                      />
                      <label 
                        htmlFor={`project-checkbox-${item[fieldName]}`} 
                        className="ml-2 block text-sm font-semibold text-gray-900 cursor-pointer"
                      >
                        {item[fieldName]}
                      </label>
                    </>
                    ) : (
                      <>
                        <input 
                          type="checkbox" 
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleItemSelect(item)}
                          id={`member-checkbox-${item.id}`}
                          className="form-checkbox h-5 w-5 rounded text-blue-600"
                        />
                        <label 
                          htmlFor={`member-checkbox-${item.id}`} 
                          className="ml-2 block text-sm font-semibold text-gray-900"
                        >
                          {item.name}
                        </label>
                        <div className="ml-4 flex-grow text-sm text-gray-500">
                          {item.role || item.other_roles.length > 0 ? (
                            <>
                              {item.role && (
                                <span key="primary" className="inline-block bg-blue-200 text-blue-800 rounded-full px-2 py-1 text-xs mr-1 mb-1">
                                  {item.role}
                                </span>
                              )}
                              {item.other_roles.map((role, index) => (
                                <span key={`other-${index}`} className="inline-block bg-blue-200 text-blue-800 rounded-full px-2 py-1 text-xs mr-1 mb-1">
                                  {role}
                                </span>
                              ))}
                            </>
                          ) : (
                            <span className="text-gray-500">No Roles</span>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-4 text-semibold text-md text-gray-500">
                {isProjectSelection ? 'No projects found.' : 'No members found.'}
              </div>
            )}
            {filteredItems.length > 0 && (
              <div className="mt-4 flex justify-center">
                <button 
                  onClick={handleAddSelected}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label={isProjectSelection ? "Select projects" : "Add members"}
                >
                  {isProjectSelection ? 'Update Projects' : 'Update Members'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectItemModal;