const server = require('./server')
const connectDB = require('./db/connect')

const port = 5000

const start = async () => {
    try {
        await connectDB()
        server.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch(error) {
        console.log(error)
    }
}

start()