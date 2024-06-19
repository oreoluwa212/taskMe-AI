import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../../components/webApp/Header";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoIosArrowRoundBack } from "react-icons/io";
import Sidebar from "../../components/webApp/Sidebar";

const ProjectOverview = () => {
  const { id } = useParams();
  const [userName, setUserName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch the project details using the id. This example uses hardcoded data for simplicity.
  const project = {
    projectName: "Website Redesign Project",
    dueDate: "2023-12-31",
    dueDays: 30,
    startDate: "2023-12-01",
    progress: 70,
    tasks: [
      { name: "Task 1", status: "Pending" },
      { name: "Task 2", status: "Completed" },
    ],
  };

  return (
    <div className="lgss:h-screen flex flex-row overflow-x-hidden">
      <Sidebar isOpen={isOpen} />

      <div className="lgss:w-4/5 w-full h-full overflow-auto flex flex-col bg-dashboardBg items-center font-lato justify-start">
        <div className="w-full">
          <div className="lgss:hidden pt-5 px-[5%] flex w-full justify-end">
            {isOpen ? (
              <FaTimes
                onClick={() => setIsOpen(false)}
                className=" cursor-pointer text-secondary text-xl"
              />
            ) : (
              <FaBars
                onClick={() => setIsOpen(true)}
                className=" cursor-pointer text-secondary text-xl"
              />
            )}
          </div>
          <Header userName={userName} />
          <div className="w-full flex flex-col items-start px-[5%] pt-6">
            <button className="flex justify-center items-center gap-2 text-lg font-semibold">
              <span>
                <IoIosArrowRoundBack className=" text-3xl" />
              </span>
              <h2>Back</h2>
            </button>
            <div className="w-full mt-8 flex items-center justify-center">
              <h1 className="text-2xl text-center font-bold">
                {project.projectName}
              </h1>
            </div>
            <div className="bg-white shadow-custom-xl rounded-md mt-8 flex flex-col gap-4 container mx-auto px-7 py-5">
              {project.tasks.map((task, index) => (
                <div className="border-b-[1px] pb-4">
                  <div className="flex w-full justify-between items-center">
                    <h3 className="text-primary font-semibold">{task.name}</h3>
                    <button className="border bg-transparent rounded-full p-3">
                      {task.status}
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p>
                      <strong>Start Date:</strong> {project.startDate}
                    </p>
                    <p>
                      <strong>Due Date:</strong> {project.dueDate}
                    </p>
                    <p>
                      <strong>Progress:</strong> {project.progress}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOverview;
