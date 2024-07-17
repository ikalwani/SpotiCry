import React, { useState, useEffect } from "react";
import logo from "./spoticry.png";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.message))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>Welcome to SpotiCry</h1>
        <p className="App-description">
          SpotiCry is your personal emotional companion, designed to help you
          understand and embrace your feelings. Just like how Spotify tracks
          your music journey, SpotiCry tracks your emotional odyssey.
        </p>
        <ul className="App-features">
          <li>Log your crying episodes</li>
          <li>Analyze your emotional patterns</li>
          <li>Gain insights into your emotional wellbeing</li>
          <li>Visualize your "Year in Tears"</li>
        </ul>
        <p className="App-motto">
          Remember, it's okay to cry. Let's turn those tears into self-discovery
          and growth.
        </p>
        <button className="App-button" onClick={}>Get Started</button>
        {message && <p>{message}</p>}
      </header>
    </div>
  );
}



export default App;
