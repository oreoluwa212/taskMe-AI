import React from "react";
import HeaderBg from "../headerText/HeaderBg";
import H1Text from "../headerText/H1Text";

function JoinUsSection() {
  return (
    <div className="relative bg-white w-full h-fit font-lato flex flex-col items-center text-center px-5 py-20">
      <HeaderBg headerText={"join us"} />
      <H1Text
        h2Text={"Join Us"}
        pText={
          "Whether you're a freelancer juggling multiple projects, a small business owner looking to streamline your workflow, TaskMe is here for you. "
        }
      />
      <button className="bg-primary text-white px-6 my-14 py-3 rounded-lg font-semibold">
        Start your journey for free
      </button>
      {/* <div
        className="absolute inset-0 bg-no-repeat bg-right"
        style={{ backgroundImage: `url(${hero2})` }}
      ></div> */}
    </div>
  );
}

export default JoinUsSection;
