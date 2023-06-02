const express = require('express')
const router = express.Router()
const cartItemDAO = require('../daos/cartItem')
const userDAO = require('../daos/user')
const itemDAO = require('../daos/item')

router.use(async function (req, res, next) {
    if (!req.headers.authorization) {
        res.sendStatus(401)
    } else {
        const tokenString = req.headers.authorization.slice(7)
        const userId = await userDAO.getUserIdFromToken(tokenString)
        if (userId) {
            req.userId = userId
            next()
        } else {
            res.sendStatus(401)
        }
    }
})

router.get('/', async (req, res) => {
    const result = await cartItemDAO.getAll(req.userId)
    res.json(result)
})

router.post('/', async (req, res) => {
    try {
        const itemId = req.body.itemId
        const item = await itemDAO.getByIdProject(itemId)
        const cartItem = {...item, addedToCart: req.userId}
        const result = await cartItemDAO.createItem(cartItem)
        if (result) {
            res.sendStatus(200)
        } else {
            res.sendStatus(401)
        }
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.delete('/:id', async (req, res) => {
    const result = await cartItemDAO.deleteItem(req.params.id)
    res.json(result)
})

module.exports = router