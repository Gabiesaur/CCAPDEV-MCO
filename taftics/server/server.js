const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload'); // Moved up
require('dotenv').config({ path: path.resolve(__dirname, 'taftics.env') }); //
const Establishment = require('./models/Establishment');
const User = require('./models/User'); // Adjust the path if needed
const Review = require('./models/Review');
const Comment = require('./models/Comment');

const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000; //

// --- MIDDLEWARE ---
app.use(cors()); //
app.use(express.json()); // Allows the server to accept JSON data
app.use(express.urlencoded({ extended: true })); //
app.use(express.static('public')); //
app.use(fileUpload({ parseNested: true })); //
// Expose the 'public/uploads' directory to the web under the '/uploads' URL path
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

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

// --- API ROUTES ---

// 1. GET ALL ESTABLISHMENTS
app.get('/api/establishments', async (req, res) => {
  try {
    const establishments = await Establishment.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'establishmentId',
          as: 'reviews'
        }
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
          rating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $round: [{ $avg: "$reviews.rating" }, 1] },
              else: 0
            }
          }
        }
      },
      {
        $project: {
          reviews: 0
        }
      }
    ]);
    res.json(establishments);
  } catch (error) {
    console.error("Error fetching establishments:", error);
    res.status(500).json({ message: "Failed to fetch establishments" });
  }
});

// --- LOGIN ROUTE ---
app.post('/api/login', async (req, res) => {
  // Grab the input, whether the frontend sent it as 'username' or 'email'
  const loginIdentifier = req.body.username || req.body.email;
  const password = req.body.password;

  if (!loginIdentifier || !password) {
    return res.status(400).json({ success: false, message: "Please provide credentials" });
  }

  try {
    const users = await User.aggregate([
      { $match: { username: username } },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'userId',
          as: 'userReviews'
        }
      },
      {
        $addFields: {
          contributions: { $size: "$userReviews" },
          helpfulCount: {
            $reduce: {
              input: "$userReviews",
              initialValue: 0,
              in: { $add: ["$$value", { $size: { $ifNull: ["$$this.helpfulVoters", []] } }] }
            }
          }
        }
      }
    ]);

    const user = users[0];

    // 2. Check if user exists AND password matches
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: "Invalid username/email or password" });
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
        helpfulCount: user.helpfulCount,
        contributions: user.contributions,
        avatar: user.avatar,
        ownedEstablishmentId: user.ownedEstablishmentId,
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
        name: newUser.name,
        idSeries: newUser.idSeries,
        avatar: newUser.avatar,
        ownedEstablishmentId: newUser.ownedEstablishmentId,
        isAdmin: newUser.isAdmin,
        helpfulCount: 0,
        contributions: 0
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Server error during registration." });
  }
});

// Create review
app.post('/api/reviews', async (req, res) => {
  console.log("req.body:", req.body);   // Should show userId, rating, title, text
  console.log("req.files:", req.files); // Should show uploaded files if any
  try {
    const { userId, establishmentId, rating, title, body } = req.body;

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
      body,
      images: imageUrls,
      date: new Date()
    });

    await newReview.save();

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, message: "Failed to save review." });
  }
});

// --- UPDATE REVIEW ---
app.put('/api/reviews/:id', async (req, res) => {
  try {
    const { rating, title, body, comment, existingImages } = req.body;
    const reviewText = body || comment; // support both from frontend

    // 1. Find existing review
    const existingReview = await Review.findById(req.params.id);
    if (!existingReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }
    const newRating = Number(rating);

    // 3. Process Images
    let imageUrls = [];
    if (existingImages) {
      imageUrls = Array.isArray(existingImages) ? existingImages : [existingImages];
    }

    if (req.files && req.files.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];
      for (const file of files) {
        const fileName = `${Date.now()}_${file.name}`;
        const uploadPath = path.join(__dirname, 'public', 'uploads', fileName);
        await file.mv(uploadPath);
        imageUrls.push(`http://localhost:5000/uploads/${fileName}`);
      }
    }
    existingReview.images = imageUrls;

    // 4. Update the review
    existingReview.rating = newRating;
    if (title !== undefined) existingReview.title = title;
    if (reviewText !== undefined) existingReview.body = reviewText;
    existingReview.isEdited = true;

    await existingReview.save();

    // Populate user to return fully formed review for frontend state
    await existingReview.populate('userId', 'username name avatar');

    res.json({ success: true, review: existingReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ success: false, message: "Failed to update review" });
  }
});

