import React from "react";
import FeaturesCard from "../cards/FeaturesCard";
import { icon1, icon2, icon3 } from "../../../../public";
import FeaturesPageCard from "./FeaturesPageCard";

const HeroFeaturesPage = () => {
  return (
    <div className="w-full h-fit my-8 py-6 flex flex-col justify-center items-center">
      <div className="w-[50%] pt-10">
        <h1 className="text-dark font-semibold text-[26px] lgss:text-[40px] text-center flex flex-col">
          Discover how TaskMe can revolutionize your task management experience.
        </h1>
      </div>
      <div className="flex lgss:flex-row flex-col justify-between items-center w-[80%] mt-5 py-6">
        <FeaturesPageCard
          title={"Task Breakdown"}
          description={
            "TaskMe's automated task breakdown feature allows you to input your project details and let the system generate a daily task list. This ensures that you never miss a deadline and stay on top of your work."
          }
          imageUrl={icon1}
        />
        <FeaturesPageCard
          title={"Progress Tracking"}
          description={
            "Stay motivated and on track with our progress tracking feature. Visualize your progress over time and adjust your tasks as needed to ensure you meet your overall goals."
          }
          imageUrl={icon2}
        />
        <FeaturesCard
          title={"User Friendly Interface"}
          description={
            "Taskme is designed with the user in mind. Our intuitive interface makes it easy to manage your tasks, track your progress, and stay productive without any unnecessary complexity."
          }
          imageUrl={icon3}
        />
      </div>
    </div>
  );
};

export default HeroFeaturesPage;
