require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
// const socketio = require('socket.io')
const app = express()
const morgan = require('./config/morgan')
const config = require('./config/config')
const logger = require('./config/logger')
const routes = require('./routes/api/v1')

if (config.env === 'production') {
  const corsOpt = {
    origin: process.env.CORS_ALLOW_ORIGIN || '*', // this work well to configure origin url in the server
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'], // to works well with web app, OPTIONS is required
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-auth-token',
      'Access-Control-Allow-Credentials',
    ], // allow json and token in the headers
  }

  app.use(cors(corsOpt))
} else {
  app.use(cors())
}

app.use(cookieParser())

//body-parser middleware
app.use(express.json())

// set security HTTP headers
app.use(helmet())

//log https requests
// app.use(httpLogger)

if (config.env !== 'test') {
  app.use(morgan.successHandler)
  app.use(morgan.errorHandler)
}

// Connect to Mongo
mongoose
  .connect(config.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => logger.info('MongoDB Connected...'))
  .catch((err) => logger.error(err))

app.use('/api/v1/', routes)

app.listen(config.port, () => {
  logger.info(`Server started on port ${config.port}`)
  logger.debug(`api available at localhost:${config.port}/api/v1/`)
})

module.exports = app
