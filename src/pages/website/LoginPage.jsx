import React from "react";
import { loginSignImg, logo } from "../../../public";
import { Link } from "react-router-dom";
import FormComponent from "../../components/website/cards/FormComponent";

const LoginPage = () => {
  const fields = [
    { type: "email", placeholder: "Email", label: "Email" },
    { type: "password", placeholder: "Password", label: "Password" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <div className="bg-white p-8 rounded shadow-lg w-80 mt-16 md:mt-0">
          <FormComponent
            fields={fields}
            buttonText="Login"
            onSubmit={handleSubmit}
          />
          <div className="mt-4 text-center">
            <p className="text-gray-700">Don’t have an account?</p>
            <Link to="/signup" className="text-blue-500 hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
      <Link
        to="/"
        className="md:hidden absolute bottom-4 right-4 text-lg text-white"
      >
        Home
      </Link>
    </div>
  );
};

export default LoginPage;
