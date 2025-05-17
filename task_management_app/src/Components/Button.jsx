import React from "react";

const Button = ({ type = "button", className = "", children, onClick }) => {
  return (
    <button
      type={type}
      style={{ color: "white" }}
      className={`
        w-full 
        py-2.5 px-4 
        bg-[#14B8A6] 
        hover:bg-teal-600 
        font-semibold 
        rounded-lg 
        shadow-md 
        transition 
        duration-200 
        ease-in-out 
        transform 
        hover:scale-[1.01]
        text-sm sm:text-base
        sm:py-3 sm:px-6
        active:scale-95
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
