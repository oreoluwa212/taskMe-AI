import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../components/webApp/Sidebar";
import Header from "../../components/webApp/Header";
import { FaBars, FaTimes } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { HiMiniUser } from "react-icons/hi2";
import FormInput from "../../components/webApp/input/FormInput";
import CustomBtn from "../../components/webApp/buttons/CustomBtn";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Modal from "../../components/webApp/modals/Modal";

const Settings = () => {
  const [userName, setUserName] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

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

  const handlePasswordUpdate = async (currentPassword, newPassword) => {
    try {
      // await axios.post("/api/update-password", {
      //   currentPassword,
      //   newPassword,
      // });

      setIsModalOpen(false);
      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 3000);
    } catch (error) {
      toast.error("Failed to update password. Please try again.");
    }
  };

  return (
    <div className="lgss:h-screen flex flex-row overflow-x-hidden relative">
      <Sidebar isOpen={isOpen} />
      <div
        className={`lgss:w-4/5 w-full h-screen overflow-auto flex flex-col bg-dashboardBg items-center font-lato justify-start ${
          isModalOpen || isSuccessModalOpen ? "blur-sm" : ""
        }`}
      >
        <div className="w-full">
          <div className="lgss:hidden pt-5 px-[5%] flex w-full justify-end">
            {isOpen ? (
              <FaTimes
                onClick={() => setIsOpen(false)}
                className="cursor-pointer text-secondary text-xl"
              />
            ) : (
              <FaBars
                onClick={() => setIsOpen(true)}
                className="cursor-pointer text-secondary text-xl"
              />
            )}
          </div>
          <Header userName={userName} />
          <div className="w-full pt-8">
            <div className="flex flex-row px-8 justify-between lgss:px-[10%] text-[#19437E] font-medium h-full  border-b">
              <button
                onClick={() => setActiveScreen(1)}
                className={
                  activeScreen === 1
                    ? "border-[#19437E] border-b-4 pb-[8px] font-bold px-[12px]"
                    : "px-[12px] text-[#6C7175] font-medium"
                }
              >
                My Profile
              </button>
              <button
                onClick={() => setActiveScreen(2)}
                className={
                  activeScreen === 2
                    ? "border-[#19437E] border-b-4 pb-[8px] font-bold px-[12px]"
                    : "px-[12px] text-[#6C7175] font-medium"
                }
              >
                Security
              </button>
            </div>
          </div>
          <div className="w-full flex px-[5%] lgss:px-[5%] py-10 mt-5">
            {activeScreen === 1 ? (
              <div className="bg-white h-fit lgss:w-[60%] w-full rounded-[8px] shadow-custom-xl">
                <form
                  action=""
                  className="flex flex-col justify-center items-center gap-3 w-full py-8 px-[5%]"
                >
                  <div className="bg-[#DAE7EE] text-[#6C7175] text-7xl rounded-full p-6">
                    <HiMiniUser />
                  </div>
                  <button className="text-primary font-semibold">
                    Update your profile picture
                  </button>
                  {/* ======== form input ========= */}
                  <div className="w-full flex gap-5 my-5">
                    <div className="w-1/2">
                      <FormInput
                        name="first name"
                        id="search"
                        label="First name"
                        textarea={false}
                      />
                    </div>
                    <div className="w-1/2">
                      <FormInput
                        name="last name"
                        id="lname"
                        label="Last name"
                        textarea={false}
                      />
                    </div>
                  </div>

                  <div className="w-full flex gap-5 mb-3">
                    <div className="w-1/2">
                      <FormInput
                        name="email"
                        id="email"
                        label="Email"
                        textarea={false}
                      />
                    </div>
                    <div className="w-1/2">
                      <FormInput
                        name="phone number"
                        id="pnumber"
                        label="Phone number"
                        textarea={false}
                      />
                    </div>
                  </div>
                  <div className="w-full pt-5">
                    <CustomBtn title={"Update your information"} />
                  </div>
                </form>
              </div>
            ) : activeScreen === 2 ? (
              <div className="bg-white h-fit lgss:w-[60%] w-full rounded-[8px] shadow-custom-xl text-sm p-8 flex flex-col gap-2">
                <div className="flex justify-between items-center mb-6">
                  <div className="space-y-2">
                    <h3 className="text-[.9rem] font-semibold">
                      Notifications
                    </h3>
                    <p className="text-[.8rem] text-gray-500">
                      Allow and start getting notifications.
                    </p>
                  </div>
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <h3 className="text-[.9rem] font-semibold">Password</h3>
                    <p className="text-gray-500 text-[.75rem]">
                      Update your password.
                    </p>
                  </div>
                  <button
                    className="text-primary font-semibold hover:underline"
                    onClick={() => setIsModalOpen(true)}
                  >
                    Update
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePasswordUpdate}
      />
      {isSuccessModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white flex flex-col justify-center items-center rounded p-10 shadow-lg relative lgss:w-[25%] text-center">
            <button
              className="absolute top-2 right-3 text-4xl text-gray-600"
              onClick={() => setIsSuccessModalOpen(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold py-3">
              Password Updated Successfully
            </h2>
            <div className="text-5xl text-primary">
              <IoCheckmarkCircle />
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Settings;
