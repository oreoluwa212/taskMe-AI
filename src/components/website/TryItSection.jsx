import React from "react";
import H1Text from "./headerText/H1Text";
import { bluedot, hero2 } from "../../../public";

function TryItSection() {
  return (
    <div className="relative bg-white w-full h-fit font-lato flex flex-col items-center text-center px-5 py-20">
      {/* Blue dot */}
      <div className="absolute top-5 left-5 rounded-full mt-2 mr-2">
        <img src={bluedot} alt="" />
      </div>

      {/* Content */}
      <div className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-full my-8">
        Free Trial
      </div>
      <H1Text
        h2Text={"Try TaskMe For Free Today"}
        pText={
          "Boost your productivity level with TaskMe today and never look back."
        }
      />
      <button className="bg-primary text-white px-6 my-14 py-3 rounded-lg font-semibold">
        Start your journey for free
      </button>
      <div
        className="absolute inset-0 bg-no-repeat bg-right"
        style={{ backgroundImage: `url(${hero2})` }}
      ></div>
    </div>
  );
}

export default TryItSection;
