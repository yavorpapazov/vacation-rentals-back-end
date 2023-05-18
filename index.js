let server = require('./server')
let connectDB = require('./db/connect')

let port = 5000

let start = async () => {
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