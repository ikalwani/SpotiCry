import React, { useState } from "react";

const Home = () => {
  const [state, setState] = useState("");

  return (
    <div>
      <h1>Home Component</h1>
      <input
        type="text"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
    </div>
  );
};

export default Home;
