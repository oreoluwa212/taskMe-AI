// src/pages/ProjectOverview.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineFlag,
} from "react-icons/hi";
import { useProjectStore } from "../../store/projectStore";
import LoadingSpinner from "../../components/ui/LoadingSpinner";
import ErrorMessage from "../../components/ui/ErrorMessage";

const ProjectOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const {
    currentProject,
    loading,
    error,
    fetchProjectById,
    getProjectById,
    clearCurrentProject,
    clearError,
  } = useProjectStore();

  useEffect(() => {
    if (id) {
      loadProject();
    }

    // Cleanup on unmount
    return () => {
      clearCurrentProject();
      clearError();
    };
  }, [id]);

  const loadProject = async () => {
    try {
      // First try to get from store
      const storeProject = getProjectById(id);
      if (storeProject) {
        console.log("Project found in store:", storeProject);
        return;
      }

      // If not in store, fetch from API
      await fetchProjectById(id);
    } catch (error) {
      console.error("Error loading project:", error);
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleRetry = () => {
    loadProject();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Not set";
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    if (progress >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="lgss:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800">Project Details</h1>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <LoadingSpinner size={40} />
              <p className="text-gray-600">Loading project details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lgss:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Project Details</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Header */}
        <Header />

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Back Button */}
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-6"
            >
              <IoIosArrowRoundBack className="text-3xl" />
              <span className="text-lg font-semibold">Back to Dashboard</span>
            </button>

            {/* Error Message */}
            {error && (
              <ErrorMessage
                message={error}
                onRetry={handleRetry}
                className="mb-6"
              />
            )}

            {/* Project Details */}
            {currentProject ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Project Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-8 text-white">
                  <h1 className="text-3xl font-bold mb-2">
                    {currentProject.name}
                  </h1>
                  {currentProject.description && (
                    <p className="text-blue-100 text-lg">
                      {currentProject.description}
                    </p>
                  )}
                </div>

                {/* Project Info Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Start Date */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                        <HiOutlineCalendar className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Start Date
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(currentProject.startDate)}
                        </p>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                        <HiOutlineCalendar className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Due Date
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatDate(currentProject.dueDate)}
                        </p>
                      </div>
                    </div>

                    {/* Due Time */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                        <HiOutlineClock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Due Time
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {formatTime(currentProject.dueTime)}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
                        <HiOutlineCalendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Timeline
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          {currentProject.timeline
                            ? `${currentProject.timeline} days`
                            : "Not specified"}
                        </p>
                      </div>
                    </div>

                    {/* Priority */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                        <HiOutlineFlag className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Priority
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                            currentProject.priority
                          )}`}
                        >
                          {currentProject.priority || "Not set"}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                        <span className="text-indigo-600 font-semibold text-sm">
                          {currentProject.progress || 0}%
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-500">
                          Progress
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                          <div
                            className={`h-2.5 rounded-full transition-all duration-300 ${getProgressColor(
                              currentProject.progress || 0
                            )}`}
                            style={{
                              width: `${currentProject.progress || 0}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Project Stats */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Project Statistics
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {currentProject.progress || 0}%
                        </div>
                        <div className="text-sm text-gray-600">Complete</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {currentProject.timeline || 0}
                        </div>
                        <div className="text-sm text-gray-600">Total Days</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {currentProject.priority || "None"}
                        </div>
                        <div className="text-sm text-gray-600">Priority</div>
                      </div>
                      <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600">
                          {currentProject.progress >= 100
                            ? "Complete"
                            : "In Progress"}
                        </div>
                        <div className="text-sm text-gray-600">Status</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              !loading && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <div className="text-gray-400 text-6xl mb-4">📋</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Project Not Found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    The project you're looking for doesn't exist or has been
                    deleted.
                  </p>
                  <button
                    onClick={handleBack}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
