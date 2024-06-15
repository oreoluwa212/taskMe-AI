import React from "react";
import FormComponent from "../../components/website/cards/FormComponent";
import { Link, useNavigate } from "react-router-dom";
import { loginSignImg, logo } from "../../../public";

const NewPasswordPage = () => {
  const navigate = useNavigate();

  const fields = [
    { type: "password", label: "New Password" },
    { type: "password", label: "Confirm Password" },
  ];

  const handleSubmit = (formValues) => {
    console.log(formValues);
    navigate("login");
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
        <h2 className="text-lg lgss:text-2xl font-semibold lgss:mb-4 text-center">
          Create New Password
        </h2>
        <div className="bg-white lgss:w-[60%] w-[80%] px-10 rounded shadow-custom-xl py-5 lgss:mt-4 mt-0">
          <FormComponent
            fields={fields}
            buttonText="Create new password"
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default NewPasswordPage;
