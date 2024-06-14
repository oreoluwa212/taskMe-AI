import React from "react";

const FeaturesCard = ({ title, description, icon, className }) => {
  return (
    <div className="bg-white shadow-lg shadow-gray-300/50 h-[280px] max-w-[300px] w-[80%] rounded-[8px] flex flex-col justify-center items-start text-center px-2">
      {icon && (
        <div className={className}>{icon}</div>
      )}
      <h2 className="text-xl text-red font-bold mb-2">{title}</h2>
      <p className="text-left text-gray-700">{description}</p>
    </div>
  );
};

export default FeaturesCard;
