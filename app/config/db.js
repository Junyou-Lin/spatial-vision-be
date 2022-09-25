const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log('MongoDB Connected...')
  } catch (err) {
    console.error(err.message)
  }
}

module.exports = connectDB
