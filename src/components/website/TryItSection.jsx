import React from "react";

function TryItSection() {
  return (
    <div className="bg-white w-full h-fit font-lato flex flex-col items-center text-center px-5 py-20">
      <div className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-full mb-4">
        Free Trial
      </div>
      <h2 className="text-4xl font-semibold mb-4">Try TaskMe For Free Today</h2>
      <p className="text-center text-gray-700 mb-8">
        Boost your productivity level with TaskMe today and never look back.
      </p>
      <button className="bg-primary text-white px-6 mt-10 py-3 rounded-lg font-semibold">
        Start your journey for free
      </button>
    </div>
  );
}

export default TryItSection;
