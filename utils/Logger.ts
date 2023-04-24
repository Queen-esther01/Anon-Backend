const winston = require('winston');

//LOGGER
const Logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        // new winston.transports.File({ filename: 'logFile.log' })
    ]
})


module.exports = Logger