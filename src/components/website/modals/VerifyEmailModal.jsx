import React, { useState, useEffect } from "react";
import H1Text from "../headerText/H1Text";
import { envelope } from "../../../../public";

const VerifyEmailModal = ({ email, onResend, onVerified }) => {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    onResend();
  };

  return (
    <div className="w-[35%] bg-white py-4 px-[5%] flex flex-col justify-center items-center mx-auto rounded shadow-lg">
      <H1Text
        h2Text={"Verify your email address"}
        pText={`A verification email has been sent to your email address, (${email}).`}
      />
      <div className="py-6">
        <img src={envelope} alt="Envelope" />
      </div>
      <div className="mt-4 flex justify-between items-center w-full">
        {countdown > 0 ? (
          <p className="text-gray-500 font-semibold">
            Resend Code in {countdown}s
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-primary font-semibold hover:underline"
          >
            Kindly resend code
          </button>
        )}
        <button
          onClick={onVerified}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          I've Verified
        </button>
      </div>
    </div>
  );
};

export default VerifyEmailModal;
