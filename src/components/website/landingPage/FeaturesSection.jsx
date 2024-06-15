import React from "react";
import FeaturesCard from "../cards/FeaturesCard";
import { icon1, icon2, icon3 } from "../../../../public";
import HeaderBg from "../headerText/HeaderBg";
import H1Text from "../headerText/H1Text";

function FeaturesSection() {
  return (
    <div className="bg-blueBg w-full h-fit font-lato flex flex-col py-10 items-center">
      <HeaderBg headerText={"features"} />
      <H1Text
        h2Text={"Unleash the Power of TaskMe"}
        pText={"Dive into the features that make TaskMe a game changer."}
      />
      <div className="flex lgss:flex-row flex-col gap-8 justify-between items-center w-[80%] mt-5 py-6">
        <FeaturesCard
          title={"Task Breakdown"}
          description={
            "Input your project and let TaskMe break it down into manageable daily tasks."
          }
          imageUrl={icon1}
        />
        <FeaturesCard
          title={"Progress Tracking"}
          description={
            "Track your progress daily and stay on top of your deadlines."
          }
          imageUrl={icon2}
        />
        <FeaturesCard
          title={"User Friendly Interface"}
          description={
            "Enjoy an intuitive and user friendly interface designed for efficiency."
          }
          imageUrl={icon3}
        />
      </div>
    </div>
  );
}

export default FeaturesSection;
