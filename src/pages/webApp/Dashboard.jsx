import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/webApp/Sidebar";
import Header from "../../components/webApp/Header";
import { FaBars, FaTimes } from "react-icons/fa";
import CustomBtn from "../../components/webApp/buttons/CustomBtn";
import HomeCard from "../../components/webApp/cards/HomeCard";
import { icon1 } from "../../../public";

const Dashboard = () => {
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
          <div className="w-full flex flex-col px-[5%] pt-5">
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
            {activeTab === "empty" ? (
               <div className="w-full flex flex-col gap-7">
              <div className="flex flex-row flex-wrap w-full gap-4 justify-between pt-12">
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
              <div className="flex flex-col font-semibold text-lg pt-7 w-full">
               <h2>Current Projects</h2>
              </div>
              </div>
            ) : (
              <div className="flex flex-row flex-wrap w-full gap-4 justify-between pt-12">
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
            )}

            {/* =============================== Content =============================== */}
            {activeTab === "empty" ? (
              <div className="w-full flex flex-col justify-center items-center pt-6"></div>
            ) : (
              <div className=""></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;