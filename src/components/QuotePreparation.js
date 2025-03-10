import React, { useState, useContext, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import '@fontsource/inter';
import ProjectsDropdown from './ProjectsDropdown';
import ProjectModal from './ProjectModal';
import AlertContext from '../contexts/AlertContext';
import { useProjects, useQuoteGenerationStatus, QuoteGenerationStatus, useSelectedProject, useQuoteFiles, useAdditionalInfo } from '../utilities/api';


const QuotePreparation = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [localSelectedProject, setLocalSelectedProject] = useState(null);
  const { showAlert } = useContext(AlertContext);
  const navigate = useNavigate();

  const { getSelectedProject, setSelectedProject} = useSelectedProject();
  const { quoteFiles, setQuoteFiles, clearQuoteFiles} = useQuoteFiles();
  const { additionalInfo, setAdditionalInfo, clearQuoteExtraInfo, setProposedChanges } = useAdditionalInfo();


  const formatBytes = useCallback((bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }, []);

  const { refreshProjects} = useProjects();
  const { setQuoteGenerationStatus, getQuoteGenerationStatus } = useQuoteGenerationStatus();
  
  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    refreshProjects();
  }, []);

  
  const handleProjectSelect = useCallback((project) => {

    const currentProject = getSelectedProject();
    if(currentProject?.id != project?.id)
    {
      clearQuoteFiles();
      clearQuoteExtraInfo(); 
    }
    else
    {
      // Only reset the proposed changes 
      setProposedChanges("");
    }

    setLocalSelectedProject(project);
    setSelectedProject(project);

  }, []);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      const invalidFileNames = invalidFiles.map(file => file.name).join(', ');
      showAlert({
        message: `The following files were not uploaded because they are not of the allowed types (.txt, .pdf, .xlsx, .docx): ${invalidFileNames}`,
        severity: 'error',
      });
    }
    
    if (Array.isArray(quoteFiles)) 
    {
      setQuoteFiles([...quoteFiles, ...validFiles]);
    } 
    else 
    {
      setQuoteFiles(validFiles);
    }

    e.target.value = ''; // Clear the file input
  }, [showAlert, quoteFiles, setQuoteFiles]);

  const removeFile = useCallback((index) => {
    setQuoteFiles(quoteFiles.filter((_, i) => i !== index));
  }, [quoteFiles, setQuoteFiles]);


  const handleGenerateQuote = useCallback(() => {
      const generationStatus = getQuoteGenerationStatus();
      if (generationStatus === QuoteGenerationStatus.BEGINNING  || generationStatus === QuoteGenerationStatus.ACTIVE)
      {
        showAlert({
          message: "Another quote is currently being generated.",
          severity: 'info',
        });
      }
      else
      {
        setQuoteGenerationStatus(QuoteGenerationStatus.BEGINNING);
      }
      navigate("/quotes");
  }, [navigate, setQuoteGenerationStatus, getQuoteGenerationStatus]);

  return (
    <main className="p-6 w-full font-inter" role="main" aria-label="Quote Preparation">
      <div className="w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8" aria-label="Prepare your quote">Prepare your quote</h1>
        <div className="w-2/5 mx-auto mb-8">
          <ProjectsDropdown openModal={openModal} handleProjectSelect={handleProjectSelect} selectedProject={localSelectedProject} />
        </div>
        {!localSelectedProject ? (
          <div className="text-center">
            <div className="w-1/2 mx-auto mb-6 flex items-center" aria-hidden="true">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="text-gray-500 text-lg mx-4">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button 
              className="inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={openModal}
              aria-label="Create new project"
            >
              <svg className="w-6 h-6 mr-3 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 12H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 16V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Create new project
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            <label
              className="block text-center text-md font-medium text-gray-700 mb-4"
              htmlFor="file-upload"
              aria-label="Upload your files or enter your specifications"
            >
              Upload your files or enter your specifications
            </label>
            <div className='w-full max-w-lg border border-gray-300 rounded-lg bg-gray-50'>
              <div className="flex w-full max-w-lg bg-gray-50" role="group" aria-label="File upload section">
                <label htmlFor="file-input" className="cursor-pointer p-4 flex-shrink-0" aria-label="Select files to upload">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6 text-gray-500"
                    aria-hidden="true"
                  >
                    <path d="M14 4c-1.66 0-3 1.34-3 3v8c0 .55.45 1 1 1s1-.45 1-1V8h2v7c0 1.66-1.34 3-3 3s-3-1.34-3-3V7c0-2.76 2.24-5 5-5s5 2.24 5 5v8c0 3.87-3.13 7-7 7s-7-3.13-7-7V8h2v7c0 2.76 2.24 5 5 5s5-2.24 5-5V7c0-1.66-1.34-3-3-3z" />
                  </svg>
                  <input type="file" id="file-input" className="hidden" onChange={handleFileSelect} multiple aria-label="File input" />
                </label>
                <textarea
                  id="additional-info"
                  className="w-full border-0 rounded-lg p-4 text-sm font-medium text-gray-700 focus:ring-0 bg-gray-50 resize-none overflow-y-auto"
                  rows="4"
                  placeholder="Add file/s here to upload, or type your specifications"
                  aria-label="Enter specifications or upload files"
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                />
              </div>
              {quoteFiles && quoteFiles?.length > 0 && (
                <div className="w-full max-w-lg m-2 flex flex-wrap gap-2" role="list" aria-label="Uploaded files list">
                  {quoteFiles?.map((file, index) => (
                    <div key={index} className="flex items-center bg-gray-200 rounded px-1 py-1 text-sm font-semibold text-gray-900" role="listitem">
                      <button type="button" onClick={() => removeFile(index)} className="m-0.5 relative" aria-label={`Remove ${file.name}`}>
                        <div className="flex items-center bg-gray-200 rounded-full px-2 text-sm">
                          <span className="mr-2">{file.name}</span>
                          <span className="text-gray-900 mr-2">({formatBytes(file.size)})</span>
                          <span className="absolute -top-1 -right-1">
                            <svg className="w-3 h-3 bg-black text-white rounded-full p-0.5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                          </span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              className="w-1/6 mt-8 py-2 bg-blue-600 text-white text-sm font-normal rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Submit quote"
              onClick={handleGenerateQuote}
            >
              Submit
            </button>
          </div>
        )}
      </div>

      <ProjectModal
        open={modalOpen}
        onClose={closeModal}
        mode="create"
      />
    </main>
  );
};

export default QuotePreparation;