const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: ["https://spoticry.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

const uri =
  "mongodb+srv://ikalwani:ishika26@spoticry.mty7fkz.mongodb.net/?retryWrites=true&w=majority&appName=SpotiCry";
const client = new MongoClient(uri);

app.get("/api/user-data", async (req, res) => {
  console.time("Fetch User Data");
  try {
    await client.connect();
    console.log("Connected to database");
    const db = client.db("spoticry");
    const users = db.collection("users");

    const email = req.query.email;
    console.log("Received request for email:", email);

    const user = await users.findOne({ email: email });
    console.log("Fetched user:", user);

    if (user) {
      res.json(user.entries);
    } else {
      console.log("User not found for email:", email);
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error in /api/user-data:", error);
    res.status(500).json({
      message: "Error fetching user data",
      error: error.toString(),
    });
  } finally {
    await client.close();
    console.timeEnd("Fetch User Data");
  }
});


module.exports = app;
