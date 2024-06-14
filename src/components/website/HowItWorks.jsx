import React from "react";
import H1Text from "./headerText/H1Text";
import HeaderBg from "./headerText/HeaderBg";
import HowItWorksCard from "./cards/HowItWorksCard";
import { greendot, hero1 } from "../../../public";
import { FaArrowRightLong } from "react-icons/fa6";

function HowItWorks() {
  return (
    <div className="relative bg-white w-full h-fit font-lato flex flex-col py-10 items-center">
      <div
        className="absolute inset-0 bg-no-repeat bg-left"
        style={{ backgroundImage: `url(${hero1})` }}
      ></div>
      <img
        src={greendot}
        alt="Green Dot"
        className="absolute top-10 right-10 w-4 h-4"
      />
      <HeaderBg headerText={"How it works"} />
      <H1Text
        h2Text={"Inside TaskMe's Engine"}
        pText={"Explore our very seamless process."}
      />
      <div className="flex lgss:flex-row flex-col justify-around items-center w-full px-[10%] mt-10">
        <HowItWorksCard
          step={"Step 1"}
          h3={"Input Your Project"}
          p={
            "Enter the details of your project, including the timeline and the key milestones."
          }
        />
        <div className="bg-primary rounded-full p-2 text-white text-2xl">
          <FaArrowRightLong />
        </div>
        <HowItWorksCard
          step={"Step 2"}
          h3={"Get Daily Tasks"}
          p={
            "TaskMe will break down your project into manageable daily tasks, ensuring progress."
          }
        />
        <div className="bg-primary rounded-full p-2 text-white text-2xl">
          <FaArrowRightLong />
        </div>
        <HowItWorksCard
          step={"Step 3"}
          h3={"Track Your Progress"}
          p={
            "Monitor your progress, adjust tasks as needed and stay on top of your deadlines."
          }
        />
      </div>
    </div>
  );
}

export default HowItWorks;
