import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "../../components/webApp/Sidebar";
import Header from "../../components/webApp/Header";
import { FaBars, FaTimes } from "react-icons/fa";
import CustomBtn from "../../components/webApp/buttons/CustomBtn";
import HomeCard from "../../components/webApp/cards/HomeCard";
import ProjectCard from "../../components/webApp/cards/ProjectCard";
import HeaderTexts from "../../components/webApp/HeaderTexts";
import ProjectModal from "../../components/webApp/modals/ProjectModal";

const Dashboard = () => {
  const [userName, setUserName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("empty");
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
  }, []);

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
          <div className="w-full flex flex-col px-[5%] pt-5">
            <div className="flex py-8 flex-row justify-between items-center w-full">
              <HeaderTexts
                h2={"Welcome back David!"}
                p={"Here's what's on your plate today."}
              />
              <div className="w-[35%] lgss:w-[25%]">
                <CustomBtn
                  title={"Add new project"}
                  onClick={() => setIsModalOpen(true)}
                />
              </div>
            </div>
            <div className="w-full flex lgss:flex-row flex-col gap-4 py-2">
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
              <div className="w-full flex flex-col gap-7">
                <div className="flex flex-row flex-wrap w-full gap-3 justify-between pt-6">
                  <HomeCard
                    title="Total Projects"
                    value={"0"}
                    className={"text-secondary"}
                  />
                  <HomeCard
                    title="Total Tasks"
                    value={"0"}
                    className={"text-[#3185FC]"}
                  />
                  <HomeCard
                    title="Completed Tasks"
                    value={"0"}
                    className={"text-[#56AC60]"}
                  />
                  <HomeCard
                    title="Pending Tasks"
                    value={"0"}
                    className={"text-[#CDB538]"}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-row flex-wrap w-full gap-4 justify-between pt-6">
                <HomeCard
                  title="Total Projects"
                  value={"5"}
                  className={"text-secondary"}
                />
                <HomeCard
                  title="Total Tasks"
                  value={"10"}
                  className={"text-[#3185FC]"}
                />
                <HomeCard
                  title="Completed Tasks"
                  value={"7"}
                  className={"text-[#56AC60]"}
                />
                <HomeCard
                  title="Pending Tasks"
                  value={"3"}
                  className={"text-[#CDB538]"}
                />
              </div>
            )}
            {activeTab === "empty" ? (
              <div className="flex flex-col font-semibold text-lg pt-5 mt-5 w-full">
                <h2>Current Project</h2>
                <div className="w-full rounded-[20px] bg-white h-fit py-9 mt-5 shadow-custom-xl flex flex-col justify-center items-center text-sm">
                  <p>You don&apos;t have any current project.</p>
                  <div className="w-[30%] pt-3">
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

export default Dashboard;
