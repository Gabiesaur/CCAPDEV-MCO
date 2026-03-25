const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'taftics.env') }); 

// 1. Import your Mongoose Models
// (Ensure these paths match your actual project structure)
const User = require('./models/User');
const Review = require('./models/Review');
const Establishment = require('./models/Establishment');
const Comment = require('./models/Comment');

// 2. Helper function to flatten MongoDB Compass exports
// Compass exports ObjectIds as {"$oid": "65f..."}, which Mongoose doesn't like directly.
// This recursively finds "$oid" keys and flattens them to plain strings.
function convertOids(obj) {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(convertOids);
  if (typeof obj === 'object') {
    if (obj.$oid) return obj.$oid;
    const newObj = {};
    for (const key in obj) {
      newObj[key] = convertOids(obj[key]);
    }
    return newObj;
  }
  return obj;
}

const seedDatabase = async () => {
  try {
    // 3. Connect to Database
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) throw new Error("Missing MONGO_URI in environment variables.");
    
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");

    // 4. Read the JSON files
    console.log("📂 Reading JSON files...");
    
    // '..' means "go up one folder", then go into 'database'
    const dataFolder = path.join(__dirname, '..', 'imports'); 

    const establishmentsData = JSON.parse(fs.readFileSync(path.join(dataFolder, 'establishments.json'), 'utf-8'));
    const usersData = JSON.parse(fs.readFileSync(path.join(dataFolder, 'users.json'), 'utf-8'));
    const reviewsData = JSON.parse(fs.readFileSync(path.join(dataFolder, 'reviews.json'), 'utf-8'));
    const commentsData = JSON.parse(fs.readFileSync(path.join(dataFolder, 'comments.json'), 'utf-8'));

    // 5. Format the data (Flatten $oids)
    const establishments = convertOids(establishmentsData);
    const users = convertOids(usersData);
    const reviews = convertOids(reviewsData);
    const comments = convertOids(commentsData);

    // 6. Hash the User Passwords
    console.log("🔐 Hashing user passwords...");
    for (let user of users) {
      if (user.password) {
        // Hash with a salt count of 10
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }

    // 7. Clear existing database collections to prevent duplicates (Optional but recommended)
    console.log("🧹 Clearing existing database data...");
    await Establishment.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});
    await Comment.deleteMany({});

    // 8. Insert the new data
    console.log("🌱 Inserting new data...");
    await Establishment.insertMany(establishments);
    console.log("  ➔ Establishments seeded");
    
    await User.insertMany(users);
    console.log("  ➔ Users seeded");
    
    await Review.insertMany(reviews);
    console.log("  ➔ Reviews seeded");
    
    await Comment.insertMany(comments);
    console.log("  ➔ Comments seeded");

    console.log("🎉 Database seeding complete!");
    process.exit(0); // Exit successfully

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1); // Exit with error
  }
};

// Run the function
seedDatabase();