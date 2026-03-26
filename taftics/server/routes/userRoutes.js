const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/', userController.getAllUsers);
router.get('/:username', userController.getUserProfile);
router.put('/:id/bookmark', userController.toggleBookmark);
router.get('/:id/bookmarks', userController.getBookmarks);
router.get('/:id/reviews', userController.getOwnedReviews);
router.get('/:id/helpful-reviews', userController.getHelpfulReviews);
router.get('/:id/unhelpful-reviews', userController.getUnhelpfulReviews);
router.put('/:id/avatar', userController.updateUserAvatar);
router.put('/:id/bio', userController.updateUserBio);
router.get('/:id/comments', userController.getOwnedComments);

module.exports = router;