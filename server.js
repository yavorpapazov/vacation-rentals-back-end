let express = require('express')
let server = express()
let cors = require('cors')
let routes = require('./routes')

server.use(express.json())
server.use(cors())
server.use(routes)

module.exports = server