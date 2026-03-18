const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Moved up
require('dotenv').config({ path: path.resolve(__dirname, 'taftics.env') }); //
const User = require('./models/User'); // Adjust the path if needed

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000; //

// --- MIDDLEWARE ---
app.use(cors()); //
app.use(express.json()); // Allows the server to accept JSON data
app.use(express.urlencoded({ extended: true })); //
app.use(express.static('public')); //
app.use(fileUpload()); //

// --- DATABASE CONNECTION ---
const mongoUri = process.env.MONGO_URI; //
if (!mongoUri) { //
  console.error("❌ Missing MONGO_URI environment variable. Please set it in taftics.env."); //
  process.exit(1); //
}

mongoose.connect(mongoUri) //
  .then(() => console.log("✅ Connected to MongoDB via Compass")) //
  .catch(err => console.error("❌ Connection error:", err)); //

// --- ROUTES ---
app.get('/', (req, res) => { //
  res.send('API is running...'); //
});

// Your API routes (like app.post('/api/register')) will go here!
// Import your new Mongoose Model
const Establishment = require('./models/Establishment'); // Adjust path if needed

// --- API ROUTES ---

// 1. GET ALL ESTABLISHMENTS
app.get('/api/establishments', async (req, res) => {
  try {
    // .find({}) tells Mongoose to get everything in that collection
    const establishments = await Establishment.find({}); 
    res.json(establishments);
  } catch (error) {
    console.error("Error fetching establishments:", error);
    res.status(500).json({ message: "Failed to fetch establishments" });
  }
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Find the user by username
    const user = await User.findOne({ username: username });

    // 2. Check if user exists AND password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid username or password" });
    }

    // 3. Success! Send the user data back to React (omitting the password!)
    res.json({ 
      success: true, 
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        idSeries: user.idSeries,
        bio: user.bio,
        followers: user.followers,
        helpfulCount: user.helpfulCount,
        contributions: user.contributions,
        avatar: user.avatar,
        isAdmin: user.isAdmin
      } 
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Server error during login" });
  }
});

// --- START SERVER ---
app.listen(PORT, () => { //
  console.log(`🚀 Server running on http://localhost:${PORT}`); //
});