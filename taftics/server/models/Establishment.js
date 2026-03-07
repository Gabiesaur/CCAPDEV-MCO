const mongoose = require('mongoose');

const EstablishmentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    averageRating: { type: Number, default: 0 },
    images: [String],
    createdAt: { type: Date, default: Date.now },
    businessHours: { open: String, close: String }
});

module.exports = mongoose.model('Establishment', EstablishmentSchema);