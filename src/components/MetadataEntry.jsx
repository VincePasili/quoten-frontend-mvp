import React, { useState } from 'react';

const MetadataEntry = ({ files, onSubmit, onBack }) => {
  const [metadata, setMetadata] = useState(
    files.map(() => ({
      docType: '',
      description: '',
      comments: '',
    }))
  );

  const handleMetadataChange = (index, key, value) => {
    const newMetadata = [...metadata];
    newMetadata[index] = { ...newMetadata[index], [key]: value };
    setMetadata(newMetadata);
  };

  const handleNext = () => {
    onSubmit(metadata);
  };

  return (
    <div className="container mx-auto p-4">
      {files.map((file, index) => (
        <div key={index} className="mb-4">
          <h3 className="font-bold">Document {index + 1}</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Document Type:</label>
            <input
              type="text"
              value={metadata[index]?.docType || ''}
              onChange={(e) =>
                handleMetadataChange(index, 'docType', e.target.value)
              }
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
              maxLength={500}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Description:</label>
            <textarea
              value={metadata[index]?.description || ''}
              onChange={(e) =>
                handleMetadataChange(index, 'description', e.target.value)
              }
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
              maxLength={500}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Extra Comments:</label>
            <textarea
              value={metadata[index]?.comments || ''}
              onChange={(e) =>
                handleMetadataChange(index, 'comments', e.target.value)
              }
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md"
              maxLength={500}
            />
          </div>
        </div>
      ))}
      <button
        onClick={handleNext}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Next
      </button>
      <button
        onClick={onBack}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md ml-4"
      >
        Back
      </button>
    </div>
  );
};

export default MetadataEntry;
