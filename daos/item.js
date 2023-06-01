const Item = require('../models/item')

module.exports = {}

async function getAll() {
    const allBnbs = await Item.find().lean()
    return allBnbs
}

async function getById(itemId) {
    const bnb = await Item.findOne({ _id: itemId }).lean()
    return bnb
}

async function createItem(newItem) {
    const bnb = await Item.create(newItem)
    return bnb
}

async function deleteItem(itemId) {
    const bnb = await Item.findOneAndDelete({ _id: itemId })
    return bnb
}

module.exports = { getAll, getById, createItem, deleteItem }