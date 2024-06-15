import React from "react";
import FormComponent from "../../components/website/cards/FormComponent";
import { Link, useNavigate } from "react-router-dom";
import { loginSignImg, logo } from "../../../public";
import H1Text from "../../components/website/headerText/H1Text";
import CustomBtn from "../../components/website/buttons/CustomBtn";

const ResetPwConfirm = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/login");
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="hidden w-full md:w-[50%] h-full lgss:flex overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Create New Password"
        />
      </div>
      <div className="w-full md:w-[50%] h-full flex flex-col items-center justify-center relative pt-8">
        <Link to="/" className="absolute top-4 right-4 text-white text-lg">
          <img src={logo} alt="" />
        </Link>

        <div className="bg-white lgss:w-[60%] w-[80%] px-10 rounded shadow-custom-xl py-5 lgss:mt-4 mt-0 flex flex-col gap-8">
          <H1Text
            h2Text={"You've reset your password"}
            pText={"Log into your dashboard now."}
          />
          <CustomBtn
            click={handleSubmit}
            className="bg-primary w-full text-white py-2 px-4 rounded"
            btnText="Go to Login"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPwConfirm;
