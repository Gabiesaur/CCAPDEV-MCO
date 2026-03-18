const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    establishmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Establishment' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    title: String,
    body: String,
    images: [String],
    comments: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        text: String,
        date: { type: Date, default: Date.now }
    }],
    date: { type: Date, default: Date.now },
    helpfulVotes: { type: Number, default: 0 },
    unhelpfulVotes: { type: Number, default: 0 }
})

const Review = mongoose.model('Review', ReviewSchema)
module.exports = Review