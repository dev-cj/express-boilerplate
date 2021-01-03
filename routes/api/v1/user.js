const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('../../../config/config')
const jwt = require('jsonwebtoken')
const { validateReq, validationError, auth } = require('../../../middleware/')
const uuidv4 = require('uuid/v4')
const getStandardResponse = require('../../../helpers/sendResponse')

const User = require('../../../models/model_user')
const { Projection, Allowed_keys } = require('../../../allowed_config')
const logger = require('../../../config/logger')
const validate_sent_keys = require('../../../helpers/validator/validate_sent_keys')
const checkReqQuery = require('../../../middleware/checkReqQuery')

/**
 * User sign in
 */

router.post('/login', validateReq.login, validationError, (req, res) => {
  const { email, password } = req.body
  // Simple validation
  if (!email || !password)
    return res
      .status(400)
      .json({ message: 'Please enter all fields', success: false })

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (!user)
      return res
        .status(400)
        .json({ message: 'User does not exist', success: false })

    //Validate password

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch)
        return res
          .status(400)
          .json({ message: 'Invalid Credentials', success: false })

      jwt.sign(
        { user_id: user.user_id, name: user.name },
        config.JWT_SECRET,
        { expiresIn: '10h' },
        (err, token) => {
          if (err) throw err
          res.cookie(config.COOKIE, token, {
            httpOnly: true,
            secure: false,
          })
          let data = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
          }
          res.json(getStandardResponse(true, 'Logged In Successfully', data))
        }
      )
    })
  })
})

// @route   Post api/users
// @desc    Register new user
// @access  Public

router.post('/register', validateReq.register, validationError, (req, res) => {
  const { first_name, last_name, email, password } = req.body

  // Check for existing user
  User.findOne({ email }).then((user) => {
    if (user)
      return res
        .status(400)
        .json({ message: 'Email already registered', success: false })

    const user_id = uuidv4()
    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      user_id,
    })

    // Create salt and hash
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err
        newUser.password = hash
        newUser.save().then((user) => {
          jwt.sign(
            { id: user.user_id },
            config.JWT_SECRET,
            { expiresIn: 7200 },
            (err, token) => {
              if (err) throw err
              res.json(
                getStandardResponse(true, 'Successfully Registered', {
                  name: `${user.first_name} ${user.last_name}`,
                  email: user.email,
                })
              )
            }
          )
        })
      })
    })
  })
})

/*
 * Get User info
 */
router.get('/profile', auth, (req, res) => {
  User.find({ user_id: req.user.user_id }, Projection.get_user_info).then(
    (user) => {
      res.json(getStandardResponse(true, '', user[0]))
    }
  )
})

router.post('/profile', auth, checkReqQuery, validationError, (req, res) => {
  const { query, data } = req.body
  try {
    let action = query

    const update_required = data

    if (!validate_sent_keys(update_required, Allowed_keys.allowed_user_keys))
      return res
        .status(400)
        .json(getStandardResponse(false, 'Keys not allowed', ''))

    User.updateOne({ user_id: req.user.user_id }, update_required).then(
      (response) => {
        res.status(200).json(getStandardResponse(true, 'Profile Updated', ''))
      }
    )
  } catch (error) {
    logger.error('error')
    res.json({ success: false })
  }
})
module.exports = router
