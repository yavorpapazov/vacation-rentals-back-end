const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    bnbCity: { type: String, required: true }, 
    bnbCost: { type: Number, required: true},
    bnbCountry: { type: String, required: true },
    bnbImage: { data: Buffer, contentType: String },
    bnbTitle: { type: String, required: true }
})

module.exports = mongoose.model('items', itemSchema)