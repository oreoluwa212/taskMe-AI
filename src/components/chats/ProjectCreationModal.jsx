// src/components/chat/ProjectCreationModal.jsx
import React from "react";
import { Sparkles, FolderPlus, Zap, Code, Lightbulb } from "lucide-react";

const ProjectCreationModal = ({ isOpen, chatTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 md:p-8 w-full max-w-md shadow-2xl">
        <div className="text-center">
          {/* Animated Icon */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-4 relative overflow-hidden">
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 animate-pulse"></div>

              {/* Main Icon */}
              <FolderPlus
                size={32}
                className="text-blue-600 z-10 animate-bounce"
              />

              {/* Floating Icons */}
              <Sparkles
                size={12}
                className="absolute top-2 right-2 text-purple-500 animate-pulse"
                style={{ animationDelay: "0.5s" }}
              />
              <Code
                size={10}
                className="absolute bottom-2 left-2 text-blue-500 animate-pulse"
                style={{ animationDelay: "1s" }}
              />
              <Lightbulb
                size={10}
                className="absolute top-2 left-2 text-yellow-500 animate-pulse"
                style={{ animationDelay: "1.5s" }}
              />
            </div>

            {/* Spinning Ring */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">
              Creating Your Project
            </h3>

            <p className="text-gray-600 text-base leading-relaxed">
              TaskMe AI is analyzing your conversation
              {chatTitle && (
                <span className="block mt-1 font-medium text-blue-600">
                  "{chatTitle}"
                </span>
              )}
              and generating a comprehensive project for you.
            </p>

            {/* Progress Steps */}
            <div className="mt-8 space-y-3">
              <ProgressStep
                icon={Zap}
                text="Analyzing conversation context"
                isActive={true}
              />
              <ProgressStep
                icon={Code}
                text="Extracting project requirements"
                isActive={true}
                delay="0.5s"
              />
              <ProgressStep
                icon={FolderPlus}
                text="Generating project structure"
                isActive={true}
                delay="1s"
              />
              <ProgressStep
                icon={Sparkles}
                text="Finalizing your project"
                isActive={true}
                delay="1.5s"
              />
            </div>

            {/* Loading Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                ></div>
              ))}
            </div>

            <p className="text-sm text-gray-500 mt-4">
              This usually takes just a few seconds...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ProgressStep Component
const ProgressStep = ({ icon: Icon, text, isActive, delay = "0s" }) => (
  <div className="flex items-center space-x-3 text-left">
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
        isActive ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"
      }`}
      style={{ animationDelay: delay }}
    >
      <Icon
        size={12}
        className={isActive ? "animate-pulse" : ""}
        style={{ animationDelay: delay }}
      />
    </div>
    <span
      className={`text-sm transition-colors duration-500 ${
        isActive ? "text-gray-900" : "text-gray-500"
      }`}
      style={{ animationDelay: delay }}
    >
      {text}
    </span>
  </div>
);

export default ProjectCreationModal;
