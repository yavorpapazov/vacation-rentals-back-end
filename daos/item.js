const Item = require('../models/item')

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

async function updateItem(itemId, item) {
    const bnb = await Item.findOneAndUpdate({ _id: itemId }, item, { new: true })
    return bnb
}

async function deleteItem(itemId) {
    const bnb = await Item.findOneAndDelete({ _id: itemId })
    return bnb
}

module.exports = { getAll, getById, createItem, updateItem, deleteItem }