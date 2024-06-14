import React from "react";
import { Fragment } from "react";
import NavBar from "../../components/website/NavBar";
import Footer from "../../components/website/Footer";
import JoinUsSection from "../../components/website/aboutUsPage/JoinUsSection";

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