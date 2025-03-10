import React, { useState } from 'react';
import { FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { FaLock } from 'react-icons/fa'
import { changeUserPassword } from '../utilities/api';

const ChangePasswordModal = ({ isOpen, onClose, showAlert }) => {
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [formValues, setFormValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleUpdatePassword = async () => {
    const { currentPassword, newPassword, confirmPassword } = formValues;

    if (!currentPassword || !newPassword || !confirmPassword) {
        showAlert({
            message: "Please fill out all fields.",
            severity: "error"
        });
      return;
    }

    if (newPassword !== confirmPassword) {
        showAlert({
            message: "New passwords do not match!",
            severity: "error"
        });
      return;
    }

    setIsLoading(true);
    try {
      await changeUserPassword(currentPassword, newPassword, confirmPassword);
      showAlert({
            message: "Password updated successfully!",
            severity: "success"
        });
      onClose();
    } catch (error) {
      showAlert({
          message: error.message || "There was an error updating your password. Please try again.",
          severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed sm:max-w-lg z-10 inset-0 m-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Change Password
              </h3>
              <button
                type="button"
                className="text-gray-800 hover:text-gray-900 hover:bg-gray-200 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                onClick={onClose}
                aria-label="Close modal"
              >
                ✖
              </button>
            </div>

            <div className="mt-2">
              {/* Current Password */}
              <div className="relative mb-4">
                <FiLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type={showPassword.currentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formValues.currentPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
                  placeholder="Current Password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('currentPassword')}
                  className="absolute w-5 h-5 top-3 right-5 text-gray-600 focus:outline-none"
                >
                  {showPassword.currentPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* New Password */}
              <div className="relative mb-4">
                <FiLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type={showPassword.newPassword ? "text" : "password"}
                  name="newPassword"
                  value={formValues.newPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
                  placeholder="New Password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('newPassword')}
                  className="absolute w-5 h-5 top-3 right-5 text-gray-600 focus:outline-none"
                >
                  {showPassword.newPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative mb-4">
                <FiLock className="absolute left-3 top-3 text-gray-500" />
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formValues.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-2 bg-transparent placeholder:text-slate-400 text-slate-600 text-sm border border-slate-200 rounded-md focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm"
                  placeholder="Confirm New Password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirmPassword')}
                  className="absolute w-5 h-5 top-3 right-5 text-gray-600 focus:outline-none"
                >
                  {showPassword.confirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div className="mt-5 mb-5 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                onClick={handleUpdatePassword}
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
                    <span>Changing Password...</span>
                  </>
                ) : (
                  <>
                    <FaLock className="mr-2" size={20} />
                    Change Password
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
