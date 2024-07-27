import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Visualize = () => {
  const [userData, setUserData] = useState(null);
  const { user, isAuthenticated, isLoading } = useAuth0();

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
      `http://localhost:5000/api/user-data?email=${email}`
    );
    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Received data:", data);
    if (response.ok) {
      setUserData(data);
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
    <div>
      <h2>Your Emotional Journey Visualization</h2>
      {userData ? (
        <div>
          <h3>Your Entries:</h3>
          {userData.map((entry, index) => (
            <div key={index} className="entry">
              {/* ... entry details ... */}
            </div>
          ))}
        </div>
      ) : (
        <p>Loading your data... {JSON.stringify({ isAuthenticated, user })}</p>
      )}
    </div>
  );
};

export default Visualize;
