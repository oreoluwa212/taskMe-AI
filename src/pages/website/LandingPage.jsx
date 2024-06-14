import React from "react";
import { Fragment } from "react";
import NavBar from "../../components/website/NavBar";
import HeroSection from "../../components/website/HeroSection";
import FeaturesSection from "../../components/website/FeaturesSection";
import HowItWorks from "../../components/website/HowItWorks";
import Footer from "../../components/website/Footer";
import TryItSection from "../../components/website/TryItSection";

const LandingPage = () => {
  return (
    <Fragment>
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <TryItSection />
      <Footer />
    </Fragment>
  );
};

export default LandingPage;