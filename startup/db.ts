import { Schema } from 'mongoose'
const log = require('../utils/logger')
const mongoose = require('mongoose')



module.exports = function db(){
    mongoose.connect('mongodb://127.0.0.1:27017/anon')
    .then(()=> log.info('Connected to anon database...'))
    .catch((err: unknown) => console.error('Could not connect to anon database...', err))

    //const MyModel = mongoose.model('Test', new Schema({ name: String }));
}