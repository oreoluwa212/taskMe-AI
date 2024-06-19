import React, { useEffect, useState } from "react";
import { IoIosSettings } from "react-icons/io";
import { HiOutlineLogout } from "react-icons/hi";
import { HiClipboardDocumentCheck, HiSquares2X2 } from "react-icons/hi2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logo } from "../../../public";

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activebutton, setActiveButton] = useState(1);
  useEffect(() => {
    if (location.pathname === "/overview") setActiveButton(1);
    else if (location.pathname === "/projects") setActiveButton(2);
    else if (location.pathname === "/settings") setActiveButton(3);
  }, [location.pathname]);

  return (
    <>
      <div className="w-1/5 hidden lgss:flex h-screen flex-col border-r-[1px] pb-5 font-lato border-[#19437E] shadow-lg justify-start px-4 items-start pt-8 bg-white">
        <div className="w-[210px] h-[40px]">
          <img src={logo} alt="" className="w-full h-full bg-cover" />
        </div>
        <div className="mt-10 w-full flex flex-col gap-2 justify-between h-full items-center py-[40%]">
          <div className="w-full flex flex-col ">
            <Link
              to="/overview"
              className={
                activebutton === 1
                  ? "flex justify-between text-lg text-white items-center font-medium  rounded-full px-6 bg-primary w-full h-[60px]"
                  : "flex justify-between text-lg text-[#6B7276] items-center font-medium  px-4  w-full h-[60px]"
              }
            >
              <h4 className="">Overview</h4>
              <HiSquares2X2 />
            </Link>
            <Link
              to="/projects"
              className={
                activebutton === 2
                  ? "flex justify-between text-lg text-white items-center font-medium  rounded-full px-6 bg-primary w-full h-[60px]"
                  : "flex justify-between text-lg text-[#6B7276] items-center font-medium  px-4  w-full h-[60px]"
              }
            >
              <h4 className="">Projects</h4>
              <HiClipboardDocumentCheck />
            </Link>
            <Link
              to="/settings"
              className={
                activebutton === 3
                  ? "flex justify-between text-lg text-white items-center font-medium  rounded-full px-6 bg-primary w-full h-[60px]"
                  : "flex justify-between text-lg text-[#6B7276] items-center font-medium  px-4  w-full h-[60px]"
              }
            >
              <h4 className="">Settings</h4>
              <IoIosSettings />
            </Link>
          </div>

          <button
            onClick={() => navigate("/login")}
            className="flex justify-between text-lg mt-4 text-[#B82323] items-center  font-medium  px-6  w-full "
          >
            Logout
            <HiOutlineLogout />
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className={`absolute top-0 left-0 z-50 h-screen bg-[#F0EDE7] w-[70%] mds:w-1/2 lgss:hidden flex flex-col px-[5%] pt-10 transform transition-transform duration-300 ${
            isOpen ? "translate-x-0 " : "-translate-x-full"
          }`}
        >
          <div className="lgss:mt-12 flex flex-col lgss:hidden">
            <div className="">
              <img src={logo} alt="logo" className="bg-cover" />
            </div>
            <div className="mt-12 w-full flex flex-col justify-between h-screen items-start font-manrope py-[30%]">
              <div className="flex flex-col w-full">
                <Link
                  to="/overview"
                  className={
                    activebutton === 1
                      ? "flex justify-between text-[20px] text-white items-center font-medium  rounded-full px-4 bg-primary w-full h-[60px]"
                      : "flex justify-between text-[20px] text-[#6B7276] items-center font-medium  px-4  w-full h-[60px]"
                  }
                >
                  <h4 className="">Overview</h4>
                  <HiSquares2X2 />
                </Link>
                <Link
                  to="/projects"
                  className={
                    activebutton === 2
                      ? "flex justify-between text-[20px] text-white items-center font-medium  rounded-full px-4 bg-primary w-full h-[60px]"
                      : "flex justify-between text-[20px] text-[#6B7276] items-center font-medium  px-4  w-full h-[60px]"
                  }
                >
                  <h4 className="">Projects</h4>
                  <HiClipboardDocumentCheck />
                </Link>
                <Link
                  to="/settings"
                  className={
                    activebutton === 3
                      ? "flex justify-between text-[20px] text-white items-center font-medium  rounded-full px-4 bg-primary w-full h-[60px]"
                      : "flex justify-between text-[20px] text-[#6B7276] items-center font-medium  px-4  w-full h-[60px]"
                  }
                >
                  <h4 className="">Settings</h4>
                  <IoIosSettings />
                </Link>
              </div>
              <button
                onClick={() => navigate("/login")}
                className="flex gap-5 text-[18px] text-[#B82323] items-center font-medium pl-12 h-[40%] w-full"
              >
                Sign Out
                <HiOutlineLogout />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
