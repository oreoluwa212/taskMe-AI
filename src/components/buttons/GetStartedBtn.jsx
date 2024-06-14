import React from "react";
import { Link } from "react-router-dom";
import { Fragment } from "react";

function GetStartedBtn() {
  return (
    <Fragment>
      <Link to={"/"}>
        <button className="px-5 py-3 bg-primary text-white capitalize text-[16px] rounded-[8px]">create an account</button>
      </Link>
    </Fragment>
  );
}

export default GetStartedBtn;
