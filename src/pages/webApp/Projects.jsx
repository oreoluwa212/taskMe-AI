import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../../components/webApp/Sidebar";
import Header from "../../components/webApp/Header";
import { FaBars, FaTimes } from "react-icons/fa";
import CustomBtn from "../../components/webApp/buttons/CustomBtn";
import HeaderTexts from "../../components/webApp/HeaderTexts";
import ProjectDetailCard from "../../components/webApp/cards/ProjectDetailCard";

const Projects = () => {
  const [userName, setUserName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("empty");
  const [projects, setProjects] = useState([]);
  const cardContainerRef = useRef(null);

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await axios.get("/api/user");
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();

    const mockProjects = [
      {
        projectName: "Website Redesign Project",
        dueDate: "22nd, June 2024",
        dueDays: 30,
        startDate: "12th, May 2024",
        progress: 40,
      },
      {
        projectName: "Mobile App Development",
        dueDate: "1st, July 2024",
        dueDays: 45,
        startDate: "15th, May 2024",
        progress: 60,
      },
      {
        projectName: "Mobile App Development",
        dueDate: "1st, July 2024",
        dueDays: 45,
        startDate: "15th, May 2024",
        progress: 60,
      },
      {
        projectName: "Marketing Campaign",
        dueDate: "30th, June 2024",
        dueDays: 20,
        startDate: "10th, June 2024",
        progress: 20,
      },
      {
        projectName: "Marketing Campaign",
        dueDate: "30th, June 2024",
        dueDays: 10,
        startDate: "10th, June 2024",
        progress: 20,
      },
    ];

    setProjects(mockProjects);
  }, []);

  const handleCardClick = () => {
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollLeft += 300;
    }
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
          <div className="w-full flex flex-col px-[5%] pt-6">
            <div className="flex pt-6 flex-row justify-between items-center w-full">
              <HeaderTexts
                h2={"My Projects"}
                p={"View the list of projects you have"}
              />
              <div className="w-[25%]">
                <CustomBtn title={"Add new project"} />
              </div>
            </div>
            <div className="w-full flex lgss:flex-row flex-col gap-4 pt-4">
              <div
                className={activeTab === "empty" ? "active" : ""}
                onClick={() => setActiveTab("empty")}
              >
                <CustomBtn title="Empty Tab" />
              </div>
              <div
                className={activeTab === "active" ? "active" : ""}
                onClick={() => setActiveTab("active")}
              >
                <CustomBtn title="Active Tab" />
              </div>
            </div>

            {/* =============================== Content =============================== */}
            {activeTab === "empty" ? (
              <div className="flex flex-col font-semibold text-lg pt-5 mt-5 w-full">
                <div className="w-full rounded-[20px] bg-white h-[300px] py-9 mt-5 shadow-custom-xl flex flex-col justify-center items-center text-sm">
                  <p>You don&apos;t have any current project.</p>
                  <div className="w-[30%] pt-5">
                    <CustomBtn title={"Add a new project"} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col font-semibold text-lg pt-14 w-full">
                <div className="w-full flex flex-col gap-6">
                  <h2>Current Project</h2>
                  <div
                    className="flex flex-row gap-8 pb-5 pl-1 overflow-x-auto custom-scrollbar"
                    ref={cardContainerRef}
                  >
                    {projects.map((project, index) => (
                      <div
                        key={index}
                        onClick={
                          index === projects.length - 1 ? handleCardClick : null
                        }
                      >
                        <ProjectDetailCard
                          projectName={project.projectName}
                          dueDate={project.dueDate}
                          dueDays={project.dueDays}
                          startDate={project.startDate}
                          progress={project.progress}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;
