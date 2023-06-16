const { Router } = require("express")
const router = Router()
const bcrypt = require("bcrypt")
const userDAO = require('../daos/user')

router.post("/signup", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required')
    } else {
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = {
                email: req.body.email,
                password: hashedPassword,
                roles: ['user']
            };
            const savedUser = await userDAO.createUser(user, user.email)
            if (savedUser === 'exists') {
                res.status(409).send('email already exists')
            } else {
                res.json(savedUser)
            }
        } catch(e) {
            res.status(500).send(e.message)
        }
    }
})

router.post("/", async (req, res, next) => {
    if (!req.body.password || JSON.stringify(req.body.password) === '' ) {
        res.status(400).send('password is required')
    } else {
        try {
            const user = await userDAO.getUser(req.body.email)
            const result = await bcrypt.compare(req.body.password, user.password)
            if (!result) {
                res.status(401).send("password doesn't match")
            } else {
                const userToken = await userDAO.makeTokenForUserId(user._id)
                res.json({ token: userToken })
            }
        } catch(e) {
            res.status(401).send(e.message)
        }
    }
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

router.post("/logout", async (req, res, next) => {
    if (!req.userId) {
        res.status(401).send("token doesn't match")
    } else {
        try {
            const tokenString = req.headers.authorization.slice(7)
            const success = await userDAO.removeToken(tokenString)
            res.sendStatus(success ? 200 : 401)
        } catch(e) {
            res.status(500).send(e.message)
        }
    }
})

module.exports = router