import { hero1, hero2 } from "../../../public";
import CustomBtn from "./buttons/CustomBtn";

function HeroSection() {
  return (
    <div className="w-full flex flex-col">
      <div className="flex lgss:flex-row flex-col">
        <img className="hidden lgss:flex h-[80vh] w-[30%]" src={hero1} alt="" />
        <div className="flex flex-col justify-center items-center text-center mx-auto font-lato gap-6 px-[5%] h-[100vh] lgss:h-auto lgss:px-0">
          <h1 className="text-dark font-bold text-[26px] lgss:text-[40px] text-center flex flex-col">
            Simplify your Workflow with AI{" "}
            <span className="text-primary"> Productivity Partner.</span>
          </h1>
          <p className="text-dark font-semibold">
            Break down project timelines into daily tasks with our AI project
            management solution.
          </p>
          <div className="pt-10">
            <CustomBtn
              className="w-full py-4 mt-4 rounded-xl px-6 text-white bg-primary"
              btnText="Get started now"
            />
          </div>
        </div>
        <img className="hidden lgss:flex h-[80vh] w-[30%]" src={hero2} alt="" />
      </div>
    </div>
  );
}

export default HeroSection;
