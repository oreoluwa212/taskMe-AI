import React from "react";
import { Link } from "react-router-dom";
import GetStartedBtn from "../components/buttons/GetStartedBtn";
import { logo } from "../../public";

function NavBar() {
  return (
    <header className="flex items-center justify-between gap-4 px-[5%] py-7 w-full shadow-lg">
      <Link to={"/"}>
        <img className="h-auto" src={logo} alt="" />
      </Link>
      <ul className="hidden lgss:flex gap-6 justify-center items-center font-semibold">
        <Link to={"/"}>
          <li>About</li>
        </Link>
        <Link to={"/"}>
          <li>Features</li>
        </Link>
      </ul>
      <nav className=" lgss:flex gap-8 justify-center items-center">
        <Link
          className="hidden lgss:flex cursor-pointer font-semibold capitalize text-[16px]"
          to={"/"}
        >
          <p>log in</p>
        </Link>
        <GetStartedBtn />
      </nav>
    </header>
  );
}

export default NavBar;
