import React from "react";
import { Fragment } from "react";
import NavBar from "../../components/website/NavBar";
import HeroSection from "../../components/website/HeroSection";

const LandingPage = () => {
  return (
    <Fragment>
      <NavBar />
      <HeroSection/>
      <div className="w-full px-[5%]"></div>
    </Fragment>
  );
};

export default LandingPage;
