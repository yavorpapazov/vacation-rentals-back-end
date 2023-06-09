const express = require('express')
const router = express.Router()
const cartItemDAO = require('../daos/cartItem')
const userDAO = require('../daos/user')
const itemDAO = require('../daos/item')

router.use(async function (req, res, next) {
    if (!req.headers.authorization) {
        res.sendStatus(401)
    } else {
        const tokenString = req.headers.authorization
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
    try {
        const result = await cartItemDAO.getAll(req.userId)
        res.json(result)
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.post('/', async (req, res) => {
    const itemId = req.body.itemId
    const duplicateItem = await cartItemDAO.getDuplicateItem(itemId, req.userId)
    if (duplicateItem) {
        res.status(409).send({ message: 'Item is already in your cart' })
    } else {
        try {
            const item = await itemDAO.getByIdProject(itemId)
            const cartItem = {...item, addedToCart: req.userId}
            const result = await cartItemDAO.createItem(cartItem)
            if (result) {
                res.json({ resultCart: result, message: 'Item added to cart' })
            } else {
                res.sendStatus(401)
            }
        } catch(e) {
            res.status(500).send(e.message)
        }
    }
    
})

router.delete('/:id', async (req, res) => {
    const item = await cartItemDAO.getById(req.params.id)
    if (!item) {
        res.sendStatus(400)
    } else {
        try {
            const result = await cartItemDAO.deleteItem(req.params.id)
            res.json(result)
        } catch(e) {
            res.status(500).send(e.message)
        }
    }
})

module.exports = router