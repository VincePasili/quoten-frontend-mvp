import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import mammoth from 'mammoth';
import { PuffLoader } from 'react-spinners';
import { read, utils } from 'xlsx';
import { fetchProjects, retrieveCsrfToken } from '../utilities/api';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';



const JobSpecUpload = () => {
  const [files, setFiles] = useState([]);
  const [metadata, setMetadata] = useState([]);
  const [excelData, setExcelData] = useState({}); // Store for Excel Worksheets data
  const [finalDescription, setFinalDescription] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serverFile, setServerFile] = useState(null); // Added state for serverFile
  const [proposedChanges, setProposedChanges] = useState(''); // State for proposed changes
  const [upvoted, setUpvoted] = useState(false); // State for upvote
  const [selectedProject, setSelectedProject] = useState('');

  const { data: fetchedProjects = [] } = useGetProjects();

  const formattedProjects = fetchedProjects.map(project => ({
    label: project.project_name,
    value: project.id,
  }));

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf,.docx,.txt',
    onDrop: async (acceptedFiles) => {
      const validFiles = acceptedFiles.filter(file => file.size <= 20 * 1024 * 1024);
      const newFiles = await Promise.all(validFiles.map(async (file) => {
        if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          const arrayBuffer = await file.arrayBuffer();
          const result = await mammoth.convertToHtml({ arrayBuffer });
          return Object.assign(file, { preview: `data:text/html,${encodeURIComponent(result.value)}` });
        } else {
          return Object.assign(file, { preview: URL.createObjectURL(file) });
        }
      }));
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setMetadata(prevMetadata => [...prevMetadata, ...newFiles.map(() => ({ docType: '', description: '', comments: '' }))]);
    },
  });

  
  const handleMetadataChange = (index, key, value) => {
    const newMetadata = [...metadata];
    newMetadata[index] = { ...newMetadata[index], [key]: value };
    setMetadata(newMetadata);
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleExcelFile = (file, index) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = read(binaryStr, { type: 'binary' });

      // Convert each sheet to JSON and store it in the state
      const sheetNames = workbook.SheetNames;
      const sheetsData = sheetNames.map((sheetName) => ({
        name: sheetName,
        data: utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }),
      }));

      setExcelData((prevData) => ({
        ...prevData,
        [index]: sheetsData,
      }));
    };
    reader.readAsArrayBuffer(file);
  };

  function useGetProjects() {
    return useQuery({
      queryKey: ['projects'],
      queryFn: fetchProjects,
      refetchOnWindowFocus: false,
    });
  }

  const handleFinalSubmit = async () => {
    setLoading(true); // Start loading
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('metadata', JSON.stringify(metadata));
    formData.append('finalDescription', finalDescription);
    formData.append('selectedProject', selectedProject);

    const csrfToken = retrieveCsrfToken();
    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Error submitting proposed changes.');
      }
      
      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      
      setServerFile(fileUrl);

      setStep(3);
    } catch (error) {
      console.error('Error submitting data.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSkipToFinalDescription = () => {
    setStep(2);
  };

  const handleProposeChangesSubmit = async () => {
    setLoading(true); // Start loading

    const formData = new FormData();
    formData.append('proposedChanges', proposedChanges);
    formData.append('upvoted', upvoted);

    const csrfToken = retrieveCsrfToken();
    try {
      const response = await fetch('http://localhost:5000/changes', {
        method: 'POST',
        body: formData,
        headers: {
          'X-CSRF-Token': csrfToken,
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Error submitting proposed changes.');
      }
      
      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      
      setServerFile(fileUrl);
    } catch (error) {
      console.error('Error submitting proposed changes.');
    } finally {
      setLoading(false); // Stop loading
    }

  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Job Specification Upload</h1>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <PuffLoader size={150} color={"#36D7B7"} loading={loading} />
        </div>
      ) : (
        <>
          {step === 1 && (
            <div>
              <div className="w-1/2 mb-4 mx-auto text-center">
                <label className="block text-gray-700 mb-1">Select Project:</label>
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                  required
                >
                  <option value="" className='text-center'> Select a Project </option>
                  {formattedProjects.map((project, index) => (
                    <option key={index} value={project.value}>
                      {project.label}
                    </option>
                  ))}
                </select>
              </div>
                
              <div className='flex'>                
                  <div className="w-1/2 p-4">
                    <div {...getRootProps({ className: 'dropzone p-4 border-dashed border-2 border-gray-400 rounded-md' })}>
                      <input {...getInputProps()} />
                      <p className="text-center text-gray-600">Drag 'n' drop some files here, or click to select files</p>
                    </div>
                    {files.map((file, index) => (
                      <form key={index} className="mt-4">
                        <h2 className="text-xl font-semibold mb-2">Document {index + 1}</h2>
                        <div className="mb-4">
                          <label className="block text-gray-700">Document Type:</label>
                          <input
                            type="text"
                            value={metadata[index]?.docType || ''}
                            onChange={(e) => handleMetadataChange(index, 'docType', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                            maxLength={100}
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">Description:</label>
                          <textarea
                            value={metadata[index]?.description || ''}
                            onChange={(e) => handleMetadataChange(index, 'description', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                            maxLength={500}
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700">Extra Comments:</label>
                          <textarea
                            value={metadata[index]?.comments || ''}
                            onChange={(e) => handleMetadataChange(index, 'comments', e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                            maxLength={500}
                          />
                        </div>
                      </form>
                    ))}
                    <div className="mt-4 flex">
                      {files.length > 0 && (
                        <>
                          <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                            Next
                          </button>
                          <button {...getRootProps()} className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md">
                            <input {...getInputProps()} />
                            Upload Another File
                          </button>
                        </>
                      )}
                    </div>
                    {files.length === 0 && (
                      <div className="mt-4">
                        <button onClick={handleSkipToFinalDescription} className="px-4 py-2 bg-green-500 text-white rounded-md">
                          Enter Specifications Manually
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="w-1/2 p-4">
                    <div className="border border-gray-300 p-4">
                      <h2 className="text-xl font-bold mb-4">Document Preview</h2>
                      {files.map((file, index) => (
                        <div key={file.name} className="mb-4">
                          <h3 className="font-bold">{`Document ${index + 1}`}</h3>
                          <p><strong>Document Type:</strong> {metadata[index]?.docType}</p>
                          <p><strong>Description:</strong> {metadata[index]?.description}</p>
                          <p><strong>Extra Comments:</strong> {metadata[index]?.comments}</p>
                          {file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                            <div dangerouslySetInnerHTML={{ __html: decodeURIComponent(file.preview.split(',')[1]) }} />
                          ) : file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ? (
                            <div>

                              {handleExcelFile(file, index)}

                              {excelData[index] && excelData[index].map((sheet, i) => (
                                <div key={i}>
                                  <h4 className="font-semibold mt-4">{`${sheet.name}`}</h4>
                                  <table className="min-w-full border border-gray-200 mt-2">
                                    <tbody>
                                      {sheet.data.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                          {row.map((cell, cellIndex) => (
                                            <td key={cellIndex} className="border px-2 py-1">
                                              {cell}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <iframe
                              src={file.preview}
                              title={`Document Preview ${index + 1}`}
                              width="100%"
                              height="200px"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="mb-4">
                <label className="block text-gray-700">Final Description:</label>
                <textarea
                  value={finalDescription}
                  onChange={(e) => setFinalDescription(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                  rows="10"
                  maxLength={500}
                />
              </div>
              <button onClick={handleFinalSubmit} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
                Submit
              </button>
              <button onClick={handleBack} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md ml-4">
                Back
              </button>
            </div>
          )}
          {step === 3 && (
            <div className="flex flex-col items-center">
              <div className="border border-gray-300 p-4 w-full">
                <h2 className="text-xl font-bold mb-4">Quote Ready</h2>
                <iframe src={serverFile} title="Server Response" width="100%" height="600px" />

                <div className="mt-4">
                  <button onClick={() => window.open(serverFile, '_blank')} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Download
                  </button>
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700">Propose Changes:</label>
                  <textarea
                    value={proposedChanges}
                    onChange={(e) => setProposedChanges(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
                    rows="4"
                    maxLength={500}
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700">Upvote:</label>
                  <button
                    onClick={() => setUpvoted(!upvoted)}
                    className={`mt-1 px-4 py-2 rounded-md ${upvoted ? 'bg-green-500' : 'bg-gray-300'} text-white`}
                  >
                    {upvoted ? 'Upvoted' : 'Upvote'}
                  </button>
                </div>

                <div className="mt-4">
                  <button onClick={handleProposeChangesSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-md">
                    Submit Proposed Changes
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const queryClient = new QueryClient();

const JobSpecUploadWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <JobSpecUpload />
  </QueryClientProvider>
);

export default JobSpecUploadWithProviders;
