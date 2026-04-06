const Review = require("../models/Review");
const Comment = require("../models/Comment");
const { cloudinary } = require("../config/cloudinary");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    // Determine storage parameters based on file field name
    if (file.fieldname === "videos") {
      return {
        folder: "taftics/videos",
        allowed_formats: ["mp4", "mov", "avi", "mkv", "webm"],
        resource_type: "video",
      };
    } else {
      return {
        folder: "taftics",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 800, crop: "limit" }],
      };
    }
  },
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit per file
  }
});

const uploadFields = upload.fields([
  { name: "images", maxCount: 6 },
  { name: "videos", maxCount: 3 },
]);

exports.uploadReviewMedia = (req, res, next) => {
  uploadFields(req, res, (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        success: false,
        message: "Upload failed: " + err.message,
      });
    }
    console.log("Files uploaded successfully:", req.files);
    next();
  });
};

exports.createReview = async (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);
  try {
    const { userId, establishmentId, rating, title, body } = req.body;

    // 1. Process images uploaded by multer + Cloudinary middleware
    let imageUrls = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
      imageUrls = req.files.images.map((file) => file.path);
    }

    // 2. Process videos uploaded by multer + Cloudinary middleware
    let videoUrls = [];
    if (req.files && req.files.videos && req.files.videos.length > 0) {
      videoUrls = req.files.videos.map((file) => file.path);
    }

    // 3. Save to Database
    const newReview = new Review({
      userId,
      establishmentId,
      rating: Number(rating),
      title,
      body,
      images: imageUrls,
      videos: videoUrls,
      date: new Date(),
    });

    await newReview.save();

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ success: false, message: "Failed to save review." });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, title, body, comment, existingImages, existingVideos } =
      req.body;
    const reviewText = body || comment;

    // 1. Find existing review
    const existingReview = await Review.findById(req.params.id);
    if (!existingReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }
    const newRating = Number(rating);

    // 2. Process Images
    let imageUrls = [];
    if (existingImages) {
      imageUrls = Array.isArray(existingImages)
        ? existingImages
        : [existingImages];
    }

    if (req.files && req.files.images && req.files.images.length > 0) {
      imageUrls.push(...req.files.images.map((file) => file.path));
    }
    existingReview.images = imageUrls;

    // 3. Process Videos
    let videoUrls = [];
    if (existingVideos) {
      videoUrls = Array.isArray(existingVideos)
        ? existingVideos
        : [existingVideos];
    }

    if (req.files && req.files.videos && req.files.videos.length > 0) {
      videoUrls.push(...req.files.videos.map((file) => file.path));
    }
    existingReview.videos = videoUrls;

    // 4. Update the review
    existingReview.rating = newRating;
    if (title !== undefined) existingReview.title = title;
    if (reviewText !== undefined) existingReview.body = reviewText;
    existingReview.isEdited = true;

    await existingReview.save();

    // Populate user to return fully formed review for frontend state
    await existingReview.populate("userId", "username name avatar");

    res.json({ success: true, review: existingReview });
  } catch (error) {
    console.error("Error updating review:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update review" });
  }
};

exports.toggleReviewVote = async (req, res) => {
  try {
    const { userId, type } = req.body;

    if (!userId)
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login to vote.",
      });

    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review)
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });

    // initialize arrays if undefined
    if (!review.helpfulVoters) review.helpfulVoters = [];
    if (!review.unhelpfulVoters) review.unhelpfulVoters = [];

    const hasVotedHelpful = review.helpfulVoters
      .map((id) => id.toString())
      .includes(userId.toString());
    const hasVotedUnhelpful = review.unhelpfulVoters
      .map((id) => id.toString())
      .includes(userId.toString());

    if (type === "helpful") {
      if (hasVotedHelpful) {
        review.helpfulVoters.pull(userId);
      } else {
        review.helpfulVoters.push(userId);
        if (hasVotedUnhelpful) review.unhelpfulVoters.pull(userId);
      }
    } else if (type === "unhelpful") {
      if (hasVotedUnhelpful) {
        review.unhelpfulVoters.pull(userId);
      } else {
        review.unhelpfulVoters.push(userId);
        if (hasVotedHelpful) review.helpfulVoters.pull(userId);
      }
    }

    await review.save();
    await review.populate("userId", "username name avatar");
    res.json({ success: true, review });
  } catch (error) {
    console.error("Error submitting vote:", error);
    res.status(500).json({ success: false, message: "Failed to submit vote." });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const existingReview = await Review.findById(req.params.id);
    if (!existingReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete review" });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("userId", "username name avatar")
      .populate("establishmentId", "name location")
      .populate("comments.userId", "username name avatar");

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCommentsFromReview = async (req, res) => {
  try {
    // Find all comments where the reviewId matches the URL parameter
    const comments = await Comment.find({ reviewId: req.params.id })
      .populate("userId", "username name avatar ownedEstablishmentId")
      .sort({ date: -1 }); // Sort by newest comments first

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments for review:", error);
    res.status(500).json({ message: "Server error while fetching comments" });
  }
};

exports.getOneCommentFromReview = async (req, res) => {
  try {
    // Find a single comment ensuring both the comment ID and review ID match
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      reviewId: req.params.reviewId,
    }).populate("userId", "username name avatar");

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    res.json(comment);
  } catch (error) {
    console.error("Error fetching specific comment:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching specific comment" });
  }
};

exports.createReviewComment = async (req, res) => {
  try {
    const { userId, text } = req.body;

    // Check if logged in
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "You must be logged in to post a comment.",
      });
    }

    // Create and save the new comment
    const newComment = new Comment({
      reviewId: req.params.id,
      userId,
      text: text.trim(),
      date: new Date(),
    });

    await newComment.save();

    await Review.findByIdAndUpdate(req.params.id, {
      $push: { comments: { userId, text: text.trim(), date: new Date() } },
    });

    const populatedComment = await Comment.findById(newComment._id).populate(
      "userId",
      "username name avatar",
    );

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error." });
  }
};
