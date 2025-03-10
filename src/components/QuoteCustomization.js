import React, { useState, useEffect, useContext } from 'react';
import { FiUploadCloud, FiCheckCircle, FiEye } from 'react-icons/fi';
import { fetchImage, fetchPdf, uploadImage, uploadPdf } from '../utilities/api';
import AlertContext from '../contexts/AlertContext';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

const FileUploadField = ({ label, accept, preview, maxSize, type, isUploading, error, onClick }) => {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div
        onClick={onClick}
        className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 transition-colors cursor-pointer"
      >
        <div className="text-center w-full">
          {isUploading ? (
            <div className="flex items-center justify-center space-x-2 text-blue-600">
              <svg className="animate-spin h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16M12 4v16" />
              </svg>
              <span className="text-sm">Uploading...</span>
            </div>
          ) : preview ? (
            <div className="flex flex-col items-center">
              {type === 'image' ? (
                <img src={preview} alt="Preview" className="w-16 h-16 rounded-md object-cover mb-2" />
              ) : (
                <p className="text-sm">{preview || 'PDF uploaded'}</p>
              )}
              <FiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          ) : (
            <>
              <FiUploadCloud className="mx-auto w-8 h-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">{accept.toUpperCase()} up to {maxSize / 1024 / 1024}MB</p>
            </>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 p-2 bg-red-100 border border-red-200 rounded-md">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

const QuoteCustomization = ({ setPdfUrl }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [firstPagePreview, setFirstPagePreview] = useState(null);
  const [otherPagesPreview, setOtherPagesPreview] = useState(null);
  const [aboutUsPDF, setAboutUsPDF] = useState(null);
  const [aboutUsFileName, setAboutUsFileName] = useState(null);
  const [uploadingStates, setUploadingStates] = useState({
    logo: false,
    firstPage: false,
    otherPages: false,
    aboutPdf: false,
  });
  const [errors, setErrors] = useState({
    logo: null,
    firstPage: null,
    otherPages: null,
    aboutPdf: null,
  });

  const { showAlert } = useContext(AlertContext);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [logoData, firstPageData, otherPagesData, pdfBlob] = await Promise.all([
          fetchImage('logo').catch(() => null),
          fetchImage('page_one_background').catch(() => null),
          fetchImage('other_pages_background').catch(() => null),
          fetchPdf('about').catch(() => null),
        ]);

        setLogoPreview(logoData || null);
        setFirstPagePreview(firstPageData || null);
        setOtherPagesPreview(otherPagesData || null);

        if (pdfBlob) {
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setAboutUsPDF(pdfUrl);
          setAboutUsFileName("about.pdf");
        }
      } catch (err) {
        console.error('Error fetching resources:', err);
      }
    };

    fetchResources();
  }, []);

  const handleViewPdf = () => {
    if (aboutUsPDF) {
      setPdfUrl(aboutUsPDF);
    }
  };

  const handleFileUpload = async (file, type, setPreview, inputId) => {
    if (file?.size > MAX_FILE_SIZE) {
      setErrors((prev) => ({ ...prev, [inputId]: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB` }));
      showAlert({ message: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB`, severity: "error" });
      return;
    }

    try {
      setUploadingStates((prev) => ({ ...prev, [inputId]: true }));
      setErrors((prev) => ({ ...prev, [inputId]: null })); // Clear error for this input

      if (type === 'image') {
        await uploadImage(file, inputId);
        if(inputId === 'logo')
        {
          setPreview(URL.createObjectURL(file));
        }
        else if(inputId === 'page_one_background')
        {
          setFirstPagePreview(URL.createObjectURL(file));
        }
        else if(inputId === 'other_pages_background')
        {
          setOtherPagesPreview(URL.createObjectURL(file));
        }
        
        showAlert({ message: "Image updated successfully.", severity: "success" });
      } else if (type === 'pdf') {
        await uploadPdf(file, 'about');
        setAboutUsPDF(URL.createObjectURL(file));
        setAboutUsFileName(file.name);
        showAlert({ message: "PDF uploaded successfully.", severity: "success" });
      }
    } catch (err) {
      setErrors((prev) => ({ ...prev, [inputId]: err.message || "Upload failed" }));
      showAlert({ message: "Error uploading file.", severity: "error" });
    } finally {
      setUploadingStates((prev) => ({ ...prev, [inputId]: false }));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-100 rounded-xl shadow-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Quote Customization
      </h2>

      <div className="space-y-8">
        <FileUploadField
          label="Company Logo"
          accept="image/*"
          preview={logoPreview}
          maxSize={MAX_FILE_SIZE}
          type="image"
          isUploading={uploadingStates.logo}
          error={errors.logo}
          onClick={() => document.getElementById('logo-upload').click()}
        />
        <input
          id="logo-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files[0], 'image', setLogoPreview, 'logo')}
        />

        <FileUploadField
          label="First Page Background"
          accept="image/*"
          preview={firstPagePreview}
          maxSize={MAX_FILE_SIZE}
          type="image"
          isUploading={uploadingStates.firstPage}
          error={errors.firstPage}
          onClick={() => document.getElementById('first-page-upload').click()}
        />
        <input
          id="first-page-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files[0], 'image', setFirstPagePreview, 'page_one_background')}
        />

        <FileUploadField
          label="Other Pages Background"
          accept="image/*"
          preview={otherPagesPreview}
          maxSize={MAX_FILE_SIZE}
          type="image"
          isUploading={uploadingStates.otherPages}
          error={errors.otherPages}
          onClick={() => document.getElementById('other-pages-upload').click()}
        />
        <input
          id="other-pages-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileUpload(e.target.files[0], 'image', setOtherPagesPreview, 'other_pages_background')}
        />

        <FileUploadField
          label="About Us PDF"
          accept=".pdf"
          preview={aboutUsFileName ? "About Us PDF Is Active" : null}
          maxSize={MAX_FILE_SIZE}
          type="pdf"
          isUploading={uploadingStates.aboutPdf}
          error={errors.aboutPdf}
          onClick={() => document.getElementById('about-pdf-upload').click()}
        />
        <input
          id="about-pdf-upload"
          type="file"
          className="hidden"
          accept=".pdf"
          onChange={(e) => handleFileUpload(e.target.files[0], 'pdf', setAboutUsPDF, 'aboutPdf')}
        />

        {aboutUsPDF && (
          <button
            onClick={handleViewPdf}
            className="flex items-center gap-2 px-4 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            <FiEye className="w-5 h-5" />
            View Current About Us PDF
          </button>
        )}
      </div>
    </div>
  );
};

export default QuoteCustomization;