let express = require('express')
let router = express.Router()
let itemDAO = require('../daos/item')

router.get('/', async (req, res) => {
    let result = await itemDAO.getAll()
    res.status(200).json(result)
})

router.get('/:id', async (req, res) => {
    let result = await itemDAO.getById(req.params.id)
    res.status(200).json(result)
})

router.post('/', async (req, res) => {
    let result = await itemDAO.createItem(req.body)
    res.status(201).json(result)
})

router.put('/:id', async (req, res) => {
    let result = await itemDAO.updateItem(req.params.id, req.body)
    res.status(200).json(result)
})

router.delete('/:id', async (req, res) => {
    let result = await itemDAO.deleteItem(req.params.id)
    res.status(200).json(result)
})

router.all('*', (req, res) => {
    res.status(404).send('Resource not found')
})

module.exports = router