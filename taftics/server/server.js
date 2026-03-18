const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Moved up
require('dotenv').config({ path: path.resolve(__dirname, 'taftics.env') }); //

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

// 2. TEMPORARY SEED ROUTE (To populate your empty DB)
app.post('/api/seed-establishments', async (req, res) => {
  try {
    // You can paste your mock array directly in here to test
    const mockEstablishments = [
      {
          name: "National Book Store",
          category: "School Supplies",
          location: "Inside Yuchengco Hall",
          rating: 4.7,
          reviewCount: 14,
          image: "https://images.summitmedia-digital.com/spotph/images/2020/08/24/nbs-statement-closure-640-1598256966.jpg",
          description: "Your go-to place for all school requirements...",
          businessHours: "8:00 AM - 6:00 PM",
          contactNumber: "02-8888-1234",
          email: "support@nationalbookstore.com",
          website: "https://www.nationalbookstore.com",
          address: "Yuchengco Hall, De La Salle University"
      },
      // ... Add Ate Rica's, ZUS Coffee, etc. here
    ];

    // Wipe the existing ones so we don't get duplicates if you click twice
    await Establishment.deleteMany({}); 
    // Insert the mock data
    const created = await Establishment.insertMany(mockEstablishments); 
    
    res.json({ message: "Database seeded successfully!", count: created.length });
  } catch (error) {
    console.error("Error seeding database:", error);
    res.status(500).json({ message: "Failed to seed database" });
  }
});

// --- START SERVER ---
app.listen(PORT, () => { //
  console.log(`🚀 Server running on http://localhost:${PORT}`); //
});