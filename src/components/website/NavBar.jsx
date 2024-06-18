import React, { useState } from "react";
import { Link } from "react-router-dom";
import GetStartedBtn from "./buttons/GetStartedBtn";
import { logo } from "../../../public";
import { FaBars, FaTimes } from "react-icons/fa";

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full relative">
      <header className="flex items-center justify-between gap-4 px-[5%] py-7 w-full shadow-lg">
        <Link to={"/"}>
          <img className="h-auto" src={logo} alt="Logo" />
        </Link>
        <ul className="hidden lgss:flex gap-6 justify-center items-center font-semibold">
          <Link to={"/about"}>
            <li>About</li>
          </Link>
          <Link to={"/features"}>
            <li>Features</li>
          </Link>
        </ul>
        <nav className="">
          <div className="lgss:flex gap-8 justify-center items-center">

          <Link
            className="hidden lgss:flex cursor-pointer font-semibold capitalize text-[16px]"
            to={"/login"}
          >
            <p>Log in</p>
          </Link>
          <GetStartedBtn />
          </div>
          <Link to={"/overview"}>
            <div className="w-2 h-2 rounded-full bg-primary bg-opacity-5"></div>
          </Link>
          <div className="lgss:hidden flex">
            {isOpen ? (
              <FaTimes
                onClick={() => setIsOpen(false)}
                className="cursor-pointer text-secondary z-50 text-[24px]"
              />
            ) : (
              <FaBars
                onClick={() => setIsOpen(true)}
                className="cursor-pointer text-secondary z-50 text-[24px]"
              />
            )}
          </div>
        </nav>
      </header>
      {isOpen && (
        <div className="fixed top-0 left-0 h-screen bg-white w-full text-secondary font-bold lgss:hidden flex flex-col pt-8 z-50 transform transition-transform duration-300 translate-x-0">
          <div className="bg-white flex flex-col justify-center items-center w-full h-screen">
            <ul className="flex flex-col gap-8 my-6 pb-8 justify-center text-secondary font-semibold text-[20px]">
              <Link to={"/about"}>
                <li>About</li>
              </Link>
              <Link to={"/features"}>
                <li>Features</li>
              </Link>
            </ul>
            <div className="flex flex-col-reverse justify-center items-center gap-10 w-full px-[10%]">
              <Link className="w-full" to={"/login"}>
                <button className="bg-white rounded-xl py-4 px-6 shadow-md text-secondary w-full border">
                  Log In
                </button>
              </Link>
              <Link className="w-full" to={"/overview"}>
                <button className="bg-primary rounded-xl py-4 px-3 shadow-md text-white w-full">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavBar;
