import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Visualize.css";
import LogoutButton from "./Components/LogoutButton";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  TimeScale,
} from "chart.js";
import { Pie, Line, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import "chartjs-adapter-date-fns"; 

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  BarElement,
  TimeScale 
);

const Visualize = () => {
  const [userData, setUserData] = useState(null);
  const [currentInsight, setCurrentInsight] = useState(0);
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchUserData(user.email);
    }
  }, [isAuthenticated, user]);

  const fetchUserData = async (email) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/user-data?email=${email}`
      );
      const data = await response.json();
      if (response.ok) {
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

  const prepareChartData = () => {
    if (!userData) return null;

    const emotionCounts = {};
    const intensityOverTime = [];
    const locationCounts = {};
    const physicalSymptomsCounts = {};
    const selfCareCounts = {};

    userData.forEach((entry) => {
      entry.trigger.forEach((emotion) => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });

      intensityOverTime.push({
        x: new Date(entry.date),
        y: entry.intensity,
      });

      locationCounts[entry.location] =
        (locationCounts[entry.location] || 0) + 1;

      entry.physical_symptoms.forEach((symptom) => {
        physicalSymptomsCounts[symptom] =
          (physicalSymptomsCounts[symptom] || 0) + 1;
      });

      selfCareCounts[entry.self_care] =
        (selfCareCounts[entry.self_care] || 0) + 1;
    });

    const pieData = {
      labels: Object.keys(emotionCounts),
      datasets: [
        {
          data: Object.values(emotionCounts),
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    };

    const lineData = {
      datasets: [
        {
          label: "Emotion Intensity",
          data: intensityOverTime,
          borderColor: "#36A2EB",
          backgroundColor: "#36A2EB",
          tension: 0.1,
        },
      ],
    };

    const locationData = {
      labels: Object.keys(locationCounts),
      datasets: [
        {
          label: "Entries per Location",
          data: Object.values(locationCounts),
          backgroundColor: "#FF6384",
        },
      ],
    };

    const symptomData = {
      labels: Object.keys(physicalSymptomsCounts),
      datasets: [
        {
          label: "Frequency of Physical Symptoms",
          data: Object.values(physicalSymptomsCounts),
          backgroundColor: "#FFCE56",
        },
      ],
    };

    const selfCareData = {
      labels: Object.keys(selfCareCounts),
      datasets: [
        {
          label: "Frequency of Self-Care Strategies",
          data: Object.values(selfCareCounts),
          backgroundColor: "#4BC0C0",
        },
      ],
    };

    return { pieData, lineData, locationData, symptomData, selfCareData };
  };

  const getInsights = () => {
    if (!userData) return [];

    const emotionCounts = {};
    userData.forEach((entry) => {
      entry.trigger.forEach((emotion) => {
        emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
      });
    });

    const mostFrequentEmotion = Object.keys(emotionCounts).reduce((a, b) =>
      emotionCounts[a] > emotionCounts[b] ? a : b
    );
    const averageIntensity =
      userData.reduce((sum, entry) => sum + entry.intensity, 0) /
      userData.length;
    const mostCommonLocation = Object.entries(
      userData.reduce((acc, entry) => {
        acc[entry.location] = (acc[entry.location] || 0) + 1;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1])[0][0];

    return [
      `Your most frequent emotion this year was ${mostFrequentEmotion}.`,
      `Your average emotion intensity was ${averageIntensity.toFixed(
        1
      )} out of 10.`,
      `You experienced most of your emotions at ${mostCommonLocation}.`,
    ];
  };

  if (isLoading) {
    return <div>Loading authentication...</div>;
  }

  const chartData = prepareChartData();
  const insights = getInsights();

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
          <p>Not authenticated</p>
        )}
      </header>
      <div className="spoticry-container">
        <div className="spoticry-header">
          <h1>Your SpotiCry Year in Review</h1>
          <p>
            Explore your emotional journey through data and insights. Note that
            new data entries will take up to 15 minutes to show.
          </p>
        </div>
        {userData ? (
          <div className="spoticry-content">
            <motion.div
              key={currentInsight}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="spoticry-insight-title">Did you know?</h3>
              <p className="spoticry-insight">{insights[currentInsight]}</p>
              <button
                className="spoticry-insight-button"
                onClick={() =>
                  setCurrentInsight((currentInsight + 1) % insights.length)
                }
              >
                Next Insight
              </button>
            </motion.div>

            <div className="spoticry-charts">
              <div className="spoticry-chart">
                <h3 className="spoticry-chart-title">Emotion Distribution</h3>
                {chartData && <Pie data={chartData.pieData} />}
              </div>

              <div className="spoticry-chart">
                <h3 className="spoticry-chart-title">
                  Emotion Intensity Over Time
                </h3>
                {chartData && (
                  <Line
                    data={chartData.lineData}
                    options={{
                      scales: {
                        x: {
                          type: "time",
                          time: {
                            unit: "day",
                          },
                          title: {
                            display: true,
                            text: "Date",
                          },
                        },
                        y: {
                          beginAtZero: true,
                          max: 10,
                          title: {
                            display: true,
                            text: "Intensity",
                          },
                        },
                      },
                    }}
                  />
                )}
              </div>

              <div className="spoticry-chart">
                <h3 className="spoticry-chart-title">Emotions by Location</h3>
                {chartData && <Bar data={chartData.locationData} />}
              </div>

              <div className="spoticry-chart">
                <h3 className="spoticry-chart-title">
                  Most Common Physical Symptoms
                </h3>
                {chartData && <Bar data={chartData.symptomData} />}
              </div>

              <div className="spoticry-chart">
                <h3 className="spoticry-chart-title">
                  Frequency of Self-Care Strategies
                </h3>
                {chartData && <Bar data={chartData.selfCareData} />}
              </div>
            </div>
          </div>
        ) : (
          <div class="no-data-message">
            No data available yet. Your new data is either being processed and
            will be available shortly, or you haven't recorded any entries yet!
          </div>
        )}
      </div>
    </div>
  );
};

export default Visualize;
