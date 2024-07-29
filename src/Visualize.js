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

// import React, { useState, useEffect } from "react";
// import { useAuth0 } from "@auth0/auth0-react";
// import LogoutButton from "./Components/LogoutButton";
// import { useNavigate } from "react-router-dom";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   BarElement,
// } from "chart.js";
// import { Pie, Line, Bar } from "react-chartjs-2";
// import { motion } from "framer-motion";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   BarElement
// );

// const Visualize = () => {
//   const [userData, setUserData] = useState(null);
//   const [currentInsight, setCurrentInsight] = useState(0);
//   const { user, isAuthenticated, isLoading } = useAuth0();
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (isAuthenticated && user?.email) {
//       fetchUserData(user.email);
//     }
//   }, [isAuthenticated, isLoading, user]);

//   const fetchUserData = async (email) => {
//     try {
//       const response = await fetch(
//         `http://localhost:5001/api/user-data?email=${email}`
//       );
//       const data = await response.json();
//       if (response.ok) {
//         const uniqueData = data.filter(
//           (entry, index, self) =>
//             index ===
//             self.findIndex(
//               (e) =>
//                 e.timestamp === entry.timestamp &&
//                 e.date === entry.date &&
//                 e.intensity === entry.intensity &&
//                 e.trigger.toString() === entry.trigger.toString() &&
//                 e.location === entry.location
//             )
//         );
//         setUserData(uniqueData);
//       } else {
//         console.error("Server responded with an error:", data);
//       }
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   const prepareChartData = () => {
//     if (!userData) return null;

//     const emotionCounts = {};
//     const intensityOverTime = [];
//     const locationCounts = {};
//     const physicalSymptomsCounts = {};
//     const selfCareCounts = {};

//     userData.forEach((entry) => {
//       // Count emotions
//       entry.trigger.forEach((emotion) => {
//         emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
//       });

//       // Track intensity over time
//       intensityOverTime.push({
//         x: new Date(entry.date),
//         y: entry.intensity,
//       });

//       // Count locations
//       locationCounts[entry.location] =
//         (locationCounts[entry.location] || 0) + 1;

//       // Count physical symptoms
//       entry.physical_symptoms.forEach((symptom) => {
//         physicalSymptomsCounts[symptom] =
//           (physicalSymptomsCounts[symptom] || 0) + 1;
//       });

//       // Count self-care strategies
//       selfCareCounts[entry.self_care] =
//         (selfCareCounts[entry.self_care] || 0) + 1;
//     });

//     const pieData = {
//       labels: Object.keys(emotionCounts),
//       datasets: [
//         {
//           data: Object.values(emotionCounts),
//           backgroundColor: [
//             "#FF6384",
//             "#36A2EB",
//             "#FFCE56",
//             "#4BC0C0",
//             "#9966FF",
//             "#FF9F40",
//           ],
//         },
//       ],
//     };

//     const lineData = {
//       datasets: [
//         {
//           label: "Emotion Intensity",
//           data: intensityOverTime,
//           borderColor: "rgb(75, 192, 192)",
//           tension: 0.1,
//         },
//       ],
//     };

//     const locationData = {
//       labels: Object.keys(locationCounts),
//       datasets: [
//         {
//           label: "Entries per Location",
//           data: Object.values(locationCounts),
//           backgroundColor: "rgba(255, 99, 132, 0.5)",
//         },
//       ],
//     };

//     const symptomData = {
//       labels: Object.keys(physicalSymptomsCounts),
//       datasets: [
//         {
//           label: "Frequency of Physical Symptoms",
//           data: Object.values(physicalSymptomsCounts),
//           backgroundColor: "rgba(53, 162, 235, 0.5)",
//         },
//       ],
//     };

//     const selfCareData = {
//       labels: Object.keys(selfCareCounts),
//       datasets: [
//         {
//           label: "Frequency of Self-Care Strategies",
//           data: Object.values(selfCareCounts),
//           backgroundColor: "rgba(75, 192, 192, 0.5)",
//         },
//       ],
//     };

//     return { pieData, lineData, locationData, symptomData, selfCareData };
//   };

//   const getInsights = () => {
//     if (!userData) return [];

//     const emotionCounts = {};
//     userData.forEach((entry) => {
//       entry.trigger.forEach((emotion) => {
//         emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
//       });
//     });

//     const mostFrequentEmotion = Object.keys(emotionCounts).reduce((a, b) =>
//       emotionCounts[a] > emotionCounts[b] ? a : b
//     );
//     const averageIntensity =
//       userData.reduce((sum, entry) => sum + entry.intensity, 0) /
//       userData.length;
//     const mostCommonLocation = Object.entries(
//       userData.reduce((acc, entry) => {
//         acc[entry.location] = (acc[entry.location] || 0) + 1;
//         return acc;
//       }, {})
//     ).sort((a, b) => b[1] - a[1])[0][0];

//     return [
//       `Your most frequent emotion this year was ${mostFrequentEmotion}.`,
//       `Your average emotion intensity was ${averageIntensity.toFixed(
//         1
//       )} out of 10.`,
//       `You experienced most of your emotions at ${mostCommonLocation}.`,
//     ];
//   };

//   if (isLoading) {
//     return <div>Loading authentication...</div>;
//   }

//   const chartData = prepareChartData();
//   const insights = getInsights();

//   return (
//     <div className="dashboard-container">
//       <header className="dashboard-header">
//         <div className="header-item" onClick={() => navigate("/dashboard")}>
//           Dashboard
//         </div>
//         <div className="header-item" onClick={() => navigate("/visualize")}>
//           Visualize
//         </div>
//         {isAuthenticated ? (
//           <LogoutButton className="logout-button-header" />
//         ) : (
//           <p>Not authenticated</p>
//         )}
//       </header>
//       <h2>Your Emotional Journey Visualization</h2>
//       {userData ? (
//         <div>
//           <motion.div
//             key={currentInsight}
//             initial={{ opacity: 0, y: 50 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -50 }}
//             transition={{ duration: 0.5 }}
//           >
//             <h3>Did you know?</h3>
//             <p>{insights[currentInsight]}</p>
//             <button
//               onClick={() =>
//                 setCurrentInsight((currentInsight + 1) % insights.length)
//               }
//             >
//               Next Insight
//             </button>
//           </motion.div>

//           <h3>Emotion Distribution</h3>
//           {chartData && <Pie data={chartData.pieData} />}

//           <h3>Emotion Intensity Over Time</h3>
//           {chartData && (
//             <Line
//               data={chartData.lineData}
//               options={{
//                 scales: {
//                   x: {
//                     type: "time",
//                     time: {
//                       unit: "day",
//                     },
//                   },
//                   y: {
//                     beginAtZero: true,
//                     max: 10,
//                   },
//                 },
//               }}
//             />
//           )}

//           <h3>Emotions by Location</h3>
//           {chartData && <Bar data={chartData.locationData} />}

//           <h3>Most Common Physical Symptoms</h3>
//           {chartData && <Bar data={chartData.symptomData} />}

//           <h3>Most Effective Self-Care Strategies</h3>
//           {chartData && <Bar data={chartData.selfCareData} />}

//           <h3>Your Entries:</h3>
//           {userData.length > 0 ? (
//             userData.map((entry, index) => (
//               <div key={index} className="entry">
//                 <p>
//                   <strong>Timestamp:</strong> {entry.timestamp}
//                 </p>
//                 <p>
//                   <strong>Date:</strong> {entry.date}
//                 </p>
//                 <p>
//                   <strong>Intensity:</strong> {entry.intensity}
//                 </p>
//                 <p>
//                   <strong>Trigger:</strong> {entry.trigger.join(", ")}
//                 </p>
//                 <p>
//                   <strong>Location:</strong> {entry.location}
//                 </p>
//                 <p>
//                   <strong>Social Context:</strong> {entry.social_context}
//                 </p>
//                 <p>
//                   <strong>Duration:</strong> {entry.duration}
//                 </p>
//                 <p>
//                   <strong>Physical Symptoms:</strong>{" "}
//                   {entry.physical_symptoms.join(", ")}
//                 </p>
//                 <p>
//                   <strong>Self Care:</strong> {entry.self_care}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p>No entries found.</p>
//           )}
//         </div>
//       ) : (
//         <p>Loading your data...</p>
//       )}
//     </div>
//   );
// };

// export default Visualize;