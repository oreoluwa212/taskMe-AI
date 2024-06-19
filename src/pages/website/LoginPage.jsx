import React, { useState } from "react";
import { loginSignImg, logo } from "../../../public";
import { Link, useNavigate } from "react-router-dom";
import FormComponent from "../../components/website/cards/FormComponent";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const LoginPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const fields = [
    { type: "email", label: "Email Address" },
    { type: "password", label: "Password" },
  ];

  const handleSubmit = async (formValues) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://taskai-backend.onrender.com/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formValues["Email Address"],
            password: formValues["Password"],
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || "Something went wrong. Please try again."
        );
        toast.error(
          errorData.message || "Something went wrong. Please try again."
        );
        setLoading(false);
        return;
      }

      const data = await response.json();
      toast.success("Login successful!");
      navigate("/overview");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="hidden w-full md:w-[50%] h-full lgss:flex overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Login"
        />
      </div>
      <div className="w-full md:w-[50%] h-full flex flex-col items-center justify-center relative pt-8">
        <Link to="/" className="absolute top-4 right-4 text-white text-lg">
          <img src={logo} alt="Logo" />
        </Link>
        <h2 className="text-lg lgss:text-2xl font-semibold lgss:mb-4 text-center">
          Welcome back
        </h2>
        <div className="bg-white lgss:w-[60%] w-[85%] px-5 lgss:px-10 rounded shadow-custom-xl py-8 lgss:mt-4 mt-0">
          <FormComponent
            fields={fields}
            buttonText={
              loading ? <ClipLoader color={"#123abc"} size={20} /> : "Login"
            }
            onSubmit={handleSubmit}
            showForgotPassword={true}
          />
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
