import React from "react";
import { loginSignImg, logo } from "../../../public";
import { Link } from "react-router-dom";

const SignUpPage = () => {
  return (
    <div className="w-full h-screen flex">
      <div className="w-[50%] h-full flex overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Sign Up"
        />
      </div>
      <div className="w-[50%] h-full relative flex items-start justify-end p-4">
        <div className="pr-4 pt-3">
          <Link to={"/"}>
            <img src={logo} alt="Logo" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
