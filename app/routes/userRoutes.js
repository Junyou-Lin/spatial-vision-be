const express = require('express')
const router = express.Router()
const {
  registerUser,
  loginUser,
  getOneUser,
  updateOneUser,
} = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/', protect, getOneUser)
router.put('/', protect, updateOneUser)

module.exports = router
