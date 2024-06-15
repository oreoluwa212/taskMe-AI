// AboutUs.jsx
import React from "react";
import HeaderBg from "../headerText/HeaderBg";

function AboutUs() {
  return (
    <div className="w-full flex flex-col justify-center items-center h-fit py-20 mb-10">
      <HeaderBg headerText={"about us"} />
      <div className="w-4/5 lg:w-3/5 text-center">
        <div className="my-10">
          <h2 className="text-3xl font-bold text-blue-800">Our Story</h2>
          <p className="mt-4 text-gray-700">
            TaskMe was born out of the collective frustration of a group of
            passionate individuals who felt overwhelmed by the complexity of
            task management tools available in the market. We believe there had
            to be a better way, a simpler, more intuitive solution that could
            help individuals stay organized, productive and focused on what
            matters most.
          </p>
        </div>
        <div className="my-10">
          <h2 className="text-3xl font-bold text-blue-800">Our Approach</h2>
          <p className="mt-4 text-gray-700">
            We’re not just another task management tool, we’re your trusted
            partner in productivity. Our approach is simple yet powerful; we
            combine cutting-edge technology with intuitive design to create a
            seamless task management experience. With TaskMe, you can break down
            projects into manageable tasks and track your progress in real time.
          </p>
        </div>
        <div className="my-10">
          <h2 className="text-3xl font-bold text-blue-800">Our Mission</h2>
          <p className="mt-4 text-gray-700">
            Our mission is clear; to empower individuals to achieve their goals
            with ease and efficiency. We believe that everyone deserves access
            to tools that simplify their workflow and ultimately drives success.
          </p>
        </div>
        <div className="my-10">
          <h2 className="text-3xl font-bold text-blue-800">Our Values</h2>
          <p className="mt-4 text-gray-700">
            Transparency, simplicity and user-centricity are at the core of
            everything we do. We’re committed to providing a product that’s not
            only easy to use, but also a joy to use.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;