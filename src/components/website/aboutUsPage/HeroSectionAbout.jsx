import {
  heroAbout,
} from "../../../../public";

function HeroSectionAbout() {
  return (
    <div className="w-full flex flex-col">
      <div className="flex lgss:flex-row flex-col w-full">
        <img src={heroAbout} alt="" />
      </div>
    </div>
  );
}

export default HeroSectionAbout;
