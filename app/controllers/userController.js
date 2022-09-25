const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

//register user
const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, address, dob, email, password, location } =
      req.body

    //check for empty fields
    if (
      !firstName ||
      !lastName ||
      !address ||
      !dob ||
      !email ||
      !password ||
      !location
    ) {
      return res.status(400).send('Please fill in all input fields')
    }

    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).send('User already exists with this email')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
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
    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
      })
    } else {
      return res.status(400).send('Invalid user data')
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

//login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    //check for empty fields
    if (!email || !password) {
      return res.status(400).send('Please fill in all input fields')
    }

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() })
    if (!user) {
      return res.status(400).send('User does not exist, please sign up')
    }

    // Check if password is correct
    const match = await bcrypt.compare(password, user.password)
    if (match) {
      res.json({
        token: generateToken(user._id),
      })
    } else {
      return res.status(400).send('Invalid credentials')
    }
  } catch (err) {
    res.status(500).json(err)
  }
}

// Get user profile
const getOneUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send('User not found')
    }
    res.json(req.user)
  } catch (err) {
    res.status(500).json(err)
  }
}

const updateOneUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send('User not found')
    }
    const { firstName, lastName, address, dob, email, password, location } =
      req.body

    if (
      !firstName ||
      !lastName ||
      !address ||
      !dob ||
      !email ||
      !password ||
      !location
    ) {
      return res.status(400).send('Please fill in all input fields')
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

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
    if (user) {
      res.status(200).send('User updated successfully')
    }
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
