const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getOneUser,
  updateOneUser,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const {
  loginValidation,
  userValidate,
  userValidation,
} = require('../validations/userValidation')

router.post('/', userValidation(), userValidate, registerUser)
router.post('/login', loginValidation(), userValidate, loginUser)
router.get('/', protect, getOneUser)
router.put('/', protect, userValidation(), userValidate, updateOneUser)

module.exports = router
