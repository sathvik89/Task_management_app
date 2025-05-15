import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../api";
import { useAuth } from "../AuthContext";

const Dashboard = () => {
  const { user, logout: handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      await logout();
      handleLogout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <button onClick={handleLogoutClick}>Logout</button>
    </div>
  );
};

export default Dashboard;
