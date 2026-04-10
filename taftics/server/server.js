const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const cors = require("cors");
require("dotenv").config({ path: path.resolve(__dirname, "taftics.env") });

const app = express();
const PORT = process.env.PORT || 3000;
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

// --- MIDDLEWARE ---
app.use(cors({
  origin: allowedOrigin, // MUST be your exact frontend URL
  credentials: true 
}));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secret_taftics_key',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions' // Sessions will be saved in your DB here
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true if using https
    httpOnly: true, // Prevents XSS attacks from reading the cookie
    maxAge: 1000 * 60 * 60 * 24 // Default 1 day (we will override this for remember me)
  }
}));

// --- DATABASE CONNECTION ---
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ Missing MONGO_URI environment variable.");
  process.exit(1);
}

mongoose
  .connect(mongoUri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ Connection error:", err));

// --- ROUTES ---
app.get("/", (req, res) => res.send("API is running..."));

// Mount modular routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api/establishments", require("./routes/establishmentRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
