const Establishment = require("../models/Establishment");
const Review = require("../models/Review");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.getAllEstablishments = async (req, res) => {
  try {
    const establishments = await Establishment.aggregate([
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "establishmentId",
          as: "reviews",
        },
      },
      {
        $addFields: {
          reviewCount: { $size: "$reviews" },
          rating: {
            $cond: {
              if: { $gt: [{ $size: "$reviews" }, 0] },
              then: { $round: [{ $avg: "$reviews.rating" }, 1] },
              else: 0,
            },
          },
        },
      },
      {
        $project: {
          reviews: 0,
        },
      },
    ]);
    res.json(establishments);
  } catch (error) {
    console.error("Error fetching establishments:", error);
    res.status(500).json({ message: "Failed to fetch establishments" });
  }
};

exports.getEstablishmentById = async (req, res) => {
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
};

exports.getEstablishmentOwner = async (req, res) => {
  try {
    const estId = req.params.id;

    // Query using $in to match both ObjectId and string representations.
    // This handles cases where seeded data stored the field as a plain string.
    const queryValues = [estId];
    if (mongoose.Types.ObjectId.isValid(estId)) {
      queryValues.push(new mongoose.Types.ObjectId(estId));
    }

    const owner = await User.findOne({
      ownedEstablishmentId: { $in: queryValues },
    }).select("_id username name avatar");

    console.log(`[owner lookup] estId=${estId}, found=${!!owner}`);

    if (!owner) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No owner found for this establishment",
        });
    }
    res.json({ success: true, owner });
  } catch (error) {
    console.error("Error fetching establishment owner:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getEstablishmentReviews = async (req, res) => {
  try {
    // Find all reviews where establishmentId matches the URL parameter
    const reviews = await Review.find({ establishmentId: req.params.id })
      .populate("userId", "username name avatar")
      .sort({ date: -1 }); // Sort by newest first

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateEstablishment = async (req, res) => {
  try {
    const { name, category, startTime, endTime, location, description } = req.body;

    const formatTime = (timeStr) => {
      if (!timeStr) return "";
      if (timeStr.includes("AM") || timeStr.includes("PM")) return timeStr; // Already formatted
      const [hourStr, minStr] = timeStr.split(":");
      let hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      hour = hour % 12;
      hour = hour ? hour : 12;
      return `${hour}:${minStr} ${ampm}`;
    };

    const formattedHours = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    const establishment = await Establishment.findByIdAndUpdate(
      req.params.id,
      { name, category, businessHours: formattedHours, location, description },
      { new: true },
    );

    if (!establishment) {
      return res
        .status(404)
        .json({ success: false, message: "Establishment not found" });
    }

    res.json({ success: true, establishment });
  } catch (error) {
    console.error("Error updating establishment:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update establishment details",
      });
  }
};

exports.uploadEstablishmentImg = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No image uploaded" });
    }

    const imageUrl = req.file.path;

    const updatedEst = await Establishment.findByIdAndUpdate(
      req.params.id,
      { image: imageUrl },
      { new: true },
    );

    if (!updatedEst) {
      return res
        .status(404)
        .json({ success: false, message: "Establishment not found" });
    }

    res.json({ success: true, establishment: updatedEst });
  } catch (error) {
    console.error("Establishment image upload error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error during upload" });
  }
};

exports.requestDeletion = async (req, res) => {
  try {
    const establishment = await Establishment.findByIdAndUpdate(
      req.params.id,
      { deletionRequested: true },
      { new: true }
    );

    if (!establishment) {
      return res.status(404).json({ success: false, message: "Establishment not found" });
    }

    res.json({ success: true, message: "Deletion request submitted successfully." });
  } catch (error) {
    console.error("Error requesting deletion:", error);
    res.status(500).json({ success: false, message: "Server error during deletion request" });
  }
};
