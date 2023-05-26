const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    bnbCity: { type: String, required: true }, 
    bnbCost: { type: Number, required: true},
    bnbCountry: { type: String, required: true },
    bnbImage: { type: String, required: true },
    bnbTitle: { type: String, required: true },
    stars: { type: Number, required: true}
})

module.exports = mongoose.model('cartItems', cartItemSchema)