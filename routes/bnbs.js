const express = require('express')
const router = express.Router()
const itemDAO = require('../daos/item')

router.get('/', async (req, res) => {
    const result = await itemDAO.getAll()
    res.json(result)
})

router.get('/:id', async (req, res) => {
    const result = await itemDAO.getById(req.params.id)
    res.json(result)
})

router.post('/', async (req, res) => {
    try {
        const userInput = {
            bnbCity: req.body.bnbCity,
            bnbCost: req.body.bnbCost,
            bnbCountry: req.body.bnbCountry,
            bnbImage: req.body.bnbImage,
            bnbTitle: req.body.bnbTitle,
            stars: req.body.stars
        }
        await itemDAO.createItem(userInput)
        res.sendStatus(200)
    } catch(e) {
        res.status(500).send(e.message)
    }
})

router.put('/:id', async (req, res) => {
    const result = await itemDAO.updateItem(req.params.id, req.body)
    res.json(result)
})

router.delete('/:id', async (req, res) => {
    const result = await itemDAO.deleteItem(req.params.id)
    res.json(result)
})

router.all('*', (req, res) => {
    res.status(404).send('Resource not found')
})

module.exports = router