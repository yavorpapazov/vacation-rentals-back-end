const { Router } = require("express")
const router = Router()

router.use("/login", require('./users'))
router.use("/bnbs", require('./bnbs'))
router.use("/cart", require('./cart'))

module.exports = router