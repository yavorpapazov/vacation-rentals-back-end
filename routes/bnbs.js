const express = require('express')
const router = express.Router()
const itemDAO = require('../daos/item')
const userDAO = require('../daos/user')

router.get('/', async (req, res) => {
    const result = await itemDAO.getAll()
    res.json(result)
})

router.get('/:id', async (req, res) => {
    const result = await itemDAO.getById(req.params.id)
    res.json(result)
})

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

router.post('/', async (req, res) => {
    try {
        const userInput = {
            bnbCity: req.body.bnbCity,
            bnbCost: req.body.bnbCost,
            bnbCountry: req.body.bnbCountry,
            //bnbImage: req.body.bnbImage,
            bnbTitle: req.body.bnbTitle,
            stars: req.body.stars,
            userId: req.userId
        }
        const result = await itemDAO.createItem(userInput)
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
    const result = await itemDAO.deleteItem(req.params.id)
    res.json(result)
})

router.all('*', (req, res) => {
    res.status(404).send('Resource not found')
})

module.exports = router