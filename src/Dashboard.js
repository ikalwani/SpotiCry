// src/Dashboard.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./Components/LogoutButton"; 
import Profile from "./Components/Profile";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();

  console.log("isAuthenticated:", isAuthenticated);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-item" onClick={() => navigate("/dashboard")}>
          Dashboard
        </div>
        <div className="header-item" onClick={() => navigate("/visualize")}>
          Visualize
        </div>
        {isAuthenticated ? (
          <LogoutButton className="logout-button-header" />
        ) : (
          <p>Not authenticated</p> // Debugging statement
        )}
      </header>

      <main className="dashboard-main">
        <h2>Welcome to Your Dashboard</h2>
        <p>
          Need to log your tears? Fill the form below and we will take care of
          the rest.
        </p>
        <div className="google-form-container">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSensxeLgh36JOTNZRZyKplrDhRrDYIAxo6mzHWqBPP9x9MllQ/viewform?embedded=true"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Google Form"
          >
            Loading…
          </iframe>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2024 SpotiCry. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
