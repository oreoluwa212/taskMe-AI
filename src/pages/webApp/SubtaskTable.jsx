import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaClock,
  FaPlay,
  FaPlus,
  FaRobot,
  FaSync,
} from "react-icons/fa";
import useSubtaskStore from "../../store/subtaskStore";

const SubtaskTable = ({ projectId, projectName }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSubtask, setNewSubtask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "Medium",
    status: "Pending",
  });

  const {
    subtasks,
    loading,
    generatingSubtasks,
    getProjectSubtasks,
    updateSubtask,
    deleteSubtask,
    createSubtask,
    generateAISubtasks,
    getSubtasksByProjectId,
  } = useSubtaskStore();

  const projectSubtasks = getSubtasksByProjectId(projectId);

  useEffect(() => {
    if (projectId) {
      getProjectSubtasks(projectId);
    }
  }, [projectId, getProjectSubtasks]);

  const handleStatusChange = async (subtaskId, newStatus) => {
    try {
      await updateSubtask(subtaskId, { status: newStatus });
    } catch (error) {
      console.error("Failed to update subtask status:", error);
    }
  };

  const handleEdit = (subtask) => {
    setIsEditing(subtask.id || subtask._id);
    setEditFormData({
      title: subtask.title,
      description: subtask.description,
      dueDate: subtask.dueDate?.split("T")[0] || "",
      priority: subtask.priority,
      status: subtask.status,
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateSubtask(isEditing, editFormData);
      setIsEditing(null);
      setEditFormData({});
    } catch (error) {
      console.error("Failed to update subtask:", error);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(null);
    setEditFormData({});
  };

  const handleDelete = async (subtaskId) => {
    if (window.confirm("Are you sure you want to delete this subtask?")) {
      try {
        await deleteSubtask(subtaskId);
      } catch (error) {
        console.error("Failed to delete subtask:", error);
      }
    }
  };

  const handleAddSubtask = async () => {
    try {
      await createSubtask(projectId, newSubtask);
      setNewSubtask({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        status: "Pending",
      });
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to create subtask:", error);
    }
  };

  const handleRegenerateAI = async () => {
    try {
      await generateAISubtasks(projectId, true);
    } catch (error) {
      console.error("Failed to regenerate AI subtasks:", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FaCheck className="text-green-600" />;
      case "In Progress":
        return <FaPlay className="text-blue-600" />;
      default:
        return <FaClock className="text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const completedTasks = projectSubtasks.filter(
    (task) => task.status === "Completed"
  ).length;
  const totalTasks = projectSubtasks.length;
  const progressPercentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {projectName} - Subtasks
          </h2>
          <p className="text-gray-600 mt-1">
            {completedTasks} of {totalTasks} tasks completed (
            {progressPercentage}%)
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRegenerateAI}
            disabled={generatingSubtasks}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {generatingSubtasks ? (
              <FaSync className="animate-spin" />
            ) : (
              <FaRobot />
            )}
            {generatingSubtasks ? "Regenerating..." : "Regenerate AI"}
          </button>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Add Subtask
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Add Subtask Form */}
      {showAddForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Add New Subtask</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Subtask title"
              value={newSubtask.title}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, title: e.target.value })
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={newSubtask.dueDate}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, dueDate: e.target.value })
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newSubtask.priority}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, priority: e.target.value })
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <select
              value={newSubtask.status}
              onChange={(e) =>
                setNewSubtask({ ...newSubtask, status: e.target.value })
              }
              className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <textarea
            placeholder="Description (optional)"
            value={newSubtask.description}
            onChange={(e) =>
              setNewSubtask({ ...newSubtask, description: e.target.value })
            }
            className="w-full mt-4 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddSubtask}
              disabled={!newSubtask.title || loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Subtask"}
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {generatingSubtasks && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">
            AI is generating subtasks...
          </span>
        </div>
      )}

      {/* Subtasks Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border-b font-semibold text-gray-700">
                Task
              </th>
              <th className="text-left p-3 border-b font-semibold text-gray-700">
                Status
              </th>
              <th className="text-left p-3 border-b font-semibold text-gray-700">
                Priority
              </th>
              <th className="text-left p-3 border-b font-semibold text-gray-700">
                Due Date
              </th>
              <th className="text-left p-3 border-b font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projectSubtasks.map((subtask) => (
              <tr key={subtask.id || subtask._id} className="hover:bg-gray-50">
                <td className="p-3 border-b">
                  {isEditing === (subtask.id || subtask._id) ? (
                    <div>
                      <input
                        type="text"
                        value={editFormData.title}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <textarea
                        value={editFormData.description}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            description: e.target.value,
                          })
                        }
                        className="w-full mt-2 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="2"
                        placeholder="Description"
                      />
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium text-gray-900">
                        {subtask.title}
                      </div>
                      {subtask.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {subtask.description}
                        </div>
                      )}
                    </div>
                  )}
                </td>
                <td className="p-3 border-b">
                  {isEditing === (subtask.id || subtask._id) ? (
                    <select
                      value={editFormData.status}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          status: e.target.value,
                        })
                      }
                      className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  ) : (
                    <div className="flex items-center gap-2">
                      {getStatusIcon(subtask.status)}
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          subtask.status
                        )}`}
                      >
                        {subtask.status}
                      </span>
                    </div>
                  )}
                </td>
                <td className="p-3 border-b">
                  {isEditing === (subtask.id || subtask._id) ? (
                    <select
                      value={editFormData.priority}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          priority: e.target.value,
                        })
                      }
                      className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  ) : (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                        subtask.priority
                      )}`}
                    >
                      {subtask.priority}
                    </span>
                  )}
                </td>
                <td className="p-3 border-b">
                  {isEditing === (subtask.id || subtask._id) ? (
                    <input
                      type="date"
                      value={editFormData.dueDate}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          dueDate: e.target.value,
                        })
                      }
                      className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="text-sm text-gray-600">
                      {subtask.dueDate
                        ? new Date(subtask.dueDate).toLocaleDateString()
                        : "No date set"}
                    </span>
                  )}
                </td>
                <td className="p-3 border-b">
                  {isEditing === (subtask.id || subtask._id) ? (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 text-green-600 hover:text-green-800"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-600 hover:text-gray-800"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(subtask)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(subtask.id || subtask._id)}
                        className="p-1 text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                      {subtask.status !== "Completed" && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              subtask.id || subtask._id,
                              "Completed"
                            )
                          }
                          className="p-1 text-green-600 hover:text-green-800"
                          title="Mark as completed"
                        >
                          <FaCheck />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {projectSubtasks.length === 0 && !generatingSubtasks && (
        <div className="text-center py-8">
          <div className="text-gray-500 mb-4">
            No subtasks found for this project
          </div>
          <button
            onClick={() => generateAISubtasks(projectId)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Generate AI Subtasks
          </button>
        </div>
      )}
    </div>
  );
};

export default SubtaskTable;