// --- TOGGLE REVIEW VOTE ---
app.put('/api/reviews/:id/vote', async (req, res) => {
  try {
    const { userId, type } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized. Please login to vote." });

    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    // initialize arrays if undefined
    if (!review.helpfulVoters) review.helpfulVoters = [];
    if (!review.unhelpfulVoters) review.unhelpfulVoters = [];

    const hasVotedHelpful = review.helpfulVoters.map(id => id.toString()).includes(userId.toString());
    const hasVotedUnhelpful = review.unhelpfulVoters.map(id => id.toString()).includes(userId.toString());

    if (type === 'helpful') {
      if (hasVotedHelpful) {
        review.helpfulVoters.pull(userId);
      } else {
        review.helpfulVoters.push(userId);
        if (hasVotedUnhelpful) review.unhelpfulVoters.pull(userId);
      }
    } else if (type === 'unhelpful') {
      if (hasVotedUnhelpful) {
        review.unhelpfulVoters.pull(userId);
      } else {
        review.unhelpfulVoters.push(userId);
        if (hasVotedHelpful) review.helpfulVoters.pull(userId);
      }
    }

    await review.save();
    await review.populate('userId', 'username name avatar');
    res.json({ success: true, review });
  } catch (error) {
    console.error("Error submitting vote:", error);
    res.status(500).json({ success: false, message: "Failed to submit vote." });
  }
});

// --- DELETE REVIEW ---
app.delete('/api/reviews/:id', async (req, res) => {
  try {
    const existingReview = await Review.findById(req.params.id);
    if (!existingReview) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ success: false, message: "Failed to delete review" });
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
// --- UPDATE SPECIFIC ESTABLISHMENT ---
app.put('/api/establishments/:id', async (req, res) => {
  try {
    const { name, category, startTime, endTime } = req.body;

    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      const [hourStr, minStr] = timeStr.split(':');
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12;
      hour = hour ? hour : 12;
      return `${hour}:${minStr} ${ampm}`;
    };

    const formattedHours = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    const establishment = await Establishment.findByIdAndUpdate(
      req.params.id,
      { name, category, businessHours: formattedHours },
      { new: true }
    );

    if (!establishment) {
      return res.status(404).json({ success: false, message: "Establishment not found" });
    }

    res.json({ success: true, establishment });
  } catch (error) {
    console.error("Error updating establishment:", error);
    res.status(500).json({ success: false, message: "Failed to update establishment details" });
  }
});

// --- GET ALL USERS ---
// Used by App.jsx to load users for the Browse/Public Profile features
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'userId',
          as: 'userReviews'
        }
      },
      {
        $addFields: {
          contributions: { $size: "$userReviews" },
          helpfulCount: {
            $reduce: {
              input: "$userReviews",
              initialValue: 0,
              in: { $add: ["$$value", { $size: { $ifNull: ["$$this.helpfulVoters", []] } }] }
            }
          }
        }
      },
      {
        $project: { password: 0, userReviews: 0 }
      }
    ]);

    res.json(users);

  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Server error while fetching users." });
  }
});

// --- GET SPECIFIC USER PROFILE ---
app.get('/api/users/:username', async (req, res) => {
  try {
    const targetUsername = req.params.username;

    const users = await User.aggregate([
      { $match: { username: targetUsername } },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'userId',
          as: 'userReviews'
        }
      },
      {
        $addFields: {
          contributions: { $size: "$userReviews" },
          helpfulCount: {
            $reduce: {
              input: "$userReviews",
              initialValue: 0,
              in: { $add: ["$$value", { $size: { $ifNull: ["$$this.helpfulVoters", []] } }] }
            }
          }
        }
      },
      {
        $project: { password: 0, userReviews: 0 }
      }
    ]);

    const user = users[0];

    // If no user is found, send back a 404 error
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // If found, send the user data back to React!
    res.json({ success: true, user: user });

  } catch (error) {
    console.error("Error fetching specific user:", error);
    res.status(500).json({ message: "Server error while fetching user." });
  }
});

