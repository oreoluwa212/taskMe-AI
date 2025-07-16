// src/components/webApp/cards/UpcomingDeadlineCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../../utils/dateUtils";

const UpcomingDeadlineCard = ({ deadline }) => {
  // Use dummy data if no deadline is provided
  const defaultDeadline = {
    project: "Brand Design",
    taskName: "Finalize Logo Design",
    dueDate: "2024-06-17",
    dueTime: "5:00 PM",
    priority: "Medium",
    taskId: 2,
  };

  const displayDeadline = deadline || defaultDeadline;

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

  // Calculate days until deadline
  const daysUntilDeadline = () => {
    const today = new Date();
    const deadlineDate = new Date(displayDeadline.dueDate);
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const daysLeft = daysUntilDeadline();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Upcoming Deadline
      </h3>

      <div className="space-y-4">
        {/* Project */}
        <div>
          <span className="text-sm text-gray-500">Project</span>
          <p className="text-lg font-medium text-gray-900">
            {displayDeadline.project}
          </p>
        </div>

        {/* Task Name */}
        <div>
          <span className="text-sm text-gray-500">Task Name</span>
          <p className="text-lg font-medium text-gray-900">
            {displayDeadline.taskName}
          </p>
        </div>

        {/* Due Date */}
        <div>
          <span className="text-sm text-gray-500">Due Date</span>
          <p className="text-lg font-medium text-gray-900">
            {formatDate(displayDeadline.dueDate)}
          </p>
        </div>

        {/* Due Time */}
        <div>
          <span className="text-sm text-gray-500">Due Time</span>
          <p className="text-lg font-medium text-gray-900">
            {displayDeadline.dueTime}
          </p>
        </div>

        {/* Priority */}
        <div>
          <span className="text-sm text-gray-500">Priority</span>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(
              displayDeadline.priority
            )}`}
          >
            {displayDeadline.priority}
          </span>
        </div>

        {/* Days Left Indicator */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Time remaining</span>
            <span
              className={`text-sm font-medium ${
                daysLeft <= 1
                  ? "text-red-600"
                  : daysLeft <= 3
                  ? "text-yellow-600"
                  : "text-green-600"
              }`}
            >
              {daysLeft === 0
                ? "Due today"
                : daysLeft === 1
                ? "1 day left"
                : daysLeft < 0
                ? "Overdue"
                : `${daysLeft} days left`}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <Link
            to={`/task/${displayDeadline.taskId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors w-full justify-center"
          >
            Finish task →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UpcomingDeadlineCard;
