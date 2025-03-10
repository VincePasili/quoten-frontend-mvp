import React, { useEffect, useRef } from 'react';
import { FiX, FiMail, FiPhone, FiMapPin, FiFile, FiLock } from 'react-icons/fi';

const ContactInfoModal = ({ open, onClose }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.classList.add('overflow-hidden');
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed z-50 inset-0 overflow-y-auto backdrop-blur-sm"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/30 transition-opacity"
          aria-hidden="true"
        ></div>

        {/* Modal Container */}
        <div
          ref={modalRef}
          className="relative bg-white rounded-xl shadow-2xl transform transition-all w-full max-w-lg mx-auto"
        >
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="px-8 pb-8">
            <div className="text-center mb-6">
              <h2 id="modal-title" className="text-3xl font-bold text-gray-900 mb-1">
                Contact Us
              </h2>
              <p className="text-gray-500">
                We're here to help. Get in touch with us!
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <FiMail className="w-6 h-6 text-blue-500 mr-2" />
                <a
                  href="mailto:quoten@gmail.com"
                  className="text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  quoten@gmail.com
                </a>
              </div>
              <div className="flex items-center justify-center">
                <FiPhone className="w-6 h-6 text-green-500 mr-2" />
                <span className="text-lg font-medium text-gray-700">
                  (555) 123-4567
                </span>
              </div>
              <div className="flex items-center justify-center">
                <FiMapPin className="w-6 h-6 text-red-500 mr-2" />
                <span className="text-lg font-medium text-gray-700">
                  123 Main Street, Anytown, USA 12345
                </span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                For more information, please refer to our:
              </p>
              <div className="mt-2 flex items-center justify-center space-x-4">
                <a
                  href="/legal#terms"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FiFile className="w-4 h-4 mr-1" />
                  <span className="underline">Terms of Service</span>
                </a>
                <span className="text-gray-400">|</span>
                <a
                  href="/legal#privacy"
                  className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <FiLock className="w-4 h-4 mr-1" />
                  <span className="underline">Privacy Policy</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoModal;
