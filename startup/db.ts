const log = require('../utils/Logger')
const mongoose = require('mongoose')


module.exports = function db(){
    const env = process.env.NODE_ENV || "development"
    mongoose.connect(env === 'development' ? process.env.DEV_MONGO_URL : process.env.PROD_MONGO_URL)
    .then(()=> log.info('Connected to anon database...'))
    .catch((err: unknown) => console.error('Could not connect to anon database...', err))
}