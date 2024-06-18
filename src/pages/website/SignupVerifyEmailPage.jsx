import React, { useState } from "react";
import { loginSignImg, logo } from "../../../public";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormComponent from "../../components/website/cards/FormComponent";

const LoginPage = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const fields = [
    { type: "email", label: "Email Address", name: "email" },
    { type: "password", label: "Password", name: "password" },
  ];

  const handleSubmit = async (formValues) => {
    setLoading(true);
    console.log("Form submitted with:", formValues);

    try {
      const response = await axios.post(
        "https://pink-trees-demonic-ticket-production.pipeops.app/v1/auth/login",
        formValues
      );

      if (response.status === 200) {
        console.log("Login successful:", response.data);
        toast.success("Login successful!");
        // Assuming successful login, redirect to dashboard or any other page
        history.push("/dashboard");
      } else {
        console.error("Login failed:", response.data);
        toast.error("Login failed. Please check your credentials.");
        // Handle login failure, display error message
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Error during login. Please try again later.");
      // Handle network errors or other exceptions
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <ToastContainer />
      <div className="hidden w-full md:w-[50%] h-full lgss:flex overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Sign Up"
        />
      </div>
      <div className="w-full md:w-[50%] h-full flex flex-col items-center justify-center relative pt-8">
        <Link to="/" className="absolute top-4 right-4 text-white text-lg">
          <img src={logo} alt="" />
        </Link>
        <h2 className="text-lg lgss:text-2xl font-semibold lgss:mb-4 text-center">
          Welcome back
        </h2>
        <div className="bg-white lgss:w-[60%] w-[85%] px-5 lgss:px-10 rounded shadow-custom-xl py-8 lgss:mt-4 mt-0">
          {loading && (
            <div className="flex justify-center">
              <div className="py-4">
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          {!loading && (
            <FormComponent
              fields={fields}
              buttonText="Login"
              onSubmit={handleSubmit}
              showForgotPassword={true}
            />
          )}
          <div className="mt-4 text-center flex justify-center gap-4">
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
