import React from "react";
import { Fragment } from "react";
import NavBar from "../../components/website/NavBar";
import HeroSection from "../../components/website/HeroSection";
import FeaturesSection from "../../components/website/FeaturesSection";
import HowItWorks from "../../components/website/HowItWorks";

const LandingPage = () => {
  return (
    <Fragment>
      <NavBar />
      <HeroSection/>
      <FeaturesSection/>
      <HowItWorks/>
      <div className="w-full px-[5%]"></div>
    </Fragment>
  );
};

export default LandingPage;
