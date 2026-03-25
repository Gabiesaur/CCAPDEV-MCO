const mongoose = require('mongoose')

const EstablishmentSchema = new mongoose.Schema({
    name: String,
    category: String,
    location: String,
    image: String,
    description: String,
    businessHours: String,
    contactNumber: String,
    contactPerson: String,
    email: String,
    website: String,
    address: String,
    isOfficial: { type: Boolean, default: false }
})

const Establishment = mongoose.model('Establishment', EstablishmentSchema)
module.exports = Establishment