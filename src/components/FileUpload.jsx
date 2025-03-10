import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUpload = ({ onNext, onAddAnother }) => {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: '.pdf,.doc,.docx,.txt,.xls,.xlsx',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const handleNext = () => {
    onNext(files);
  };

  return (
    <div className="container mx-auto p-4">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      {files.map((file, index) => (
        <div key={index} className="mt-4">
          <p>{file.name}</p>
        </div>
      ))}
      <button
        onClick={handleNext}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Next
      </button>
      <button
        onClick={onAddAnother}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md ml-4"
      >
        Add Another File
      </button>
    </div>
  );
};

export default FileUpload;
