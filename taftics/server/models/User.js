const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In production, hash this!
    name: String,
    email: { type: String, required: true, unique: true },
    idSeries: String,
    bio: String,
    followers: { type: Number, default: 0 },
    helpfulCount: { type: Number, default: 0 },
    contributions: { type: Number, default: 0 },
    avatar: String,
    isAdmin: { type: Boolean, default: false }
})

const User = mongoose.model('User', UserSchema)
module.exports = User