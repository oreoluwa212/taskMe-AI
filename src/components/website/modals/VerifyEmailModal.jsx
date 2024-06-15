import React from "react";
import H1Text from "../headerText/H1Text";

const VerifyEmailModal = ({ email, onResend, onVerified }) => {
  return (
    <div className="w-[35%] bg-white py-4 px-[5%] flex flex-col mx-auto rounded shadow-lg">
      <H1Text
        h2Text={"Verify your email address"}
        pText={`A verification email has been sent to your email address, (davidadeyemi@gmail.com).`}
      />
      <div className="mt-4 flex justify-between">
        <button
          onClick={onResend}
          className="bg-primary text-white px-4 py-2 rounded"
        >
          Resend Email
        </button>
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
