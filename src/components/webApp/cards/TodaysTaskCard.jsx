// src/components/webApp/cards/TodaysTaskCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const TodaysTaskCard = ({ task }) => {
  // Use dummy data if no task is provided
  const defaultTask = {
    id: 1,
    name: "Design Homepage",
    project: "Website Redesign",
    priority: "High",
    status: "In Progress",
    dueTime: "3:00 PM",
  };

  const displayTask = task || defaultTask;

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-yellow-600 bg-yellow-50";
      case "low":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600 bg-green-50";
      case "in progress":
        return "text-blue-600 bg-blue-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Task</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
        {/* Task Name */}
        <div>
          <span className="text-sm text-gray-500">Task Name</span>
          <p className="text-lg font-medium text-gray-900">{displayTask.name}</p>
        </div>

        {/* Project */}
        <div>
          <span className="text-sm text-gray-500">Project</span>
          <p className="text-lg font-medium text-gray-900">{displayTask.project}</p>
        </div>

        {/* Priority */}
        <div>
          <span className="text-sm text-gray-500">Priority</span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
              displayTask.priority
            )}`}
          >
            {displayTask.priority}
          </span>
        </div>

        {/* Status */}
        <div>
          <span className="text-sm text-gray-500">Status</span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
              displayTask.status
            )}`}
          >
            {displayTask.status}
          </span>
        </div>

        {/* Due Time */}
        <div>
          <span className="text-sm text-gray-500">Due Time</span>
          <p className="text-lg font-medium text-gray-900">{displayTask.dueTime}</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="mt-4 flex justify-start">
        <Link
          to={`/task/${displayTask.id}`}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          View task
        </Link>
      </div>
    </div>
  );
};

export default TodaysTaskCard;