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
        return "text-red-700 bg-red-100 border-red-200";
      case "medium":
        return "text-amber-700 bg-amber-100 border-amber-200";
      case "low":
        return "text-green-700 bg-green-100 border-green-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-700 bg-green-100 border-green-200";
      case "in progress":
        return "text-blue-700 bg-blue-100 border-blue-200";
      case "pending":
        return "text-amber-700 bg-amber-100 border-amber-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "🔴";
      case "medium":
        return "🟡";
      case "low":
        return "🟢";
      default:
        return "⚪";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Today's Task</h3>
          <div className="text-sm text-gray-500">
            Due:{" "}
            <span className="font-medium text-gray-700">
              {displayTask.dueTime}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Task Title & Project */}
        <div className="mb-6">
          <h4 className="text-xl font-bold text-gray-900 mb-2">
            {displayTask.name}
          </h4>
          <p className="text-gray-600 bg-gray-50 px-3 py-1 rounded-lg inline-block">
            📁 {displayTask.project}
          </p>
        </div>

        {/* Priority & Status Row */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Priority:</span>
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                displayTask.priority
              )}`}
            >
              <span className="text-xs">
                {getPriorityIcon(displayTask.priority)}
              </span>
              {displayTask.priority}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                displayTask.status
              )}`}
            >
              {displayTask.status}
            </span>
          </div>
        </div>

        {/* Progress Bar (visual enhancement) */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {displayTask.status === "Completed"
                ? "100%"
                : displayTask.status === "In Progress"
                ? "60%"
                : "0%"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                displayTask.status === "Completed"
                  ? "bg-green-500 w-full"
                  : displayTask.status === "In Progress"
                  ? "bg-blue-500 w-3/5"
                  : "bg-gray-400 w-0"
              }`}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-between items-center">
          <Link
            to={`/task/${displayTask.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <span>View Task</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>

          <div className="text-xs text-gray-500">ID: #{displayTask.id}</div>
        </div>
      </div>
    </div>
  );
};

export default TodaysTaskCard;
