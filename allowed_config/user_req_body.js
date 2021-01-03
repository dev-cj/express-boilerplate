const { body } = require('express-validator')

const login_body_array = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email address not valid'),
  body('password')
    .notEmpty()
    .isString()
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage('Invalid Password'),
]

const register_body_array = [
  body('first_name')
    .trim()
    .notEmpty()
    .isAlpha()
    .escape()
    .withMessage('Invalid first Name'),
  body('last_name')
    .trim()
    .optional()
    .notEmpty()
    .escape()
    .withMessage('Invalid last Name'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email address provided not valid'),
  body('password')
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 8 })
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$.!%*#?&])[A-Za-z\d@$.!%*#?&]{8,}$/)
    .withMessage(
      'Password must be of minimum 8 alphanumeric characters and containing a special charater'
    ),
]

const update_user_profile = [
  body('data.alias')
    .optional()
    .notEmpty()
    .trim()
    .escape()
    .withMessage('Alias provided not valid'),
  body('data.first_name')
    .optional()
    .trim()
    .notEmpty()
    .isAlpha()
    .escape()
    .isLength({ min: 2 })
    .withMessage('Name must have more than 2 characters'),
  body('data.last_name')
    .optional()
    .trim()
    .notEmpty()
    .isAlpha()
    .escape()
    .isLength({ min: 1 })
    .withMessage('Invalid Last Name'),
]

module.exports = { login_body_array, register_body_array, update_user_profile }
