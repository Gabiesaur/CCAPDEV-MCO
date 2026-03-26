const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/', reviewController.createReview);
router.put('/:id', reviewController.updateReview);
router.put('/:id/vote', reviewController.toggleReviewVote);
router.delete('/:id', reviewController.deleteReview);
router.get('/:id', reviewController.getReviewById);
router.get('/:id/comments', reviewController.getCommentsFromReview);
router.post('/:id/comments', reviewController.createReviewComment);
router.get('/:reviewId/comments/:commentId', reviewController.getOneCommentFromReview);

module.exports = router;