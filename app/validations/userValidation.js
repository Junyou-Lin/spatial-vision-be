const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

const loginValidation = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('email need to follow email format'),

    body('password')
      .notEmpty()
      .withMessage('password is required')
      .isLength({ min: 5, max: 20 })
      .withMessage('password need to be between 5 and 20 characters'),
  ]
}

const userValidation = () => {
  return [
    body('email')
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('email need to follow email format'),

    body('password')
      .notEmpty()
      .withMessage('password is required')
      .isLength({ min: 5, max: 20 })
      .withMessage('password need to be between 5 and 20 characters'),

    body('firstName')
      .notEmpty()
      .withMessage('firstName is required')
      .isLength({ min: 2, max: 20 })
      .withMessage('firstName need to be between 2 and 20 characters'),

    body('lastName')
      .notEmpty()
      .withMessage('lastName is required')
      .isLength({ min: 2, max: 20 })
      .withMessage('lastName need to be between 2 and 20 characters'),

    body('address')
      .notEmpty()
      .withMessage('address is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('address need to be between 2 and 100 characters'),

    body('dob')
      .notEmpty()
      .withMessage('Date of birth is required')
      .isISO8601()
      .toDate()
      .withMessage('Date of birth need to be in ISO8601 format'),

    body('location.latitude')
      .notEmpty()
      .withMessage('Location latitude is required')
      .isNumeric()
      .withMessage('Location latitude need to be a number'),

    body('location.longitude')
      .notEmpty()
      .withMessage('Location latitude is required')
      .isNumeric()
      .withMessage('Location latitude need to be a number'),
  ]
}

const userValidate = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array()[0].msg
    return res
      .status(422)
      .send(extractedErrors.charAt(0).toUpperCase() + extractedErrors.slice(1))
  }
  if (req.path === '/login') {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email.toLowerCase() })
    if (!user) {
      return res.status(400).send('User does not exist, please sign up')
    }
    // Check if password is correct
    const match = await bcrypt.compare(req.body.password, user.password)
    if (!match) {
      return res.status(400).send('Invalid credentials')
    }
  }
  if (req.path === '/' && req.method === 'POST') {
    // Check if user exists in add new user/register route
    const userExists = await User.findOne({ email: req.body.email })
    if (userExists) {
      return res.status(400).send('User already exists with this email')
    }
  }
  return next()
}

module.exports = {
  loginValidation,
  userValidation,
  userValidate,
}
