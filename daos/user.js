const uuid = require('uuid')
const User = require('../models/user')
const Token = require('../models/token')

module.exports = {}

module.exports.createUser = async (userData, userEmail) => {
  const exist = await User.findOne({ email: userEmail }).lean()
  if (exist) {
    return 'exists'
  }
  const created = await User.create(userData)
  return created;
}

module.exports.getUser = async (userEmail) => {
  const user = await User.findOne({ email: userEmail }).lean()
  return user
}

module.exports.getUserById = async (userId) => {
  const user = await User.findOne({ _id: userId }).lean()
  return user
}

module.exports.makeTokenForUserId = async (userId) => {
  const token = uuid.v4();
  const created = await Token.create({ userId, token })
  return created.token
}

module.exports.getUserIdFromToken = async (tokenString) => {
  const tokenRecord = await Token.findOne({ token: tokenString }).lean()
  if (tokenRecord) {
    return tokenRecord.userId
  } else {
    return undefined
  }
}

module.exports.removeToken = async (tokenString) => {
  await Token.deleteOne({ token: tokenString })
  return true
}