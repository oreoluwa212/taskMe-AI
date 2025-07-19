// src/components/layout/DashboardLayout.jsx
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Sidebar from "../webApp/Sidebar";
import Header from "../webApp/Header";

const DashboardLayout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-40 lg:relative lg:z-auto">
          <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Fixed Header */}
        <div className="sticky top-0 z-30 lg:top-0">
          <Header />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto pt-16 lg:pt-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
