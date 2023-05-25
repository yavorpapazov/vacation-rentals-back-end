const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    bnbCity: { type: String, required: true }, 
    bnbCost: { type: Number, required: true},
    bnbCountry: { type: String, required: true },
    bnbImage: { type: String, required: true },
    bnbTitle: { type: String, required: true },
    stars: { type: Number, required: true}
})

module.exports = mongoose.model('items', itemSchema)