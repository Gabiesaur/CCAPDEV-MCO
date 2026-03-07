const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    reviewId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Review', 
        required: true 
    },
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);