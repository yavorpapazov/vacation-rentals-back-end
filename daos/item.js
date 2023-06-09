const Item = require('../models/item')
const mongoose = require('mongoose')

module.exports = {}

async function getSearch(query) { 
    if (query) {
      return await Item.find({ 
        $text: { $search: query } },
        { score: { $meta: 'textScore'}}
      ).sort({ score: { $meta: 'textScore'}}).lean()
    }
    return await Item.find().lean()
}

async function getAll() {
    const allBnbs = await Item.find().lean()
    return allBnbs
}

async function getById(itemId) {
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        return null
    }
    const bnb = await Item.findOne({ _id: itemId }).lean()
    return bnb
}

async function getByIdProject(itemId) {
    const bnb = (await Item.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(itemId) } },
        { $project: { _id: 0, bnbId: "$_id", bnbCity: 1, bnbCost: 1, bnbCountry: 1, bnbImage: 1, bnbTitle: 1, stars: 1, userId: 1 } }
    ]))[0]
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

module.exports = { getAll, getById, getSearch, getByIdProject, createItem, deleteItem }