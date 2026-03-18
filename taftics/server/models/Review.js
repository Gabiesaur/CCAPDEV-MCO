const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    establishmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Establishment' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    title: String,
    comment: String,
    date: { type: Date, default: Date.now },
    helpfulVotes: { type: Number, default: 0 },
    unhelpfulVotes: { type: Number, default: 0 }
})

const Review = mongoose.model('Review', ReviewSchema)
module.exports = Review