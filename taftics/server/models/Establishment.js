const mongoose = require('mongoose')

const EstablishmentSchema = new mongoose.Schema({
    name: String,
    category: String,
    location: String,
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