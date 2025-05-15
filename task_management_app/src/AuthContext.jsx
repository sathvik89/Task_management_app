import React, { createContext, useState, useContext } from "react";
// Initial state mein user aur sidebar ka status rakhte hain
const initialState = {
  user: JSON.parse(localStorage.getItem("userInfo")) || null,
  isSidebarOpen: false,
};

// Context create kiya
const AuthContext = createContext(initialState);

export const AuthProvider = ({ children }) => {
  const [state, setState] = useState(initialState);

  // User aur token ko set karne ka function
  const setCredentials = (user, token) => {
    setState({ ...state, user });
    localStorage.setItem("userInfo", JSON.stringify(user));
    localStorage.setItem("token", token);
  };

  // Logout karne par sab clear
  const logout = () => {
    setState({ ...state, user: null });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("token");
  };

  // Sidebar toggle karne ke liye
  const toggleSidebar = () => {
    setState({ ...state, isSidebarOpen: !state.isSidebarOpen });
  };

  return (
    <AuthContext.Provider
      value={{ ...state, setCredentials, logout, toggleSidebar }}
    >
      {children}
    </AuthContext.Provider>
  );
};

//hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};
