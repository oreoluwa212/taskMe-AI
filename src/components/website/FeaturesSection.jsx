import FeaturesCard from "./cards/FeaturesCard";
import { GrCopy } from "react-icons/gr";
import { IoFlash } from "react-icons/io5";


function FeaturesSection () {
  return (
    <div className="bg-blueBg w-full h-fit font-lato flex flex-col py-10 items-center">
      <div className="text-primary bg-[#E2E8FD] mb-6 p-2 rounded-full font-semibold">
        <p>FEATURES</p>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="font-semibold text-3xl">Unleash the Power of TaskMe</h2>
        <p className="font-medium">
          Dive into the features that make TaskMe a game changer.
        </p>
      </div>
      <div className="flex lgss:flex-row flex-col justify-between items-center w-[70%] gap-16 mt-5 py-6">
        <FeaturesCard
          title={"Task Breakdown"}
          description={
            "Input your project and let TaskMe break it down into manageable daily tasks."
          }
          icon={<GrCopy />}
          className={"text-[#56AC60]"}
        />
        <FeaturesCard
          title={"Progress Tracking"}
          description={
            "Track your progress daily and stay on top of your deadlines."
          }
        />
        <FeaturesCard
          title={"User Friendly Interface"}
          description={
            "Enjoy an intuitive and user friendly interface designed for efficiency."
          }
          icon={<IoFlash/>}
        />
      </div>
    </div>
  );
}

export default FeaturesSection