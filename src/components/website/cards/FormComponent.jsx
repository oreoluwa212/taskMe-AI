import React from "react";

const FormComponent = ({ fields, buttonText, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      {fields.map((field, index) => (
        <div key={index} className="mb-4">
          <label className="block mb-2 font-semibold text-gray-700">
            {field.label}
          </label>
          <input
            type={field.type}
            className="w-full p-2 border border-gray-300 rounded outline-none"
          />
        </div>
      ))}
      <button
        type="submit"
        className="w-full bg-primary text-white p-2 rounded hover:bg-blue-600"
      >
        {buttonText}
      </button>
    </form>
  );
};

export default FormComponent;
