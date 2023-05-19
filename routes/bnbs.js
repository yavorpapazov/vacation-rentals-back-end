const express = require('express')
const router = express.Router()
const itemDAO = require('../daos/item')
const multer = require('multer')

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname)
    }
})

const upload = multer({ storage: fileStorage })

router.get('/', async (req, res) => {
    const result = await itemDAO.getAll()
    res.status(200).json(result)
})

router.get('/:id', async (req, res) => {
    const result = await itemDAO.getById(req.params.id)
    res.status(200).json(result)
})

router.post('/', async (req, res) => {
    const result = await itemDAO.createItem(req.body)
    res.status(201).json(result)
})

router.put('/:id', async (req, res) => {
    const result = await itemDAO.updateItem(req.params.id, req.body)
    res.status(200).json(result)
})

router.delete('/:id', async (req, res) => {
    const result = await itemDAO.deleteItem(req.params.id)
    res.status(200).json(result)
})

router.all('*', (req, res) => {
    res.status(404).send('Resource not found')
})

module.exports = router