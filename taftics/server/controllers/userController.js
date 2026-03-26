const path = require('path');
const User = require('../models/User');
const Review = require('../models/Review');
const Comment = require('../models/Comment');
const Establishment = require('../models/Establishment');

exports.getAllUsers = async (req, res) => {
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
}

exports.getUserProfile = async (req, res) => {
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
}

exports.toggleBookmark = async (req, res) => {
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
}

exports.getBookmarks = async (req, res) => {
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
}

exports.getOwnedReviews = async (req, res) => {
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
}

exports.getHelpfulReviews = async (req, res) => {
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
}

exports.getUnhelpfulReviews = async (req, res) => {
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
}

exports.updateUserAvatar = async (req, res) => {
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
        const avatarUrl = `http://localhost:3000/uploads/${fileName}`;
    
        // 4. Find the user and update their avatar in the database
        // { new: true } tells Mongoose to return the UPDATED user document
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { avatar: avatarUrl },
          { returnDocument: 'after' }
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
}

exports.updateUserBio = async (req, res) => {
    try {
        const { bio } = req.body; // Extract the new bio from the request
    
        // Find the user by ID and update the bio field
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { bio: bio },
          { returnDocument: 'after' }
        ).select('-password');
    
        if (!updatedUser) {
          return res.status(404).json({ success: false, message: "User not found" });
        }
    
        res.json({ success: true, user: updatedUser });
    
      } catch (error) {
        console.error("Bio update error:", error);
        res.status(500).json({ success: false, message: "Server error updating bio" });
      }
}

exports.getOwnedComments = async (req, res) => {
    try {
        const comments = await Comment.find({ userId: req.params.id })
          .populate({
            path: 'reviewId', // Get the review this comment belongs to
            select: 'title rating userId',
            populate: {
              path: 'userId', // Get the user who wrote the original review
              select: 'username'
            }
          })
          .sort({ date: -1 }); // Newest first
    
        res.json(comments);
      } catch (error) {
        console.error("Error fetching user comments:", error);
        res.status(500).json({ message: "Server error while fetching user comments" });
      }
}