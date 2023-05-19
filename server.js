const express = require('express')
const server = express()
const cors = require('cors')
const routes = require('./routes')

server.use(express.json())
server.use(cors())
server.use(routes)

module.exports = server