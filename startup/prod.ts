import { Application } from "express"

const helmet = require('helmet')
const compression = require('compression')

module.exports =  function(app: Application) {
    app.use(helmet())
    app.use(compression())
}