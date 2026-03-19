const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // In production, hash this!
    name: String,
    email: { type: String, required: true, unique: true },
    idSeries: String,
    bio: String,
    avatar: String,
    ownedEstablishmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Establishment' },
    savedEstablishments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Establishment' }],
    isAdmin: { type: Boolean, default: false }
})

const User = mongoose.model('User', UserSchema)
module.exports = User