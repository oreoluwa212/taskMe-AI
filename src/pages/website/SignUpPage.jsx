import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormComponent from "../../components/website/cards/FormComponent";
import { loginSignImg, logo, ResetPasswordBg } from "../../../public";
import CodeVerificationModal from "../../components/website/modals/CodeVerificationModal";
import SignupVerifyEmailPage from "./SignupVerifyEmailPage";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const fields = [
    { type: "text", label: "First Name" },
    { type: "text", label: "Last Name" },
    { type: "email", label: "Email Address" },
    { type: "password", label: "Password" },
  ];

  const handleSubmit = (formValues) => {
    setEmail(formValues.email);
    setStep(2);
    navigate("/signup/verify-email", { state: { email: formValues.email, step: 2 } });
  };

  const handleResend = () => {
    console.log("Resend email to", email);
  };

  const handleVerified = () => {
    setStep(3);
    navigate("/verify-otp", { state: { email: email, step: 3 } });
  };

  const handleOTPVerified = () => {
    setStep(4);
    navigate("/login", { state: { email: email, step: 4 } });
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
            <h2 className="text-lg lgss:text-2xl font-semibold pt-8 lgss:pt-0 my-4 text-center">
              Create your free account
            </h2>
            <div className="bg-white lgss:w-[60%] px-10 rounded shadow-custom-xl py-5 lgss:mt-4 mt-0">
              <FormComponent
                fields={fields}
                buttonText="Sign Up"
                onSubmit={handleSubmit}
              />
              <div className="mt-4 text-center justify-center flex gap-2">
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
      {step === 2 && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <img
            src={ResetPasswordBg}
            className="absolute w-full h-full object-cover"
            alt="Background"
          />
          <div className="relative z-10 w-full flex justify-center">
            <SignupVerifyEmailPage
              email={email}
              onResend={handleResend}
              onVerified={handleVerified}
            />
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <img
            src={ResetPasswordBg}
            className="absolute w-full h-full object-cover"
            alt="Background"
          />
          <div className="relative z-10 w-full flex justify-center">
            <CodeVerificationModal onVerify={handleOTPVerified} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUpPage;
