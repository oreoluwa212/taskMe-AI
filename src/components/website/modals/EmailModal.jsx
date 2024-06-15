import React, { useState } from "react";

const EmailModal = ({ onSubmit }) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="bg-white p-8 rounded shadow-custom-xl w-[30%]">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Reset Password
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-2 font-semibold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded outline-none"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-primary text-white mt-4 p-2 rounded font-semibold hover:bg-blue-600"
        >
          Submit email
        </button>
      </form>
    </div>
  );
};

export default EmailModal;
