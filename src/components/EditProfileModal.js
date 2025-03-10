import React, { useState, useEffect } from 'react';
import { FiSave } from "react-icons/fi";  
import { useUserData, uploadImage, updateUserData } from '../utilities/api'

const EditProfileModal = ({ isOpen, onClose, showAlert  }) => {

  const { userData, setAvatarUrl, setEmail, setName } = useUserData();
  
  const [formValues, setFormValues] = useState({
    fullName: userData?.name || "",
    email: userData?.email || "",
    avatar: userData?.avatarUrl || "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUpdatingAvatar, setIsUpdatingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  
  useEffect(() => {
    if (userData) {
      setFormValues({
        fullName: userData.name || "",
        email: userData.email || "",
        avatar: userData.avatarUrl || "",
      });
    }
  }, [userData]);

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFormValues((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  // Handle profile picture upload
  const handleProfilePictureUpdate = async () => {
    if (!selectedFile) {
      showAlert({ message: "No file selected for update", severity: "info" });
      return;
    }

    try {
      setIsUpdatingAvatar(true);
      const imageUrl = await uploadImage(selectedFile, "avatar");

      if (imageUrl) {
        setFormValues((prev) => ({ ...prev, avatar: imageUrl }));
        setAvatarUrl(imageUrl); // Update global state

        showAlert({ message: "Avatar updated successfully.", severity: "success" });
      }

      setSelectedFile(null);
    } catch (error) {
      showAlert({ message: error.message || "Failed to update profile picture", severity: "error" });
    } finally {
      setIsUpdatingAvatar(false);
    }
  };

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    let avatarUrl = formValues.avatar;
    let avatarUploadSuccess = false;
    let userDataUpdateSuccess = false;
    
    try {
      
      setIsLoading(true);
      if (selectedFile) {
        setIsUpdatingAvatar(true);
        try {
          avatarUrl = await uploadImage(selectedFile, "avatar");
          setAvatarUrl(avatarUrl);
          avatarUploadSuccess = true;
          showAlert({ message: "Avatar updated successfully.", severity: "success" });
        } catch (error) {
          showAlert({ message: error.message || "Failed to update avatar.", severity: "error" });
        } finally {
          setIsUpdatingAvatar(false);
        }
      }
  
      try {
        await updateUserData(formValues.fullName, formValues.email);
        setName(formValues.fullName);
        setEmail(formValues.email);
        userDataUpdateSuccess = true;
        showAlert({ message: "Profile details updated successfully.", severity: "success" });
      } catch (error) {
        showAlert({ message: error.message || "Failed to update profile details.", severity: "error" });
      }
  
      if (avatarUploadSuccess || userDataUpdateSuccess) {
        onClose();
      }
    } catch (error) {
      showAlert({ message: error.message || "Something went wrong.", severity: "error" });
    }
    finally {
        setIsLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <div className="fixed max-w-[400px] z-10 inset-0 m-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Edit Profile
              </h3>
              <button type="button" className="text-gray-800 hover:text-gray-900 hover:bg-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={onClose} aria-label="Close modal">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-2">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    {/* Show default avatar if no avatar is set */}
                    {!formValues.avatar ? (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <svg 
                          className="w-10 h-10 text-purple-500"
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    ) : (
                      <img 
                        src={formValues.avatar} 
                        alt="Profile preview" 
                        className="w-16 h-16 rounded-full object-cover" 
                      />
                    )}
                                   <input 
                      type="file" 
                      onChange={handleFileChange}
                      accept="image/*"
                      className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                  </div>
                </div>


                <div className="mb-4">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formValues.fullName}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-10 pr-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                      placeholder="Full Name"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute w-5 h-5 top-2.5 left-2.5 text-slate-600">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                    <input 
                      type="email" 
                      name="email" 
                      value={formValues.email}
                      onChange={handleChange}
                      className="mt-1 block w-full pl-10 pr-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 mb-5">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex px-4 py-2 bg-blue-600 text-white text-sm font-normal rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="mr-2 animate-spin-slow"
                        viewBox="0 0 1792 1792"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z"></path>
                      </svg>
                      <span>Saving Changes</span>
                    </>
                  ) : (
                    <>
                     <FiSave className="mr-2" size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;