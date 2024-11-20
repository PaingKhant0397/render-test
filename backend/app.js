require('express-async-errors')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const config = require('./utils/config')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')

// Mongoose setup
mongoose.set('strictQuery', false)

// Integrate logger
logger.info('Connecting to ', config.MONGODB_URI)

// Connect to MongoDB
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB')
  })
  .catch(error => {
    logger.error('Error connecting to MongoDB: ', error.message)
  })

// App setup
const app = express()

app.use(cors()) // Enable Cross-Origin Resource Sharing
app.use(express.static('dist')) // Serve static files
app.use(express.json()) // To convert requests into json objects
app.use(middleware.requestLogger) // log requests

// Note Application Routes
app.use('/api/notes', notesRouter)

// User Application Routes
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
