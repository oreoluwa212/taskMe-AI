import React, { useState } from "react";
import FormInput from "../input/FormInput";
import CustomBtn from "../buttons/CustomBtn";
import { LiaTimesSolid } from "react-icons/lia";

const ProjectModal = ({ isOpen, onClose, onSave }) => {
  const [projectName, setProjectName] = useState("");
  const [projectTimeline, setProjectTimeline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("High");

  const handleSave = (e) => {
    e.preventDefault();
    const dueDays = calculateDueDays(startDate, dueDate);
    const newProject = {
      projectName,
      dueDate: formatDate(dueDate),
      dueDays,
      startDate: formatDate(startDate),
      progress: 0, // Initial progress value
    };
    onSave(newProject);
    onClose();
  };

  const calculateDueDays = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatDate = (date) => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg px-6 lgss:w-1/3">
        <div className="w-full pt-2 flex justify-end">
          <LiaTimesSolid
            className="cursor-pointer text-2xl"
            onClick={onClose}
          />
        </div>
        <h2 className="text-xl font-semibold">New Project</h2>
        <form onSubmit={handleSave} className="flex pt-5 flex-col w-full gap-2">
          <FormInput
            name="projectName"
            label="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
          />
          <FormInput
            name="projectTimeline"
            label="Project Timeline (In days)"
            value={projectTimeline}
            onChange={(e) => setProjectTimeline(e.target.value)}
          />
          <div className="flex w-full gap-7 justify-between">
            <FormInput
              name="startDate"
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <FormInput
              name="dueDate"
              label="Due Date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <FormInput
            name="dueTime"
            label="Due Time"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
          <FormInput
            name="description"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="flex flex-col">
            <label className="font-semibold text-[0.9rem] text-[#344054]">
              Priority Level
            </label>
            <div className="flex justify-between w-[60%]">
              <label className="flex gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="High"
                  checked={priority === "High"}
                  onChange={() => setPriority("High")}
                />
                High
              </label>
              <label className="flex gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="Medium"
                  checked={priority === "Medium"}
                  onChange={() => setPriority("Medium")}
                />
                Medium
              </label>
              <label className="flex gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="Low"
                  checked={priority === "Low"}
                  onChange={() => setPriority("Low")}
                />
                Low
              </label>
            </div>
          </div>
          <div className="pt-5 pb-10">
            <CustomBtn title="Save Project" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
