const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Moved up
require('dotenv').config({ path: path.resolve(__dirname, 'taftics.env') }); //
const User = require('./models/User'); // Adjust the path if needed
const Review = require('./models/Review');

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

// --- REGISTER ROUTE ---
app.post('/api/register', async (req, res) => {
  try {
    // With FormData, text fields are in req.body
    const { username, email, password, dlsuId } = req.body;

    // 1. Check if username or email already exists
    const existingUser = await User.findOne({ 
      $or: [{ username: username }, { email: email }] 
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username or Email already taken." });
    }

    // 2. Handle the Avatar File Upload
    let avatarUrl = "https://ui-avatars.com/api/?name=" + username; // Default avatar

    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar;
      // Create a unique filename so users don't overwrite each other's images
      const fileName = `${Date.now()}_${avatarFile.name}`;
      const uploadPath = path.join(__dirname, 'public', 'uploads', fileName);

      // Move the file to your public/uploads folder
      await avatarFile.mv(uploadPath);
      
      // Set the URL that React will use to display the image
      avatarUrl = `http://localhost:5000/uploads/${fileName}`;
    }

    // 3. Create and save the new user
    const newUser = new User({
      username,
      email,
      password, // Again, hash this in a real production app!
      idSeries: dlsuId,
      avatar: avatarUrl,
      isAdmin: false
    });

    await newUser.save();

    // 4. Send success response and auto-login the user
    res.status(201).json({ 
      success: true, 
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        idSeries: newUser.idSeries,
        avatar: newUser.avatar,
        isAdmin: newUser.isAdmin
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// Create review
app.post('/api/reviews', async (req, res) => {
  try {
    const { userId, establishmentId, rating, title, text } = req.body;

    // 1. Process Images using express-fileupload
    let imageUrls = [];
    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      
      for (const file of files) {
        const fileName = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(__dirname, 'public', 'uploads', fileName);
        await file.mv(uploadPath);
        imageUrls.push(`http://localhost:5000/uploads/${fileName}`);
      }
    }

    // 2. Save to Database
    const newReview = new Review({
      userId,
      establishmentId,
      rating: Number(rating),
      title,
      text,
      images: imageUrls,
      date: new Date()
    });

    await newReview.save();

    // 3. Update Establishment star counts automatically
    const starFields = ["oneStar", "twoStar", "threeStar", "fourStar", "fiveStar"];
    const fieldToUpdate = starFields[Number(rating) - 1];

    await Establishment.findByIdAndUpdate(establishmentId, {
      $inc: { [fieldToUpdate]: 1, totalReviews: 1 }
    });

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, message: "Failed to save review." });
  }
});

// 1. GET SINGLE ESTABLISHMENT
app.get('/api/establishments/:id', async (req, res) => {
  try {
    // Find establishment by its unique MongoDB _id
    const establishment = await Establishment.findById(req.params.id);
    
    if (!establishment) {
      return res.status(404).json({ message: "Establishment not found" });
    }
    
    res.json(establishment);
  } catch (error) {
    console.error("Error fetching establishment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 2. GET REVIEWS FOR A SPECIFIC ESTABLISHMENT
app.get('/api/establishments/:id/reviews', async (req, res) => {
  try {
    // Find all reviews where establishmentId matches the URL parameter
    const reviews = await Review.find({ establishmentId: req.params.id })
      // .populate() pulls the user details from the User collection!
      .populate('userId', 'username name avatar') 
      .sort({ date: -1 }); // Sort by newest first

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- GET ALL USERS ---
// Used by App.jsx to load users for the Browse/Public Profile features
app.get('/api/users', async (req, res) => {
  try {
    // .find({}) tells MongoDB to get every single user document.
    // .select('-password') is CRITICAL: it strips the password field out 
    // before sending the data to the frontend so your users stay secure!
    const users = await User.find({}).select('-password'); 
    
    res.json(users);

  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error while fetching users." });
  }
});

// --- GET SPECIFIC USER PROFILE ---
app.get('/api/users/:username', async (req, res) => {
  try {
    // Grab the username from the URL (e.g., "leelanczers" from /api/users/leelanczers)
    const targetUsername = req.params.username;

    // Search the database for that exact username, excluding the password field
    const user = await User.findOne({ username: targetUsername }).select('-password');

    // If no user is found, send back a 404 error
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If found, send the user data back to React!
    res.json({ success: true, user: user });

  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error while fetching profile." });
  }
});

// --- GET SPECIFIC REVIEW (Updated for Comments) ---
app.get('/api/reviews/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('userId', 'username name avatar')
      .populate('establishmentId', 'name location')
      // THIS IS NEW: It grabs the user info for every comment!
      .populate('comments.userId', 'username name avatar'); 

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/api/users/:id/avatar', async (req, res) => {
  try {
    // 1. Check if a file was actually uploaded
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const avatarFile = req.files.avatar;
    const fileName = `${Date.now()}_${avatarFile.name}`;
    const uploadPath = path.join(__dirname, 'public', 'uploads', fileName);

    // 2. Move the file to your public/uploads folder
    await avatarFile.mv(uploadPath);
    
    // 3. Generate the new URL
    const avatarUrl = `http://localhost:5000/uploads/${fileName}`;

    // 4. Find the user and update their avatar in the database
    // { new: true } tells Mongoose to return the UPDATED user document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id, 
      { avatar: avatarUrl },
      { new: true }
    ).select('-password'); // Hide password!

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 5. Send the updated user back to React
    res.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Avatar upload error:", error);
    res.status(500).json({ success: false, message: "Server error during upload" });
  }
});

// --- START SERVER ---
app.listen(PORT, () => { //
  console.log(`🚀 Server running on http://localhost:${PORT}`); //
});