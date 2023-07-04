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
                res.status(409).send({ message: 'Email already exists' })
            } else {
                res.json({ user: savedUser, message: 'User created successfully' })
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
            if (!user) {
                return res.status(400).send({ message: "User doesn't exist" })
            }
            const result = await bcrypt.compare(req.body.password, user.password)
            if (!result) {
                res.status(401).send({ message: "Password doesn't match" })
            } else {
                const userToken = await userDAO.makeTokenForUserId(user._id)
                res.json({ token: userToken, userEmail: user.email, message: 'User logged in successfully' })
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

router.post("/logout", async (req, res, next) => {
    if (!req.userId) {
        res.status(401).send("token doesn't match")
    } else {
        try {
            const tokenString = req.headers.authorization
            const success = await userDAO.removeToken(tokenString)
            res.sendStatus(success ? 200 : 401)
        } catch(e) {
            res.status(500).send(e.message)
        }
    }
})

module.exports = router