const express = require('express')
const router = express.Router()
const itemDAO = require('../daos/item')
const multer = require('multer')

const fileStorage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '--' + file.originalname)
    }
})

const upload = multer({ storage: fileStorage }).single('image')

router.get('/', async (req, res) => {
    const result = await itemDAO.getAll()
    res.status(200).json(result)
})

router.get('/:id', async (req, res) => {
    const result = await itemDAO.getById(req.params.id)
    res.status(200).json(result)
})

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err)
        } else {
            const userInput = {
                bnbCity: req.body.bnbCity,
                bnbCost: req.body.bnbCost,
                bnbCountry: req.body.bnbCost,
                bnbImage: {
                    data: req.file.filename,
                    contentType: 'image/jpg'
                },
                bnbTitle: req.body.bnbTitle
            }
            const result = await itemDAO.createItem(userInput)
            res.status(201).json(result)
        }
    })
    //res.send('Successfully uploaded image!')
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