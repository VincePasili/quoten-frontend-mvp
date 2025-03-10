import React from "react";

const ActionButton = ({ 
  defaultText, 
  loadingText, 
  isLoading, 
  handleAction, 
  type = "button" 
}) => {
  return (
    <button
      type={type}
      onClick={handleAction ? handleAction : undefined} // Only include onClick if handleAction is provided
      disabled={isLoading}
      className={`w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md flex items-center justify-center ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      }`}
    >
      {isLoading ? (
        <div className="flex items-center">
          <span className="mr-2">{loadingText}</span>
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
        </div>
      ) : (
        defaultText
      )}
    </button>
  );
};

export default ActionButton;
