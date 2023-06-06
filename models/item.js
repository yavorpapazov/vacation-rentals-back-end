const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    bnbCity: { type: String, required: true }, 
    bnbCost: { type: Number, required: true},
    bnbCountry: { type: String, required: true },
    //bnbImage: { type: String, required: true },
    bnbTitle: { type: String, required: true },
    stars: { type: Number, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, required: true }
})

itemSchema.index({ bnbCity: 'text', bnbCountry: 'text', bnbTitle: 'text' })

module.exports = mongoose.model('items', itemSchema)