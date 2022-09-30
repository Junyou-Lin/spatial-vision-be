const express = require('express')
const connectDB = require('./config/db')
const cors = require('cors')
const morgan = require('morgan')
const userRoute = require('./routes/userRoutes')

const dotenv = require('dotenv').config()
const port = process.env.PORT || 4000

connectDB()
const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.status(200).send('Spatial Vision Technical Task API version 1.0')
})

app.use('/api/users', userRoute)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

module.exports = app
