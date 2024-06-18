import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormComponent from "../../components/website/cards/FormComponent";
import { loginSignImg, logo, ResetPasswordBg } from "../../../public";
import SignupVerifyEmailPage from "./SignupVerifyEmailPage";
import H1Text from "../../components/website/headerText/H1Text";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fields = [
    { type: "text", label: "First Name" },
    { type: "text", label: "Last Name" },
    { type: "email", label: "Email Address" },
    { type: "password", label: "Password" },
  ];

  const handleSubmit = async (formValues) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://pink-trees-demonic-ticket-production.pipeops.app/v1/auth",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formValues["First Name"],
            lastName: formValues["Last Name"],
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
      setEmail(formValues["Email Address"]);
      toast.success("Account created successfully! Please verify your email.");
      setStep(2);
    } catch (error) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {step === 1 && (
        <div className="w-full md:flex-row flex flex-col">
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
            <div className="mt-6 pt-8">
              <H1Text h2Text={"Create your free account"} />
            </div>
            <div className="bg-white lgss:w-[60%] w-[80%] px-5 lgss:px-10 rounded shadow-custom-xl py-7 lgss:mt-4 mt-0">
              {error && <p className="text-red-500 mb-4">{error}</p>}
              <FormComponent
                fields={fields}
                buttonText="Sign Up"
                onSubmit={handleSubmit}
                loading={loading}
              />
              <div className="mt-4 text-center justify-center flex gap-4">
                <p className="text-gray-700">Already have an account?</p>
                <Link
                  to="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {step === 2 && <SignupVerifyEmailPage email={email} />}
    </div>
  );
};

export default SignUpPage;
