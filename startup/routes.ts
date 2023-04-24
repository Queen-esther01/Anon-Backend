import express, { Application } from 'express'
import * as Sentry from "@sentry/node";
const cors = require("cors");
const error = require('../middlewares/error')
const account = require('../routes/Account')
const message = require('../routes/Messages')
const settings = require('../routes/Settings')


module.exports = function(app: Application) {
    //MIDDLEWARES
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(cors())

    //Routes
    // app.get("/", function rootHandler(req, res) {
    //     res.end("Hello world!");
    // });
    // app.get("/debug-sentry", function mainHandler(req, res) {
    //     throw new Error("My first Sentry error!");
    // });
    app.use('/api/v1/account', account)
    app.use('/api/v1/message', message)
    app.use('/api/v1/settings', settings)

    // The error handler must be before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler());
    //Error Middleware
    app.use(error)
}