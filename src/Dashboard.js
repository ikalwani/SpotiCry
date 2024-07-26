import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Logout logic here
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-item" onClick={() => navigate("/dashboard")}>
          Dashboard
        </div>
        <div className="header-item" onClick={() => navigate("/visualize")}>
          Visualize
        </div>
      </header>

      <main className="dashboard-main">
        <h2>Welcome to Your Dashboard</h2>
        <p>
          Need to log your tears? Fill the form below and we will take care of the rest
        </p>
        <div className="google-form-container">
          {/* Embed Google Form */}
          {/* <iframe
            src="https://docs.google.com/forms/d/e/YOUR_GOOGLE_FORM_ID/viewform?embedded=true"
            width="640"
            height="800"
            frameBorder="0"
            marginHeight="0"
            marginWidth="0"
            title="Google Form"
          >
            Loading…
          </iframe> */}
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSensxeLgh36JOTNZRZyKplrDhRrDYIAxo6mzHWqBPP9x9MllQ/viewform?embedded=true"
            width="640"
            height="3066"
            frameborder="0"
            marginheight="0"
            marginwidth="0"
          >
            Loading…
          </iframe>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>&copy; 2024 SpotiCry. All rights reserved.</p>
      </footer>

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
