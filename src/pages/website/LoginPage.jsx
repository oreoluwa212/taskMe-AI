import React from "react";
import { loginSignImg } from "../../../public";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-[50%] h-full flex overflow-hidden">
        <img
          src={loginSignImg}
          className="w-full h-full object-cover"
          alt="Login"
        />
      </div>
      <div className="w-full md:w-[50%] h-full flex flex-col items-center justify-center bg-secondary relative p-4">
        <Link
          to="/"
          className="absolute top-4 right-4 md:text-white text-lg text-secondary md:block hidden"
        >
          Home
        </Link>
        <div className="bg-white p-8 rounded shadow-lg w-80 mt-16 md:mt-0">
          <h2 className="text-2xl mb-4 text-center">Login</h2>
          <form>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
            />
            <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Login
            </button>
          </form>
        </div>
        <Link
          to="/"
          className="md:hidden absolute bottom-4 right-4 text-lg text-white"
        >
          TaskMe
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;