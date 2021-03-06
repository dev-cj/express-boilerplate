const config = require('../config/config')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  const token_name = config.COOKIE
  const token = req.cookies[token_name]
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' })
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET)

    req.user = decoded
    next()
  } catch (error) {
    return res.status(400).json({ message: 'Token is not valid' })
  }
}

module.exports = auth
