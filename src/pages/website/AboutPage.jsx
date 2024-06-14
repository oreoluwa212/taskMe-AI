import React from "react";
import { Fragment } from "react";
import NavBar from "../../components/website/NavBar";
import Footer from "../../components/website/Footer";
import JoinUsSection from "../../components/website/aboutUsPage/JoinUsSection";
import HeroSectionAbout from "../../components/website/aboutUsPage/HeroSectionAbout";

const AboutPage = () => {
  return (
    <Fragment>
      <NavBar />
      <HeroSectionAbout/>
      <JoinUsSection />
      <Footer />
    </Fragment>
  );
};

export default AboutPage;
