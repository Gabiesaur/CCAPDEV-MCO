const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { upload } = require("../config/cloudinary");

router.post("/", upload.array("images", 6), reviewController.createReview);
router.put("/:id", upload.array("images", 6), reviewController.updateReview);
router.put("/:id/vote", reviewController.toggleReviewVote);
router.delete("/:id", reviewController.deleteReview);
router.get("/:id", reviewController.getReviewById);
router.get("/:id/comments", reviewController.getCommentsFromReview);
router.post("/:id/comments", reviewController.createReviewComment);
router.get(
  "/:reviewId/comments/:commentId",
  reviewController.getOneCommentFromReview,
);

module.exports = router;
