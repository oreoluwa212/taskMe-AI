import React from "react";

const FormComponent = ({ fields, buttonText, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      {fields.map((field, index) => (
        <input
          key={index}
          type={field.type}
          placeholder={field.placeholder}
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
      ))}
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default FormComponent;
