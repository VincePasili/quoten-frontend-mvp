// src/pages/Generator.js
import { Button, Navbar, Sidebar } from "flowbite-react";
import React, { useContext } from 'react';
import AuthContext  from '../contexts/AuthContext';
import logo from '../assets/logo/greenhat-logo.svg';
import LeftPanel from "../components/LeftPanel"
import JobSpecUploadWithProviders from "../components/JobSpecUpload";

const Generator = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="flex flex-col h-screen">
      <div className="mb-10">
        <Navbar fluid rounded>
          <Navbar.Brand href="#">
            <img src={logo} className="mr-3 h-6 sm:h-9" alt="Greenhat logo" />
            {/* <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Quoten</span> */}
          </Navbar.Brand>
          <div className="flex md:order-2">
            <button
              onClick={logout}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Logout
            </button>
            <Navbar.Toggle />
          </div>
        </Navbar>
      </div>
       {/* Main content area */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left Panel */}
              <div className="bg-gray-100 w-64 flex-shrink-0 border-r border-black-300">
                <LeftPanel />
              </div>
              {/* Right Content */}
              <div className="flex-1 p-10 overflow-y-auto">
                <JobSpecUploadWithProviders />
              </div>
            </div>
    </div>
  );
};

export default Generator;