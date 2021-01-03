const async = require('async')
const { validateReq } = require('.')

const checkReqQuery = function (request, response, next) {
  let validatorsToSend = []
  if (!request.body.query)
    return response
      .status(400)
      .json({ status: false, message: 'Query not found' })
  switch (request.body.query) {
    // Validators executed dynamically on the request
    case 'update_profile':
      validatorsToSend = validateReq.update_user_profile
      break
    default:
      return response
        .status(400)
        .json({ status: false, message: 'Query not found' })
  }

  dynamicMiddleware(validatorsToSend, request, response, next)
}

module.exports = checkReqQuery

// This function executes middleware in series
function dynamicMiddleware(validators, req, res, next) {
  async.eachSeries(
    validators,
    function (middleware, doneMiddleware) {
      middleware.bind(null, req, res, doneMiddleware)()
    },
    function (err) {
      if (err) {
        return res
          .status(500)
          .json({ error: 'there was a problem with your query middleware' })
      } else {
        next(err)
      }
    }
  )
}
