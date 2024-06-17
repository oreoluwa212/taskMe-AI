import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/webApp/Sidebar";
import Header from "../../components/webApp/Header";

const Dashboard = () => {
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    // Fetch user name from the backend
    const fetchUserName = async () => {
      try {
        const response = await axios.get("/api/user"); // Replace with your actual endpoint
        setUserName(response.data.name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, []);

  return (
    <div className="h-screen flex flex-row overflow-x-hidden">
      <Sidebar />
      <div className="w-4/5 h-full overflow-auto flex flex-col bg-white items-center font-lato justify-start">
        <div className="w-full">
          <Header userName={userName} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;