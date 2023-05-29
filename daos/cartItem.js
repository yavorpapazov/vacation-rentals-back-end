const CartItem = require('../models/cartItem')

async function getAll() {
    const allBnbs = await CartItem.find().lean()
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