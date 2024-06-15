import React, { useState, useEffect } from "react";

const CodeVerificationModal = ({ onVerify }) => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (code.join("").length === 5) {
      setTimeout(() => {
        setIsVerified(true);
        onVerify();
      }, 1000);
    }
  }, [code, onVerify]);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 4) {
        document.getElementById(`code-input-${index + 1}`).focus();
      }
    }
  };

  return (
    <div className="w-[30%] bg-white py-8 px-10 flex flex-col mx-auto rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Confirm your email address
      </h2>
      <div className="flex w-full  justify-between gap-2 mb-4">
        {code.map((digit, index) => (
          <input
            key={index}
            id={`code-input-${index}`}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            maxLength={1}
            className="w-10 p-2 border border-gray-300 rounded text-center"
          />
        ))}
      </div>
      {isVerified && (
        <p className="text-green-500 text-center">Code Verified!</p>
      )}
    </div>
  );
};

export default CodeVerificationModal;
