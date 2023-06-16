const express = require('express')
const router = express.Router()
const itemDAO = require('../daos/item')
const userDAO = require('../daos/user')
const cartItemDAO = require('../daos/cartItem')

router.get("/search", async (req, res) => {
    try {
        const { query } = req.query
        const items = await itemDAO.getSearch(query)
        res.json(items)
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.get('/', async (req, res) => {
    try {
        const result = await itemDAO.getAll()
        res.json(result)
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.get('/:id', async (req, res) => {
    try {
        const result = await itemDAO.getById(req.params.id)
        if (result) {
            res.json(result)
        } else {
            res.sendStatus(404)
        }
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.use(async function (req, res, next) {
    if (!req.headers.authorization) {
        res.sendStatus(401)
    } else {
        const tokenString = req.headers.authorization.slice(7)
        const userId = await userDAO.getUserIdFromToken(tokenString)
        const userData = await userDAO.getUserById(userId)
        if (userId) {
            req.userData = userData
            next()
        } else {
            res.sendStatus(401)
        }
    }
})

router.post('/', async (req, res) => {
    try {
        const userInput = {
            bnbCity: req.body.bnbCity,
            bnbCost: req.body.bnbCost,
            bnbCountry: req.body.bnbCountry,
            //bnbImage: req.body.bnbImage,
            bnbTitle: req.body.bnbTitle,
            stars: req.body.stars,
            userId: req.userData._id
        }
        const result = await itemDAO.createItem(userInput)
        if (result) {
            res.json(result)
        } else {
            res.sendStatus(401)
        }
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.delete('/:id', async (req, res) => {
    const item = await itemDAO.getById(req.params.id)
    if (!item) {
        res.sendStatus(400)
    } else {
        try {
            if (req.userData._id.toString() === item.userId.toString()) {
                const bnb = await cartItemDAO.getByBnbId(req.params.id)
                if (bnb) {
                    res.status(409).send('Please remove item from cart.')
                } else {
                    const result = await itemDAO.deleteItem(req.params.id)
                    res.json(result)
                }
            } else if (req.userData._id.toString() !== item.userId.toString() && req.userData.roles.includes('admin')) {
                const bnb = await cartItemDAO.getByBnbId(req.params.id)
                if (bnb) {
                    res.status(409).send('Please remove item from cart.')
                } else {
                    const result = await itemDAO.deleteItem(req.params.id)
                    res.json(result)
                }
            } else {
                res.sendStatus(403)
            }
        } catch(e) {
            res.status(500).send(e.message)
        }
    }
})

module.exports = router