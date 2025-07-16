// src/components/webApp/modals/ProjectModal.jsx
import React, { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import { useProjectStore } from "../../../store/projectStore";
import FormInput from "../input/FormInput";
import CustomBtn from "../buttons/CustomBtn";

const ProjectModal = ({ isOpen, onClose, onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: "",
    timeline: "",
    startDate: "",
    dueDate: "",
    dueTime: "",
    description: "",
    priority: "High",
  });

  const { createProject, loading } = useProjectStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.name || !formData.startDate || !formData.dueDate) {
        throw new Error("Please fill in all required fields");
      }

      // Prepare project data
      const projectData = {
        name: formData.name,
        description: formData.description,
        timeline: parseInt(formData.timeline) || 0,
        startDate: formData.startDate,
        dueDate: formData.dueDate,
        dueTime: formData.dueTime,
        priority: formData.priority,
        progress: 0,
      };

      console.log("Submitting project data:", projectData);

      // Create project
      const newProject = await createProject(projectData);

      // Reset form
      setFormData({
        name: "",
        timeline: "",
        startDate: "",
        dueDate: "",
        dueTime: "",
        description: "",
        priority: "High",
      });

      // Notify parent component
      if (onSuccess) {
        onSuccess(newProject);
      }
    } catch (error) {
      console.error("Project creation error:", error);
      if (onError) {
        onError(error);
      }
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: "",
      timeline: "",
      startDate: "",
      dueDate: "",
      dueTime: "",
      description: "",
      priority: "High",
    });
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg px-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="w-full pt-4 flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">New Project</h2>
          <LiaTimesSolid
            className="cursor-pointer text-2xl hover:text-gray-600 transition-colors"
            onClick={handleClose}
          />
        </div>

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

          <FormInput
            name="timeline"
            label="Project Timeline (In days)"
            type="number"
            value={formData.timeline}
            onChange={handleInputChange}
            placeholder="30"
            min="1"
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

          <FormInput
            name="dueTime"
            label="Due Time"
            type="time"
            value={formData.dueTime}
            onChange={handleInputChange}
          />

          <FormInput
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Project description..."
          />

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

          <div className="pt-4">
            <CustomBtn
              title={loading ? "Creating..." : "Create Project"}
              type="submit"
              disabled={
                loading ||
                !formData.name ||
                !formData.startDate ||
                !formData.dueDate
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
