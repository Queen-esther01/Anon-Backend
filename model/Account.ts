import { Schema, model } from 'mongoose'
import { AccountInterface } from '../interface/Interface'
const jwt = require('jsonwebtoken')

const AccountSchema = new Schema<AccountInterface>({
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    username: {
        type: String,
        required: true,
        maxLength: 15
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    uniqueId: {
        type: String,
        required: true,
        maxlength: 8,
    },
    theme: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
        required: true,
    },
    messageCount: {
        type: Number,
        required: true,
    },
    messagesId: {
        type: Schema.Types.ObjectId,
        ref: "Messages",
    },
    deviceToken: {
        type: String
    },
})

let user = AccountSchema
user.methods.generateAuthToken = function(){
    const token = jwt.sign({
            _id: this._id,
            username: this.username,
            uniqueId: this.uniqueId
        }, 
        process.env.privatekey,
        { expiresIn: '14 days' }
    )
    return token
}


module.exports = model<AccountInterface>('User', user)