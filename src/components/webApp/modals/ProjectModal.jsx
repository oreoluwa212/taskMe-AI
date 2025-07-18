// src/components/webApp/modals/ProjectModal.jsx
import React, { useState, useEffect } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { useProjectStore } from "../../../store/projectStore";
import useSubtaskStore from "../../../store/subtaskStore";
import FormInput from "../input/FormInput";
import CustomBtn from "../buttons/CustomBtn";

const ProjectModal = ({ isOpen, onClose, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    dueDate: "",
    dueTime: "",
    description: "",
    priority: "High",
    category: "",
    tags: [],
  });

  const [generateAI, setGenerateAI] = useState(false);
  const [step, setStep] = useState(1); // 1: Project details, 2: AI generation confirmation
  const [tagInput, setTagInput] = useState("");
  const [calculatedTimeline, setCalculatedTimeline] = useState(0);

  const { createProject, loading } = useProjectStore();
  const { generateAISubtasks, generatingSubtasks } = useSubtaskStore();

  // Calculate timeline when dates change
  useEffect(() => {
    if (formData.startDate && formData.dueDate) {
      const startDate = new Date(formData.startDate);
      const dueDate = new Date(formData.dueDate);
      const timeDiff = dueDate.getTime() - startDate.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (daysDiff > 0) {
        setCalculatedTimeline(daysDiff);
      } else {
        setCalculatedTimeline(0);
      }
    } else {
      setCalculatedTimeline(0);
    }
  }, [formData.startDate, formData.dueDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (
      tagInput.trim() &&
      !formData.tags.includes(tagInput.trim().toLowerCase())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.name || !formData.startDate || !formData.dueDate) {
        throw new Error("Please fill in all required fields");
      }

      // Validate date logic
      if (calculatedTimeline <= 0) {
        throw new Error("Due date must be after start date");
      }

      // Prepare project data according to API structure
      const projectData = {
        name: formData.name,
        description: formData.description,
        timeline: calculatedTimeline, // Use calculated timeline
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        priority: formData.priority,
        category: formData.category,
        tags: formData.tags,
        generateAISubtasks: generateAI,
      };

      console.log("Submitting project data:", projectData);

      // Create project
      const response = await createProject(projectData);

      // Handle response according to API structure
      const projectResponse = response.data || response;
      const newProject = projectResponse.project;
      const subtasks = projectResponse.subtasks || [];

      // If AI generation is enabled and subtasks weren't returned, generate them
      if (generateAI && !subtasks.length) {
        setStep(2);
        try {
          const generatedSubtasks = await generateAISubtasks(
            newProject.id || newProject._id
          );
          console.log("Generated subtasks:", generatedSubtasks);

          // Reset form and close modal
          resetForm();

          // Notify parent component with both project and subtasks
          if (onSuccess) {
            onSuccess({ project: newProject, subtasks: generatedSubtasks });
          }
        } catch (subtaskError) {
          console.error("Subtask generation error:", subtaskError);
          // Even if subtask generation fails, the project was created successfully
          resetForm();
          if (onSuccess) {
            onSuccess({ project: newProject, subtasks: [] });
          }
          if (onError) {
            onError(
              new Error("Project created but failed to generate AI subtasks")
            );
          }
        }
      } else {
        // Reset form and close modal
        resetForm();

        // Notify parent component
        if (onSuccess) {
          onSuccess({ project: newProject, subtasks });
        }
      }
    } catch (error) {
      console.error("Project creation error:", error);
      if (onError) {
        onError(error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      startDate: "",
      dueDate: "",
      dueTime: "",
      description: "",
      priority: "High",
      category: "",
      tags: [],
    });
    setGenerateAI(false);
    setStep(1);
    setTagInput("");
    setCalculatedTimeline(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg px-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="w-full pt-4 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">
            {step === 1 ? "New Project" : "Generating AI Subtasks..."}
          </h2>
          <LiaTimesSolid
            className="cursor-pointer text-2xl hover:text-gray-600 transition-colors"
            onClick={handleClose}
          />
        </div>

        {step === 1 && (
          <form
            onSubmit={handleSubmit}
            className="flex pt-5 pb-6 flex-col w-full gap-4"
          >
            <FormInput
              name="name"
              label="Project Name *"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="Enter project name"
            />

            <div className="flex w-full gap-4">
              <FormInput
                name="startDate"
                label="Start Date *"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
              />
              <FormInput
                name="dueDate"
                label="Due Date *"
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Auto-calculated Timeline Display - Now positioned below dates */}
            {calculatedTimeline > 0 && (
              <div className="flex flex-col gap-2 -mt-2">
                <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-blue-700">
                      Project Timeline:
                    </span>
                    <span className="text-sm font-bold text-blue-800">
                      {calculatedTimeline} day
                      {calculatedTimeline !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Show warning if invalid date range */}
            {formData.startDate &&
              formData.dueDate &&
              calculatedTimeline <= 0 && (
                <div className="flex flex-col gap-2 -mt-2">
                  <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-sm font-medium text-red-700">
                      Due date must be after start date
                    </span>
                  </div>
                </div>
              )}

            <FormInput
              name="dueTime"
              label="Due Time"
              type="time"
              value={formData.dueTime}
              onChange={handleInputChange}
              placeholder="Optional deadline time"
            />

            <FormInput
              name="category"
              label="Category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="e.g., Web Development, Mobile App, etc."
            />

            <FormInput
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Project description..."
            />

            {/* Tags Section */}
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-[0.9rem] text-[#344054]">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag(e)}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
              {/* Display Tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-[0.9rem] text-[#344054]">
                Priority Level
              </label>
              <div className="flex justify-between w-full">
                {["High", "Medium", "Low"].map((priority) => (
                  <label key={priority} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="priority"
                      value={priority}
                      checked={formData.priority === priority}
                      onChange={handleInputChange}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{priority}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* AI Generation Option */}
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={generateAI}
                  onChange={(e) => setGenerateAI(e.target.checked)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium">
                  Generate AI-powered subtasks
                </span>
              </label>
              {generateAI && (
                <p className="text-xs text-gray-600">
                  AI will create detailed subtasks based on your project
                  description and timeline.
                </p>
              )}
            </div>

            <div className="pt-4">
              <CustomBtn
                title={loading ? "Creating..." : "Create Project"}
                type="submit"
                disabled={
                  loading ||
                  !formData.name ||
                  !formData.startDate ||
                  !formData.dueDate ||
                  calculatedTimeline <= 0
                }
              />
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="flex pt-5 pb-6 flex-col w-full gap-4 items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-center text-gray-600">
              {generatingSubtasks
                ? "AI is generating your project subtasks..."
                : "Processing your project..."}
            </p>
            <p className="text-center text-sm text-gray-500">
              This may take a few moments
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;
