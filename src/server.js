// server.js
const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://ikalwani:ishika26@spoticry.mty7fkz.mongodb.net/?retryWrites=true&w=majority&appName=SpotiCry";
const client = new MongoClient(uri);

app.get("/api/user-data", async (req, res) => {
  try {
    await client.connect();
    const db = client.db("spoticry");
    const users = db.collection("users");

    const email = req.query.email;
    const user = await users.findOne({ email: email });

    if (user) {
      res.json(user.entries);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user data" });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
