const app = require('./app/server')
const serverless = require('serverless-http')
module.exports.handler = serverless(app)
