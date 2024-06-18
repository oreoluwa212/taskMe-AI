import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/webApp/Sidebar";
import Header from "../../components/webApp/Header";
import { FaBars, FaTimes } from "react-icons/fa";
import ProjectCard from "../../components/webApp/cards/ProjectCard";
import CustomBtn from "../../components/webApp/buttons/CustomBtn";
import HeaderTexts from "../../components/webApp/HeaderTexts";

const Projects = () => {
  const [userName, setUserName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("empty");

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
          <div className="w-full flex flex-col px-[5%] pt-10">
            <div className="pb-6">
            <HeaderTexts
              h2={"My Projects"}
              p={"View the list of projects you have"}
              />
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
              <div className="flex flex-col font-semibold text-lg pt-5 mt-5 w-full">
                <h2>Current Project</h2>
                <div className="w-full rounded-[20px] bg-white h-fit py-9 mt-5 shadow-custom-xl flex flex-col justify-center items-center text-sm">
                  <p>You don&apos;t have any current project.</p>
                  <div className="w-[30%] pt-3">
                    <CustomBtn title={"Add a new project"} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col font-semibold text-lg pt-5 mt-5 w-full">
                <div className="w-full flex lgss:flex-row flex-col items-start justify-between">
                  <div className="w-full flex flex-col gap-6">
                    <h2>Current Project</h2>
                    
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
