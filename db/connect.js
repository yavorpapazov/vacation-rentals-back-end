const mongoose = require('mongoose')

const connectionString = 'mongodb+srv://yavor:yapap123@cluster0.eyyx1.mongodb.net/database-01?retryWrites=true&w=majority'

const connectDB = () => {
    return mongoose.connect(connectionString)
}

module.exports = connectDB