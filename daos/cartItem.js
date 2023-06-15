const CartItem = require('../models/cartItem')
const mongoose = require('mongoose')

module.exports = {}

async function getAll(userId) {
    const allBnbs = await CartItem.find({ addedToCart: userId }).lean()
    return allBnbs
}

async function getById(itemId) {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return null
    }
    const bnb = await CartItem.findOne({ _id: itemId }).lean()
    return bnb
}

async function getByBnbId(bnbId) {
    const bnb = await CartItem.findOne({ bnbId }).lean()
    return bnb
}

async function createItem(newItem) {
    const bnb = await CartItem.create(newItem)
    return bnb
}

async function deleteItem(itemId) {
    const bnb = await CartItem.findOneAndDelete({ _id: itemId })
    return bnb
}

module.exports = { getAll, getById, getByBnbId, createItem, deleteItem }