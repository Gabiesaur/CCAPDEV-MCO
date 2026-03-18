const mongoose = require('mongoose')

const EstablishmentSchema = new mongoose.Schema({
    estNum: String,
    name: String,
    category: String,
    location: String,
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    image: String,
    description: String,
    businessHours: String,
    contactNumber: String,
    email: String,
    website: String,
    address: String
})

const Establishment = mongoose.model('Establishment', EstablishmentSchema)
module.exports = Establishment