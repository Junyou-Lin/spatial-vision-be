const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = async (req, res, next) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer')
    ) {
      return res.status(401).send('Not authorized to access this route')
    }

    // Get token from header
    const token = req.headers.authorization.split(' ')[1]

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user profile from the token
    req.user = await User.findById(decoded.id).select('-password')

    next()
  } catch (err) {
    res.status(401).json(err)
  }
}

module.exports = { protect }
