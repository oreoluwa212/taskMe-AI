import H1Text from "./headerText/H1Text"
import HeaderBg from "./headerText/HeaderBg";

function HowItWorks() {
  return (
    <div className="bg-white w-full h-[50vh] font-lato flex flex-col py-10 items-center">
      <HeaderBg headerText={"How it works"} />
      <H1Text
        h2Text={"Inside TaskMe's Engine"}
        pText={"Explore our very seemless process."}
      />
    </div>
  );
}

export default HowItWorks