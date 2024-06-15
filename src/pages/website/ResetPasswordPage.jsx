import React, { useState } from "react";
import EmailModal from "../../components/website/modals/EmailModal";
import CodeVerificationModal from "../../components/website/modals/CodeVerificationModal";
import { loginSignImg } from "../../../public";


const ResetPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const handleEmailSubmit = (email) => {
    setEmail(email);
    setStep(2);
  };

  const handleCodeVerification = () => {
    setStep(3);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <div className="w-full h-full lgss:flex overflow-hidden absolute top-0 left-0">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Reset Password"
        />
      </div>
      <div className="relative z-10">
        {step === 1 && <EmailModal onSubmit={handleEmailSubmit} />}
        {step === 2 && (
          <CodeVerificationModal onVerify={handleCodeVerification} />
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
