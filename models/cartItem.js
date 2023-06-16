const mongoose = require('mongoose')

const cartItemSchema = new mongoose.Schema({
    addedToCart: { type: mongoose.Schema.Types.ObjectId, required: true },
    bnbCity: { type: String, required: true }, 
    bnbCost: { type: Number, required: true},
    bnbCountry: { type: String, required: true },
    bnbId: { type: mongoose.Schema.Types.ObjectId, required: true },
    //bnbImage: { type: String, required: true },
    bnbTitle: { type: String, required: true },
    stars: { type: Number, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }
})

module.exports = mongoose.model('cartItems', cartItemSchema)