const express = require('express')
const router = express.Router()
const itemDAO = require('../daos/item')
// const multer = require('multer')
// const fs = require('fs')

// const fileStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null,'uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '--' + file.originalname)
//     }
// })

// const upload = multer({ storage: fileStorage })

router.get('/', async (req, res) => {
    const result = await itemDAO.getAll()
    res.json(result)
})

router.get('/:id', async (req, res) => {
    const result = await itemDAO.getById(req.params.id)
    res.json(result)
})
//upload.single('image')
router.post('/', async (req, res) => {
    try {
        const userInput = {
            bnbCity: req.body.bnbCity,
            bnbCost: req.body.bnbCost,
            bnbCountry: req.body.bnbCountry,
            bnbImage: req.body.bnbImage,
            bnbTitle: req.body.bnbTitle
        }
        await itemDAO.createItem(userInput)
        res.sendStatus(200)
    } catch(e) {
        res.status(500).send(e.message)
    }
})

// router.post('/', upload.single('image'), async (req, res) => {
//     console.log(req.body)
//     console.log(req.file)
//     const userInput = {
//         bnbCity: req.body.bnbCity,
//         bnbCost: req.body.bnbCost,
//         bnbCountry: req.body.bnbCountry,
//         bnbImage: {
//             data: fs.readFileSync('uploads/' + req.file.filename),
//             contentType: 'image/png'
//         },
//         bnbTitle: req.body.bnbTitle
//     }
//     const result = await itemDAO.createItem(userInput)
//     res.json(result)
// })

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