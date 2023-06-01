const CartItem = require('../models/cartItem')

module.exports = {}

async function getAll(userId) {
    const allBnbs = await CartItem.find({ addedToCart: userId }).lean()
    return allBnbs
}

async function createItem(newItem) {
    const bnb = await CartItem.create(newItem)
    return bnb
}

async function deleteItem(itemId) {
    const bnb = await CartItem.findOneAndDelete({ _id: itemId })
    return bnb
}

module.exports = { getAll, createItem, deleteItem }