import React from "react";
import H1Text from "./headerText/H1Text";

function TryItSection() {
  return (
    <div className="bg-white w-full h-fit font-lato flex flex-col items-center text-center px-5 py-20">
      <div className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-full mb-4">
        Free Trial
      </div>
      <H1Text
        h2Text={"Try TaskMe For Free Today"}
        pText={
          "Boost your productivity level with TaskMe today and never look back."
        }
      />
      <button className="bg-primary text-white px-6 mt-10 py-3 rounded-lg font-semibold">
        Start your journey for free
      </button>
    </div>
  );
}

export default TryItSection;
