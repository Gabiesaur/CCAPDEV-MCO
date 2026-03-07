const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: path.resolve(__dirname, 'taftics.env') });

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to accept JSON data

// Ensure required config is set
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ Missing MONGO_URI environment variable. Please set it in taftics.env.");
  process.exit(1);
}

// Connect to MongoDB
mongoose.connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB via Compass"))
  .catch(err => console.error("❌ Connection error:", err));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('API is running...');
});



/* For file uplods */
const fileUpload = require('express-fileupload')

app.use(express.json()) // use json
app.use(express.urlencoded( {extended: true})); // files consist of more than strings
app.use(express.static('public')) // we'll add a static directory named "public"
app.use(fileUpload()) // for fileuploads

/* We'll use handlebars for this one */
var hbs = require('hbs')
app.set('view engine','hbs');

