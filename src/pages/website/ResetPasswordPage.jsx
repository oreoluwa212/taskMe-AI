import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmailModal from "../../components/website/modals/EmailModal";
import CodeVerificationModal from "../../components/website/modals/CodeVerificationModal";
import { ResetPasswordBg, logo } from "../../../public";

const ResetPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();


  const handleEmailSubmit = (email) => {
    setEmail(email);
    setStep(2);
  };

  const handleCodeVerification = () => {
    setStep(3);
    navigate("/new-password");
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <div className="w-full lgss:flex overflow-hidden absolute top-0 left-0">
        <img
          src={ResetPasswordBg}
          className="lgss:h-1/2 h-screen object-cover"
          alt="Reset Password"
        />
      </div>
      <Link to="/" className="absolute top-9 text-white text-lg">
        <img src={logo} alt="" />
      </Link>
      <div className="relative z-10 w-full flex justify-center">
        {step === 1 && <EmailModal onSubmit={handleEmailSubmit} />}
        {step === 2 && (
          <CodeVerificationModal onVerify={handleCodeVerification} />
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
