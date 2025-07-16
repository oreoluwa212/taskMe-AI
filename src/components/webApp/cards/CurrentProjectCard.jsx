// src/components/webApp/cards/CurrentProjectCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dateUtils";

const CurrentProjectCard = ({ project }) => {
  // Use dummy data if no project is provided
  const defaultProject = {
    id: 1,
    name: "Website Redesign",
    progress: 75,
    deadline: "2024-06-15",
  };

  const displayProject = project || defaultProject;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Current Project</h3>
        <Link
          to={`/project/${displayProject.id}/details`}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          View all →
        </Link>
      </div>

      {/* Project Card */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-100">
        {/* Project Name */}
        <div className="mb-4">
          <h4 className="text-xl font-semibold text-gray-900 mb-1">
            {displayProject.name}
          </h4>
          <p className="text-sm text-gray-600">
            Due {formatDate(displayProject.deadline)}
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-semibold text-blue-600">
              {displayProject.progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${displayProject.progress}%` }}
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Link
            to={`/project/${displayProject.id}/details`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            View Project
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-900">12</div>
          <div className="text-xs text-gray-500">Total Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-green-600">9</div>
          <div className="text-xs text-gray-500">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-yellow-600">3</div>
          <div className="text-xs text-gray-500">Pending</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentProjectCard;
