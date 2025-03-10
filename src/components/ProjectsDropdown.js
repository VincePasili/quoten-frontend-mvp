import React, { useState, useEffect, useRef } from 'react';
import { useProjects } from '../utilities/api';

const LoadingSpinner = ({ className }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <div className="w-8 h-8 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
  </div>
);

const ProjectsDropdown = ({ openModal, handleProjectSelect, selectedProject }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { projects } = useProjects();

  const toggleDropdown = () => setIsOpen(!isOpen);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
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
  }, [isOpen]);

  return (
    <div ref={dropdownRef} id="projects-dropdown" className="relative w-full min-w-[320px]">
      <button 
        type="button" 
        onClick={toggleDropdown} 
        className="inline-flex justify-between w-full px-4 py-2 text-sm font-medium text-gray-400 bg-white rounded-md border border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        id="options-menu"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="projects-list"
      >
        {selectedProject ? selectedProject.project_name : 'Select Project'}
        <svg className="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-full max-h-52 overflow-y-auto rounded-md shadow-lg bg-white border border-gray-400 focus:outline-none scrollbar"
          role="listbox"
          aria-labelledby="options-menu"
          id="projects-list"
        >
          <div className="py-3" role="none">
            {projects === undefined ? (
              <LoadingSpinner className="p-4" />
            ) : projects.length === 0 ? (
              <div className="px-4 py-2 text-md text-center font-bold text-gray-500">No projects available</div>
            ) : (
              projects.map((project) => (
                <button 
                  key={project.id}
                  onClick={() => {
                    handleProjectSelect(project);
                    setIsOpen(false);
                  }}
                  className="text-gray-700 flex items-center w-5/6 px-4 py-2 ml-4 text-sm font-semibold rounded hover:bg-blue-200 hover:text-blue-600" 
                  role="option"
                  aria-selected={selectedProject && selectedProject.id === project.id}
                >
                  <span className="mr-2 inline-block">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M20.71,6.3l0,0-5-5-.005,0A1.1,1.1,0,0,0,15,1H4A1,1,0,0,0,3,2V22a1,1,0,0,0,1,1H20a1,1,0,0,0,1-1V7A1.081,1.081,0,0,0,20.71,6.3ZM19,21H5V3h9V7a1,1,0,0,0,1,1h4ZM15.707,10.293a1,1,0,0,1,0,1.414l-4,4a1,1,0,0,1-1.347.061l-2-1.666a1,1,0,0,1,1.28-1.537l1.3,1.082,3.355-3.354A1,1,0,0,1,15.707,10.293Z"/>
                    </svg>
                  </span>
                  <span>{project.project_name}</span>
                </button>
              ))
            )}
          </div>          
          <div className="sticky bottom-0 w-full bg-gray-100 p-2 border-t border-gray-400 flex justify-center">
            <button 
              className="w-full items-center px-6 py-2 mx-4 my-1 rounded-md text-base font-medium text-black bg-white border border-gray-600 hover:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
              onClick={openModal}
              aria-label="Create new project"
            >
              <svg className="w-6 h-6 mr-3 text-black inline-block" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create new project
            </button>
          </div>          
        </div>
      )}
    </div>
  );
};

export default ProjectsDropdown;
