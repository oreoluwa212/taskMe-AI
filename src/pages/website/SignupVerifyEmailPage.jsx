import React from "react";
import { ResetPasswordBg, logo } from "../../../public";
import { Link } from "react-router-dom";
import SignupEmailVerify from "../../components/website/modals/SignupEmailVerify.Modal";

const SignupVerifyEmailPage = () => {
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
      <Link to="/" className="absolute top-9 text-white text-lg">
        <img src={logo} alt="" />
      </Link>
      <div className="relative z-10 w-full flex justify-center">
        <SignupEmailVerify
          email={email}
          onResend={handleResend}
          onVerified={handleVerified}
        />
      </div>
    </div>
  );
};

export default SignupVerifyEmailPage;
