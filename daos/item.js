let Item = require('../models/item')

async function getAll() {
    let allBnbs = await Item.find({})
    return allBnbs
}

async function getById(itemId) {
    let bnb = await Item.find({ _id: itemId }).exec()
    return bnb
}

async function createItem(newItem) {
    let bnb = await Item.create(newItem)
    return bnb
}

async function updateItem(itemId, item) {
    let bnb = await Item.findOneAndUpdate({ _id: itemId }, item, { new: true })
    return bnb
}

async function deleteItem(itemId) {
    let bnb = await Item.findOneAndDelete({ _id: itemId })
    return bnb
}

module.exports = { getAll, getById, createItem, updateItem, deleteItem }