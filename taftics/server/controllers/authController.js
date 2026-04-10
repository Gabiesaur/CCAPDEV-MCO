const bcrypt = require("bcrypt");
const User = require("../models/User");
const Establishment = require("../models/Establishment");

exports.login = async (req, res) => {
  const loginIdentifier = req.body.username || req.body.email;
  const password = req.body.password;
  const rememberMe = req.body.rememberMe; // Capture the rememberMe flag

  if (!loginIdentifier || !password) {
    return res.status(400).json({ success: false, message: "Please provide credentials" });
  }

  try {
    const users = await User.aggregate([
      { $match: { $or: [{ username: loginIdentifier }, { email: loginIdentifier }] } },
      { $lookup: { from: "reviews", localField: "_id", foreignField: "userId", as: "userReviews" } },
      { $addFields: { contributions: { $size: "$userReviews" }, helpfulCount: { $reduce: { input: "$userReviews", initialValue: 0, in: { $add: ["$$value", { $size: { $ifNull: ["$$this.helpfulVoters", []] } }] } } } } }
    ]);

    const user = users[0];
    if (!user) return res.status(401).json({ success: false, message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ success: false, message: "Invalid credentials" });

    // 1. Construct the user object to save in the session
    const sessionUser = {
      _id: user._id, username: user.username, name: user.name, email: user.email,
      idSeries: user.idSeries, bio: user.bio, avatar: user.avatar, 
      isAdmin: user.isAdmin, helpfulCount: user.helpfulCount, contributions: user.contributions
    };

    // 2. Save to session
    req.session.user = sessionUser;

    // 3. Handle "Remember Me"
    if (rememberMe) {
      // Set cookie to expire in 21 days
      req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000; 
    } else {
      // Session cookie (expires when browser closes)
      req.session.cookie.expires = false; 
    }
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ success: false, message: "Server error during login" });
      }
      res.json({ success: true, user: sessionUser });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// NEW: Endpoint for React to check if a user is already logged in on refresh
exports.checkSession = (req, res) => {
  if (req.session && req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.json({ success: false, user: null });
  }
};

// NEW: Endpoint to destroy the session
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: "Could not log out." });
    res.clearCookie('connect.sid'); // Clear the cookie from the browser
    res.json({ success: true, message: "Logged out successfully" });
  });
};

var count_salt = 10;

exports.register = async (req, res) => {
  try {
    // With FormData, text fields are in req.body
    const { username, name, email, password, dlsuId } = req.body;

    // 1. Check if username or email already exists
    const existingUser = await User.findOne({
      $or: [{ username: username }, { email: email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username or Email already taken." });
    }

    let avatarUrl = "https://ui-avatars.com/api/?name=" + username;

    const salt_rounds = count_salt;
    // 3. Create and save the new user
    const newUser = new User({
      username,
      name,
      email,
      password: await bcrypt.hash(password, salt_rounds),
      idSeries: dlsuId,
      avatar: avatarUrl,
      isAdmin: false,
    });

    await newUser.save();

    const sessionUser = {
      _id: newUser._id, username: newUser.username, email: newUser.email,
      name: newUser.name, idSeries: newUser.idSeries, avatar: newUser.avatar,
      ownedEstablishmentId: newUser.ownedEstablishmentId, isAdmin: newUser.isAdmin,
      helpfulCount: 0, contributions: 0
    };

    // 2. Save to session to auto-login the user
    req.session.user = sessionUser;

    // 3. Set as a standard session (expires when the browser closes)
    // This perfectly simulates a login without the "Remember Me" box checked
    req.session.cookie.expires = false; 
    
    res.status(201).json({
      success: true,
      user: sessionUser
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
};

exports.apply = async (req, res) => {
  console.log("POST /api/apply hit");
  try {
    // With FormData, text fields are in req.body
    console.log("req.body:", req.body);
    const { establishmentName, address, establishmentType, email, contactInfo, contactName } = req.body;

    // 1. Check if a user with the entered email already exists
    const existingUser = await User.findOne({
      email: email
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already taken by an existing user." });
    }

    // 3. Create and save the new establishment with defaults
    const newEstablishment = new Establishment({
      name: establishmentName,
      address,
      category: establishmentType,
      email,
      contactNumber: contactInfo,
      contactPerson: contactName,
      image: "", // Triggers branded fallback in frontend
      businessHours: "7:00 AM - 7:00 PM",
      location: "Taft Ave (Near DLSU)",
      description: "A newly applied establishment on Taftics.",
      isOfficial: false
    });

    await newEstablishment.save();
    res.status(201).json({ success: true, message: "Application submitted successfully!" });

  } catch (error) {
    console.error("Application error:", error);
    res.status(500).json({ success: false, message: "Server error during application." });
  }
};