import React from "react";
import { Fragment } from "react";
import NavBar from "../../components/website/NavBar";
import HeroSection from "../../components/website/HeroSection";
import FeaturesSection from "../../components/website/FeaturesSection";
import HowItWorks from "../../components/website/HowItWorks";
import Footer from "../../components/website/Footer";

const LandingPage = () => {
  return (
    <Fragment>
      <NavBar />
      <HeroSection/>
      <FeaturesSection/>
      <HowItWorks/>
      <Footer/>
    </Fragment>
  );
};

export default LandingPage;
