import React, { useContext, useEffect, useRef, useState } from 'react';
import ChangePasswordModal from './ChangePasswordModal';
import EditProfileModal from './EditProfileModal';
import { uploadImage, useUserData } from '../utilities/api';
import AlertContext from '../contexts/AlertContext';

const UserAccountModal = ({ open, onClose }) => {
  const modalRef = useRef(null);

  const { showAlert } = useContext(AlertContext);

  const [isFetchingAvatar, setIsFetchingAvatar] = useState(false);
  const [isEditingProfilePicture, setIsEditingProfilePicture] = useState(false);

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  const { userData, setAvatarUrl} = useUserData();

  const [previewUrl, setPreviewUrl] = useState(userData?.avatarUrl);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !isChangePasswordModalOpen && !isEditProfileModalOpen) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.classList.add('overflow-hidden');
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.classList.remove('overflow-hidden');
    };
  }, [open, onClose, isChangePasswordModalOpen, isEditProfileModalOpen]);

  useEffect( () => {
      setPreviewUrl(userData?.avatarUrl)
  }, [userData]);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfilePictureUpdate = async () => {
    if (selectedFile) {
      try {
        const imageUrl = await uploadImage(selectedFile, 'avatar');
        if (imageUrl) {
          setPreviewUrl(imageUrl);
          setAvatarUrl(imageUrl);

          showAlert({
            message: 'Avatar updated successfully.',
            severity: "success"
          });
        }
        setIsEditingProfilePicture(false);
        setSelectedFile(null);
      } catch (error) {
        setPreviewUrl(userData.avatarUrl);
        showAlert({
          message: error.message || "Failed to update profile picture",
          severity: "error"
        });
      }
    } 
    else 
    {
      showAlert({
        message: 'No file selected for update',
        severity: "info"
      });
    }
  };


  if (!open) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto backdrop-blur-sm" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/30 transition-opacity" aria-hidden="true"></div>
        
        <div ref={modalRef} className="max-w-[500px] relative bg-white rounded-xl shadow-2xl transform transition-all w-full max-w-2xl">
          <div className="absolute top-4 right-4">
            <button 
              type="button" 
              className="p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">User Profile</h2>
              <p className="text-gray-500">Account details and information</p>
            </div>

            <div className="flex items-start gap-6 mb-8">
              <div className="shrink-0 relative group">
                {!userData || !userData.avatarUrl || isFetchingAvatar ? (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <svg 
                      className="w-12 h-12 text-purple-500"
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                ) : (
                  <>
                    <img
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                      src={previewUrl}
                      alt={`${userData?.name}'s avatar`}
                    />
                    <button
                      onClick={() => setIsEditingProfilePicture(true)}
                      className="absolute inset-0 w-24 h-24 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-sm font-medium"
                    >
                      Change
                    </button>
                  </>
                )}
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-gray-900">{userData?.name}</h3>
                <p className="text-gray-600 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {userData?.email}
                </p>
              </div>
            </div>

            {isEditingProfilePicture && (
              <div className="mb-6 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Change Profile Picture</h4>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  <button
                    onClick={handleProfilePictureUpdate}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditingProfilePicture(false)}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col items-center border-t pt-6">
              <div className="flex gap-4 mb-4">
                <button
                  onClick={() => setIsEditProfileModalOpen(true)}
                  className="px-2 py-1 text-white bg-blue-500 rounded hover:text-gray-800 font-medium transition-colors"
                  onClose={() => setPreviewUrl(userData.avatarUrl)}
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => setIsChangePasswordModalOpen(true)}
                  className="px-2 py-1 text-white bg-blue-500 rounded hover:text-gray-800 font-medium transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {isChangePasswordModalOpen && (
          <ChangePasswordModal 
            isOpen={isChangePasswordModalOpen} 
            onClose={() => setIsChangePasswordModalOpen(false)}
            showAlert={showAlert}
          />
        )}
        {isEditProfileModalOpen && (
          <EditProfileModal 
            isOpen={isEditProfileModalOpen} 
            onClose={() => setIsEditProfileModalOpen(false)}
            showAlert={showAlert}
            currentUserData={userData}
          />
        )}
      </div>
    </div>
  );
};

export default UserAccountModal;