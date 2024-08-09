import React from "react";
import { useState, useEffect, useRef } from "react";
import logo from "./spoticry.png";
import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import AnimatedCircles from "./AnimatedCircles";
import Dashboard from "./Dashboard";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./Components/LoginButton.js";
import Visualize from "./Visualize";
import ProtectedRoute from "./ProtectedRoute";

function Home() {
  const [message, setMessage] = useState("");
  const elementsRef = useRef([]);
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    elementsRef.current.forEach((el) => {
      if (el instanceof Element) {
        observer.observe(el);
      }
    });

    return () => {
      elementsRef.current.forEach((el) => {
        if (el instanceof Element) {
          observer.unobserve(el);
        }
      });
    };
  }, []);

  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      loginWithRedirect();
    }
  };

  return (
    <div className="App">
      <AnimatedCircles />
      <header className="App-header">
        <img
          src={logo}
          className="App-logo fade-in"
          alt="logo"
          ref={(el) => (elementsRef.current[0] = el)}
        />
        <h1 className="fade-in" ref={(el) => (elementsRef.current[1] = el)}>
          Welcome to SpotiCry
        </h1>
        <p
          className="App-description fade-in"
          ref={(el) => (elementsRef.current[2] = el)}
        >
          SpotiCry is your personal emotional companion, designed to help you
          understand and embrace your feelings. Just like how Spotify tracks
          your music journey, SpotiCry tracks your emotional odyssey.
        </p>
        <ul
          className="App-features fade-in"
          ref={(el) => (elementsRef.current[3] = el)}
        >
          <li>Log your crying episodes</li>
          <li>Analyze your emotional patterns</li>
          <li>Gain insights into your emotional wellbeing</li>
          <li>Visualize your "Year in Tears"</li>
        </ul>
        <p
          className="App-motto fade-in"
          ref={(el) => (elementsRef.current[4] = el)}
        >
          Remember, it's okay to cry. Let's turn those tears into self-discovery
          and growth.
        </p>
        <button
          className="App-button"
          onClick={handleGetStartedClick}
          ref={(el) => (elementsRef.current[5] = el)}
        >
          Get Started
        </button>
        {message && <p className="fade-in">{message}</p>}
      </header>
    </div>
  );
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/visualize"
        element={
          <ProtectedRoute>
            <Visualize />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
