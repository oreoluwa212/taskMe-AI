import { hero1, hero2, hero3, heroCircle1, heroCircle2 } from "../../../public";
import CustomBtn from "./buttons/CustomBtn";

function HeroSection() {
  return (
    <div className="w-full flex flex-col">
      <div className="flex lgss:flex-row flex-col lgss:mb-10">
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
          <div className="pt-10 w-full">
            <CustomBtn
              className="w-[50%] py-4 mt-4 rounded-xl text-white bg-primary"
              btnText="Get started now"
            />
          </div>
        </div>
        <img className="hidden lgss:flex h-[80vh] w-[30%]" src={hero2} alt="" />
      </div>
      <div className="relative w-full flex justify-center items-center lgss:pt-7 lgss:mt-10">
        <img
          className="absolute bottom-[1%] lgss:bottom-[-20%] left-5 lgss:left-[23%] h-[20vh] w-[20vh] lgss:h-[25vh] lgss:w-[25vh]"
          src={heroCircle1}
          alt=""
        />
        <img
          className="relative z-10 h-[40vh] w-[45vh] lgss:h-[60vh] lgss:w-[100vh]"
          src={hero3}
          alt=""
        />
        <img
          className="absolute top-[1%] lgss:top-[-10%] right-9 lgss:right-[22%] h-[20vh] w-[20vh] lgss:h-[25vh] lgss:w-[25vh]"
          src={heroCircle2}
          alt=""
        />
      </div>
    </div>
  );
}

export default HeroSection;
