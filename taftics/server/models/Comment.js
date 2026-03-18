const mongoose = require('mongoose')

const CommentSchema = new mongoose.Schema({
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    date: { type: Date, default: Date.now }
})

const Comment = mongoose.model('Comment', CommentSchema)
module.exports = Comment