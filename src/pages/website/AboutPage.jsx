import React from "react";
import { Fragment } from "react";
import NavBar from "../../components/website/NavBar";
import Footer from "../../components/website/Footer";
import JoinUsSection from "../../components/website/aboutUsPage/JoinUsSection";
import HeroSection from "../../components/website/HeroSection";

const AboutPage = () => {
  return (
    <Fragment>
      <NavBar />
      <JoinUsSection/>
      <Footer />
    </Fragment>
  );
};

export default AboutPage;