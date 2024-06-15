import React from "react";
import { ResetPasswordBg } from "../../../public";
import VerifyEmailModal from "../../components/website/modals/VerifyEmailModal";

const VerifyEmailPage = () => {
  const email = "davidadeyemi@gmail.com";

  const handleResend = () => {
    console.log("Resend email to", email);
  };

  const handleVerified = () => {
    console.log("Email verified");
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center relative">
      <img
        src={ResetPasswordBg}
        className="absolute w-full h-full object-cover"
        alt="Background"
      />
      <div className="relative z-10 w-full flex justify-center">
        <VerifyEmailModal
          email={email}
          onResend={handleResend}
          onVerified={handleVerified}
        />
      </div>
    </div>
  );
};

export default VerifyEmailPage;
