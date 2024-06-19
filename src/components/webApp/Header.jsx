import React from "react";
import { HiOutlineBell } from "react-icons/hi";
import { BiSolidUserCircle } from "react-icons/bi";
import { LiaAngleDownSolid } from "react-icons/lia";

const Header = ({ userName }) => {
  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-US", options);

  const getInitials = (name) => {
    const nameParts = name.split(" ");
    if (nameParts.length === 2) {
      return nameParts[0][0] + nameParts[1][0];
    }
    return name[0];
  };

  const userInitials = userName ? getInitials(userName) : null;

  return (
    <div className="w-full h-fit py-8 font-lato border-b-[1px] shadow-sm border-[#19437E] flex justify-between bg-white items-start px-[5%] lgss:px-7">
      <div className="w-[70%]">
        <h4 className="text-xl font-medium text-[#6B7276]">{formattedDate}</h4>
      </div>
      <div className="flex justify-between items-center gap-2 w-[31%] px-8">
        <HiOutlineBell className="text-3xl text-[#19437E]" />
        {userInitials ? (
          <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#82B0C8] rounded-full text-white text-[22px]">
            {userInitials}
          </div>
        ) : (
          <BiSolidUserCircle className="text-3xl text-[#19437E]" />
        )}
        <div className="inline-flex justify-center items-center gap-3">

        <p className="text-2xl text-[#6B7276] ">{userName || "Guest"}</p>
        <span>
          <LiaAngleDownSolid className="text-lg text-[#3B3F42]" />
        </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
