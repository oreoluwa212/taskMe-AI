import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../../components/webApp/Sidebar";
import Header from "../../components/webApp/Header";
import { FaBars, FaTimes } from "react-icons/fa";
import CustomBtn from "../../components/webApp/buttons/CustomBtn";
import HeaderTexts from "../../components/webApp/HeaderTexts";
import ProjectDetailCard from "../../components/webApp/cards/ProjectDetailCard";
import ProjectModal from "../../components/webApp/modals/ProjectModal";

const Projects = () => {
  const [userName, setUserName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("empty");
  const [projects, setProjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

    const savedProjects = JSON.parse(localStorage.getItem("projects")) || [];
    setProjects(savedProjects);
    if (savedProjects.length > 0) {
      setActiveTab("active");
    }
  }, []);

  const handleCardClick = () => {
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollLeft += 300;
    }
  };

  const handleAddProject = (newProject) => {
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem("projects", JSON.stringify(updatedProjects));
    setActiveTab("active");
  };

  return (
    <div className="lgss:h-screen flex flex-row overflow-x-hidden">
      <Sidebar isOpen={isOpen} />

      <div className="lgss:w-4/5 w-full h-full overflow-auto flex flex-col bg-dashboardBg items-center font-lato justify-start">
        <div className="w-full">
          {/* ================ FaTime et FaBars ================ */}
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
                <CustomBtn
                  title={"Add new project"}
                  onClick={() => setIsModalOpen(true)}
                />
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
                    <CustomBtn
                      title={"Add a new project"}
                      onClick={() => setIsModalOpen(true)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col font-semibold text-lg pt-14 w-full">
                <div className="w-full flex flex-col gap-6 pb-8">
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

      {/* =========== Project Modal ============ */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddProject}
      />
    </div>
  );
};

export default Projects;
