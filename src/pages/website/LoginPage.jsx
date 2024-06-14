import React from "react";
import { loginSignImg, logo } from "../../../public";
import { Link } from "react-router-dom";
import FormComponent from "../../components/website/cards/FormComponent";

const LoginPage = () => {
  const fields = [
    { type: "email", label: "Email Address" },
    { type: "password", label: "Password" },
  ];

  const handleSubmit = (formValues) => {
    console.log(formValues);
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-[50%] h-full flex overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Login"
        />
      </div>
      <div className="w-full md:w-[50%] h-full flex flex-col items-center justify-center relative p-4">
        <Link to="/" className="absolute top-4 right-4 text-white text-lg">
          <img src={logo} alt="" />
        </Link>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Welcome back
        </h2>
        <div className="bg-white w-[60%] px-10 p-8 rounded shadow-custom-xl mt-16 md:mt-0">
          <FormComponent
            fields={fields}
            buttonText="Login"
            onSubmit={handleSubmit}
          />
          <div className="mt-4 text-center flex justify-center gap-2">
            <p className="text-gray-700">Don't have an account?</p>
            <Link
              to="/signup"
              className="text-primary hover:underline font-semibold"
            >
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
