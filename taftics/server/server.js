const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config({ path: path.resolve(__dirname, 'taftics.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(fileUpload({ parseNested: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// --- DATABASE CONNECTION ---
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ Missing MONGO_URI environment variable.");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ Connection error:", err));

// --- ROUTES ---
app.get('/', (req, res) => res.send('API is running...'));

// Mount modular routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/establishments', require('./routes/establishmentRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});