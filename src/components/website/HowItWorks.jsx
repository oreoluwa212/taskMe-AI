// components/website/HowItWorks.js

import React from "react";
import H1Text from "./headerText/H1Text";
import HeaderBg from "./headerText/HeaderBg";
import HowItWorksCard from "./cards/HowItWorksCard";

function HowItWorks() {
  return (
    <div className="bg-white w-full h-fit font-lato flex flex-col py-10 items-center">
      <HeaderBg headerText={"How it works"} />
      <H1Text
        h2Text={"Inside TaskMe's Engine"}
        pText={"Explore our very seamless process."}
      />
      <div className="flex justify-around items-start w-full px-[10%] mt-10">
        <HowItWorksCard
          step={"Step 1"}
          h3={"Input Your Project"}
          p={
            "Enter the details of your project, including the timeline and the key milestones."
          }
        />
        <HowItWorksCard
          step={"Step 2"}
          h3={"Get Daily Tasks"}
          p={
            "TaskMe will break down your project into manageable daily tasks,ensuring progress"
          }
        />
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
