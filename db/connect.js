if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const mongoose = require('mongoose')

const connectDB = () => {
    return mongoose.connect(process.env.MONGO_URL)
}

module.exports = connectDB