import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormComponent from "../../components/website/cards/FormComponent";
import VerifyEmailModal from "../../components/website/modals/VerifyEmailModal";
import CodeVerificationModal from "../../components/website/modals/CodeVerificationModal";
import { loginSignImg, logo } from "../../../public";

const SignUpPage = () => {
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
    // Here you would normally trigger the email verification process
  };

  const handleResend = () => {
    // Logic to resend the verification email
    console.log("Resend email to", email);
  };

  const handleVerified = () => {
    setStep(3);
  };

  const handleCodeVerification = () => {
    console.log("OTP Verified");
    // Redirect to the welcome page or dashboard
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="hidden w-full md:w-[50%] h-full lgss:flex overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Sign Up"
        />
      </div>
      <div className="w-full md:w-[50%] h-full flex flex-col items-center justify-center relative pt-8">
        <Link to="/" className="absolute top-4 right-4 text-white text-lg">
          <img src={logo} alt="Logo" />
        </Link>
        <h2 className="text-lg lgss:text-2xl font-semibold lgss:mb-4 text-center">
          Create your free account
        </h2>
        <div className="bg-white lgss:w-[60%] px-10 rounded shadow-custom-xl py-5 lgss:mt-4 mt-0">
          {step === 1 && (
            <FormComponent
              fields={fields}
              buttonText="Sign Up"
              onSubmit={handleSubmit}
            />
          )}
          {step === 2 && (
            <VerifyEmailModal
              email={email}
              onResend={handleResend}
              onVerified={handleVerified}
            />
          )}
          {step === 3 && (
            <CodeVerificationModal onVerify={handleCodeVerification} />
          )}
          {step === 1 && (
            <div className="mt-4 text-center justify-center flex gap-2">
              <p className="text-gray-700">Already have an account?</p>
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Log in
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;