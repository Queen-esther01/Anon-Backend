const express = require('express')
const Sentry = require("@sentry/node")
// import Tracing from "@sentry/node";
// const logs = require('./utils/logger')
const app = express()

require("dotenv").config();

const env = process.env.NODE_ENV || "development"
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({ tracing: true }),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({ app }),
        // Automatically instrument Node.js libraries and frameworks
        ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
    ],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    enabled: env === 'development' ? false : true
});

// RequestHandler creates a separate execution context, so that all
// transactions/spans/breadcrumbs are isolated across requests
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());


// require('./startup/sentry')()
require('./startup/logging.ts')
require('./startup/db')()
require('./startup/routes')(app)
require('./startup/config')()
require('./startup/validation')()
require('./startup/prod')(app)


const port = process.env.PORT || 8080
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

module.exports = app