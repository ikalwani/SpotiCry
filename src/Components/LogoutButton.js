// src/components/LogoutButton.js
import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = ({ className }) => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <button className={className} onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;
