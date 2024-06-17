import React from "react";
import Sidebar from "../../components/webApp/Sidebar";

const Dashboard = () => {
  return (
    <div className="h-screen flex flex-row overflow-x-hidden">
      <Sidebar />
      <div className="w-4/5 h-full  overflow-auto flex flex-col bg-white items-center font-lato justify-start"></div>
    </div>
  );
};

export default Dashboard;
