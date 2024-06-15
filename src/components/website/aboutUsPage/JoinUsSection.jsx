import React from "react";
import HeaderBg from "../headerText/HeaderBg";
import H1Text from "../headerText/H1Text";

function JoinUsSection() {
  return (
    <div className="w-full flex flex-col justify-center items-center h-fit lgss:py-20 mb-10">
      <HeaderBg headerText={"join us"} />
      <div className="w-[80%] lgss:w-[40%]">
        <H1Text
          h2Text={"Join Us"}
          pText={
            "Whether you're a freelancer juggling multiple projects, a small business owner looking to streamline your workflow, TaskMe is here for you. "
          }
        />
      </div>
      <button className="bg-primary text-white px-6 my-14 py-3 rounded-lg font-semibold">
        Start your journey for free
      </button>
    </div>
  );
}

export default JoinUsSection;