// --- TOGGLE BOOKMARK ROUTE ---
app.put('/api/users/:id/bookmark', async (req, res) => {
  try {
    const { establishmentId } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Check if establishment is already saved
    const isSaved = user.savedEstablishments && user.savedEstablishments.includes(establishmentId);

    if (isSaved) {
      // Remove it
      user.savedEstablishments = user.savedEstablishments.filter(id => id.toString() !== establishmentId);
    } else {
      // Add it
      if (!user.savedEstablishments) user.savedEstablishments = [];
      user.savedEstablishments.push(establishmentId);
    }

    await user.save();
    res.json({ success: true, isBookmarked: !isSaved, savedEstablishments: user.savedEstablishments });
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- GET BOOKMARKS ROUTE ---
app.get('/api/users/:id/bookmarks', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    if (!user.savedEstablishments || user.savedEstablishments.length === 0) {
      return res.json([]);
    }

    const establishments = await Establishment.aggregate([
      { $match: { _id: { $in: user.savedEstablishments } } },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'establishmentId',
          as: 'reviews'
        }
      }
    ]);

    res.json(establishments);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- GET OWNED REVIEWS ROUTE ---
app.get('/api/users/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.id })
      .populate('userId', 'username name avatar')
      .populate('establishmentId', 'name image location')
      .sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- GET HELPFUL REVIEWS ROUTE ---
app.get('/api/users/:id/helpful-reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ helpfulVoters: req.params.id })
      .populate('userId', 'username name avatar')
      .populate('establishmentId', 'name image location')
      .sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching helpful reviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// --- GET UNHELPFUL REVIEWS ROUTE ---
app.get('/api/users/:id/unhelpful-reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ unhelpfulVoters: req.params.id })
      .populate('userId', 'username name avatar')
      .populate('establishmentId', 'name image location')
      .sort({ date: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching unhelpful reviews:", error);
    res.status(500).json({ success: false, message: "Server error" });
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
      { returnDocument: 'after' } // <-- Replaced { new: true }
    ).select('-password');

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

// --- UPDATE USER BIO ---
app.put('/api/users/:id/bio', async (req, res) => {
  try {
    const { bio } = req.body; // Extract the new bio from the request

    // Find the user by ID and update the bio field
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { bio: bio },
      { returnDocument: 'after' } // <-- Replaced { new: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("Bio update error:", error);
    res.status(500).json({ success: false, message: "Server error updating bio" });
  }
});

// ==========================================
//              COMMENT ROUTES
// ==========================================

// 1. GET ALL COMMENTS FOR A SPECIFIC REVIEW
app.get('/api/reviews/:id/comments', async (req, res) => {
  try {
    // Find all comments where the reviewId matches the URL parameter
    // We populate the userId so the frontend gets the commenter's name & avatar
    const comments = await Comment.find({ reviewId: req.params.id })
      .populate('userId', 'username name avatar')
      .sort({ date: -1 }); // Sort by newest comments first

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments for review:", error);
    res.status(500).json({ message: "Server error while fetching comments" });
  }
});

// 2. GET A SPECIFIC COMMENT FROM A SPECIFIC REVIEW
app.get('/api/reviews/:reviewId/comments/:commentId', async (req, res) => {
  try {
    // Find a single comment ensuring both the comment ID and review ID match
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      reviewId: req.params.reviewId
    }).populate('userId', 'username name avatar');

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (error) {
    console.error("Error fetching specific comment:", error);
    res.status(500).json({ message: "Server error while fetching specific comment" });
  }
});

// --- START SERVER ---
app.listen(PORT, () => { //
  console.log(`🚀 Server running on http://localhost:${PORT}`); //
});