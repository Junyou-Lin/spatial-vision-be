const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

//register user
const registerUser = async (req, res) => {
  const { firstName, lastName, address, dob, email, password, location } =
    req.body

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  try {
    const user = await User.create({
      firstName,
      lastName,
      address,
      dob,
      email: email.toLowerCase(),
      password: hashedPassword,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
    })
    res.status(201).json({
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

//login user
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email.toLowerCase() })
    res.json({
      token: generateToken(user._id),
    })
  } catch (err) {
    res.status(500).json(err)
  }
}

// Get user profile
const getOneUser = async (req, res) => {
  res.json(req.user)
}

// Update user profile
const updateOneUser = async (req, res) => {
  const { firstName, lastName, address, dob, email, password, location } =
    req.body

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  try {
    const user = await User.findByIdAndUpdate(req.user._id, {
      firstName,
      lastName,
      address,
      dob,
      email: email.toLowerCase(),
      password: hashedPassword,
      location: {
        type: 'Point',
        coordinates: [location.longitude, location.latitude],
      },
    })
    res.status(200).send('User updated successfully')
  } catch (err) {
    res.status(500).json(err)
  }
}

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
}

module.exports = {
  registerUser,
  loginUser,
  getOneUser,
  updateOneUser,
}
