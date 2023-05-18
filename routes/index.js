const { Router } = require("express")
const router = Router()

//router.use("/login", require('./users'))
router.use("/bnbs", require('./bnbs'))

module.exports = router