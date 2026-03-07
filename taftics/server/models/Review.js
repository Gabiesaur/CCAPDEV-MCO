const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    author: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    establishment: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Establishment', 
        required: true 
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    helpfulVotes: { type: Number, default: 0 },
    undefinedVotes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', ReviewSchema);