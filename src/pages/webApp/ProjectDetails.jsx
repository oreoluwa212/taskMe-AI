import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/projectStore";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Save,
  X,
  Clock,
  CheckCircle,
  Zap,
  Calendar,
  ClipboardList,
  Target,
  TrendingUp,
} from "lucide-react";

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    fetchProjectById,
    updateProject,
    updateProjectProgress,
    deleteProject,
    loading,
  } = useProjectStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subtasks, setSubtasks] = useState([]);
  const [projectStats, setProjectStats] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProjectById(id)
        .then((response) => {
          console.log("Full project response:", response);

          // Handle subtasks - they're directly in the response data
          if (response?.subtasks && Array.isArray(response.subtasks)) {
            setSubtasks(response.subtasks);
          }

          // Handle project stats
          if (response?.stats) {
            setProjectStats(response.stats);
          }
        })
        .catch((err) => {
          toast.error("Failed to fetch project details");
          console.error("Error fetching project:", err);
        });
    }
  }, [id, fetchProjectById]);

  useEffect(() => {
    if (currentProject) {
      setEditData({
        name: currentProject.name || "",
        description: currentProject.description || "",
        priority: currentProject.priority || "Medium",
        status: currentProject.status || "Pending",
        progress: currentProject.progress || 0,
        timeline: currentProject.timeline || 30,
        category: currentProject.category || "",
        tags: currentProject.tags || [],
        startDate: currentProject.startDate
          ? new Date(currentProject.startDate).toISOString().split("T")[0]
          : "",
        dueDate: currentProject.dueDate
          ? new Date(currentProject.dueDate).toISOString().split("T")[0]
          : "",
        dueTime: currentProject.dueTime || "12:00",
      });
    }
  }, [currentProject]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProject(id, editData);
      setIsEditing(false);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentProject) {
      setEditData({
        name: currentProject.name || "",
        description: currentProject.description || "",
        priority: currentProject.priority || "Medium",
        status: currentProject.status || "Pending",
        progress: currentProject.progress || 0,
        timeline: currentProject.timeline || 30,
        category: currentProject.category || "",
        tags: currentProject.tags || [],
        startDate: currentProject.startDate
          ? new Date(currentProject.startDate).toISOString().split("T")[0]
          : "",
        dueDate: currentProject.dueDate
          ? new Date(currentProject.dueDate).toISOString().split("T")[0]
          : "",
        dueTime: currentProject.dueTime || "12:00",
      });
    }
  };

  const handleProgressUpdate = async (newProgress) => {
    try {
      await updateProjectProgress(id, newProgress);
      toast.success("Progress updated successfully");
    } catch (error) {
      toast.error("Failed to update progress");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(id);
      toast.success("Project deleted successfully");
      navigate("/projects");
    } catch (error) {
      toast.error("Failed to delete project");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDaysRemaining = () => {
    if (!currentProject?.dueDate) return "N/A";

    // Use the calculated values from the API if available
    if (currentProject.daysRemaining !== undefined) {
      const days = currentProject.daysRemaining;
      if (days < 0) {
        return `${Math.abs(days)} days overdue`;
      } else if (days === 0) {
        return "Due today";
      } else {
        return `${days} days remaining`;
      }
    }

    // Fallback calculation
    const today = new Date();
    const dueDate = new Date(currentProject.dueDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (daysDiff < 0) {
      return `${Math.abs(daysDiff)} days overdue`;
    } else if (daysDiff === 0) {
      return "Due today";
    } else {
      return `${daysDiff} days remaining`;
    }
  };

  const getCompletionDate = () => {
    if (currentProject?.progress === 100) {
      return formatDate(currentProject.updatedAt);
    }
    return currentProject?.completionStatus || "Not completed";
  };

  const handleTagsChange = (e) => {
    const value = e.target.value;
    const tagsArray = value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setEditData({ ...editData, tags: tagsArray });
  };

  const getSubtaskStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Project Not Found
          </h2>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Projects
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-blue-600 hover:text-blue-800 mb-2 flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Project Details
            </h1>
          </div>
          <div className="flex gap-3">
            {!isEditing ? (
              <>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Edit size={16} />
                  Edit Project
                </button>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>

        {/* Project Overview Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="text-2xl font-bold w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {currentProject.name}
                </h1>
              )}

              {/* Project Status Indicators */}
              <div className="flex items-center gap-4 mt-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                    currentProject.status
                  )}`}
                >
                  {currentProject.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(
                    currentProject.priority
                  )}`}
                >
                  {currentProject.priority} Priority
                </span>
                {currentProject.isOverdue && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                    Overdue
                  </span>
                )}
              </div>
            </div>

            {/* Progress Circle */}
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20">
                <svg
                  className="w-20 h-20 transform -rotate-90"
                  viewBox="0 0 36 36"
                >
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeDasharray={`${currentProject.progress || 0}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">
                    {currentProject.progress || 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Project Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {currentProject.description || "No description provided"}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {currentProject.category || "Not specified"}
                    </p>
                  )}
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timeline (Days)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editData.timeline}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          timeline: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {currentProject.timeline} days
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.startDate}
                      onChange={(e) =>
                        setEditData({ ...editData, startDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {formatDate(currentProject.startDate)}
                    </p>
                  )}
                </div>

                {/* Due Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={editData.dueDate}
                      onChange={(e) =>
                        setEditData({ ...editData, dueDate: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {formatDate(currentProject.dueDate)}
                    </p>
                  )}
                </div>

                {/* Tags */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.tags?.join(", ") || ""}
                      onChange={handleTagsChange}
                      placeholder="Enter tags separated by commas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {currentProject.tags && currentProject.tags.length > 0 ? (
                        currentProject.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">No tags</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Progress Management
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${currentProject.progress || 0}%` }}
                  ></div>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {currentProject.progress || 0}%
                </span>
              </div>

              {!isEditing && (
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleProgressUpdate(0)}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                  >
                    0%
                  </button>
                  <button
                    onClick={() => handleProgressUpdate(25)}
                    className="px-3 py-1 bg-blue-200 text-blue-700 rounded hover:bg-blue-300 text-sm"
                  >
                    25%
                  </button>
                  <button
                    onClick={() => handleProgressUpdate(50)}
                    className="px-3 py-1 bg-blue-200 text-blue-700 rounded hover:bg-blue-300 text-sm"
                  >
                    50%
                  </button>
                  <button
                    onClick={() => handleProgressUpdate(75)}
                    className="px-3 py-1 bg-blue-200 text-blue-700 rounded hover:bg-blue-300 text-sm"
                  >
                    75%
                  </button>
                  <button
                    onClick={() => handleProgressUpdate(100)}
                    className="px-3 py-1 bg-green-200 text-green-700 rounded hover:bg-green-300 text-sm"
                  >
                    100%
                  </button>
                </div>
              )}
            </div>

            {/* Subtasks Section - Updated with stats info */}
            {projectStats && projectStats.totalSubtasks > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Subtasks Overview
                  </h2>
                  <span className="text-sm text-gray-500">
                    {projectStats.totalSubtasks} total subtasks
                  </span>
                </div>

                {/* Subtasks Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {projectStats.totalSubtasks}
                    </div>
                    <div className="text-sm text-gray-600">Total</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {projectStats.completedSubtasks}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {projectStats.pendingSubtasks}
                    </div>
                    <div className="text-sm text-gray-600">Pending</div>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {projectStats.inProgressSubtasks}
                    </div>
                    <div className="text-sm text-gray-600">In Progress</div>
                  </div>
                </div>

                {/* Estimated vs Actual Hours */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {projectStats.totalEstimatedHours}h
                    </div>
                    <div className="text-sm text-gray-600">Estimated Hours</div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="text-lg font-semibold text-gray-900">
                      {projectStats.totalActualHours}h
                    </div>
                    <div className="text-sm text-gray-600">Actual Hours</div>
                  </div>
                </div>

                {/* Completion Progress Bar */}
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Subtasks Completion
                    </span>
                    <span className="text-sm text-gray-500">
                      {projectStats.completionPercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${projectStats.completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            {/* Individual Subtasks - Show if available */}
            {subtasks.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Subtasks Details ({subtasks.length})
                </h2>
                <div className="space-y-4">
                  {subtasks.map((subtask, index) => (
                    <div
                      key={subtask.id || index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {subtask.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {subtask.description}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getSubtaskStatusColor(
                            subtask.status
                          )}`}
                        >
                          {subtask.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">
                            Priority:
                          </span>
                          <span className="ml-1 text-gray-900">
                            {subtask.priority}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Est. Hours:
                          </span>
                          <span className="ml-1 text-gray-900">
                            {subtask.estimatedHours}h
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Start:
                          </span>
                          <span className="ml-1 text-gray-900">
                            {formatDate(subtask.startDate)}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Due:
                          </span>
                          <span className="ml-1 text-gray-900">
                            {formatDate(subtask.dueDate)}
                          </span>
                        </div>
                      </div>

                      {subtask.tags && subtask.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {subtask.tags.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Project Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Stats
              </h2>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Time Remaining
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {getDaysRemaining()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      Completion
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                      {getCompletionDate()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100">
                    <svg
                      className="w-6 h-6 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(currentProject.createdAt)}
                    </p>
                  </div>
                </div>

                {subtasks.length > 0 && (
                  <div className="flex items-center">
                    <div className="p-3 rounded-full bg-indigo-100">
                      <svg
                        className="w-6 h-6 text-indigo-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">
                        Subtasks
                      </p>
                      <p className="text-lg font-semibold text-gray-900">
                        {subtasks.length} tasks
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Timeline
              </h2>
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                <div className="relative pl-10 pb-6">
                  <div className="absolute left-2 w-4 h-4 bg-blue-600 rounded-full"></div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">Created</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(currentProject.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="relative pl-10 pb-6">
                  <div
                    className={`absolute left-2 w-4 h-4 rounded-full ${
                      currentProject.startDate ? "bg-green-600" : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">Start Date</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(currentProject.startDate)}
                    </p>
                  </div>
                </div>

                <div className="relative pl-10">
                  <div
                    className={`absolute left-2 w-4 h-4 rounded-full ${
                      currentProject.progress === 100
                        ? "bg-green-600"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900">Due Date</h3>
                    <p className="text-sm text-gray-600">
                      {formatDate(currentProject.dueDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Project
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{currentProject.name}"? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
