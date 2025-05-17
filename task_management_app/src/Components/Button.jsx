import React from "react";

const Button = ({ type = "button", className = "", children, onClick }) => {
  return (
    <button
      type={type}
      style={{ color: "white" }} // Ensure text is white
      className={`w-full py-2.5 px-4 bg-[#14B8A6] hover:bg-teal-600 font-semibold rounded-lg shadow-md transition-colors duration-200 transform hover:scale-[1.01] ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
