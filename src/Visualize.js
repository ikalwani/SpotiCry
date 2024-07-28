import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./Components/LogoutButton"; 
import { useNavigate } from "react-router-dom";

const Visualize = () => {
  const [userData, setUserData] = useState(null);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Auth state:", { isAuthenticated, isLoading, user });
    if (isAuthenticated && user?.email) {
      fetchUserData(user.email);
    }
  }, [isAuthenticated, isLoading, user]);

  const fetchUserData = async (email) => {
    try {
      console.log("Fetching data for email:", email);
      const response = await fetch(
        `http://localhost:5001/api/user-data?email=${email}`
      );
      console.log("Response status:", response.status);
      const data = await response.json();
      console.log("Received data:", data);
      if (response.ok) {
        // remove duplicate
        const uniqueData = data.filter(
          (entry, index, self) =>
            index ===
            self.findIndex(
              (e) =>
                e.timestamp === entry.timestamp &&
                e.date === entry.date &&
                e.intensity === entry.intensity &&
                e.trigger.toString() === entry.trigger.toString() &&
                e.location === entry.location
            )
        );
        setUserData(uniqueData);
      } else {
        console.error("Server responded with an error:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

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
      <h2>Your Emotional Journey Visualization</h2>
      {userData ? (
        <div>
          <h3>Your Entries:</h3>
          {userData.length > 0 ? (
            userData.map((entry, index) => (
              <div key={index} className="entry">
                <p>
                  <strong>Timestamp:</strong> {entry.timestamp}
                </p>
                <p>
                  <strong>Date:</strong> {entry.date}
                </p>
                <p>
                  <strong>Intensity:</strong> {entry.intensity}
                </p>
                <p>
                  <strong>Trigger:</strong> {entry.trigger.join(", ")}
                </p>
                <p>
                  <strong>Location:</strong> {entry.location}
                </p>
                <p>
                  <strong>Social Context:</strong> {entry.social_context}
                </p>
                <p>
                  <strong>Duration:</strong> {entry.duration}
                </p>
                <p>
                  <strong>Physical Symptoms:</strong>{" "}
                  {entry.physical_symptoms.join(", ")}
                </p>
                <p>
                  <strong>Self Care:</strong> {entry.self_care}
                </p>
              </div>
            ))
          ) : (
            <p>No entries found.</p>
          )}
        </div>
      ) : (
        <p>Loading your data...</p>
      )}
    </div>
  );
};

export default Visualize;
