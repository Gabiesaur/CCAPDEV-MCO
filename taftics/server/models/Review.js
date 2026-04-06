const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  establishmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Establishment",
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  rating: Number,
  title: String,
  body: String,
  images: [String],
  videos: [String],
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      text: String,
      date: { type: Date, default: Date.now },
    },
  ],
  date: { type: Date, default: Date.now },
  isEdited: { type: Boolean, default: false },
  helpfulVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  unhelpfulVoters: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Review = mongoose.model("Review", ReviewSchema);
module.exports = Review;
