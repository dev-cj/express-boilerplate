const { validationResult } = require('express-validator')
const logger = require('../config/logger')

const validationError = (req, res, next) => {
  const Result = validationResult(req) // Finds the validation errors in this request and wraps them in an object with handy functions
  if (!Result.isEmpty()) {
    logger.info(JSON.stringify(Result, null, 2))
    return res
      .status(422)
      .json({ message: Result.array()[0].msg, success: false })
  }
  next()
}
module.exports = validationError
