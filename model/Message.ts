import { Schema, model } from 'mongoose'
import { MessageInterface } from '../interface/Interface'

const MessageSchema = new Schema<MessageInterface>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    messages: {
        type: [new Schema({
            date: {
                type: Date,
                required: true,
                default: Date.now
            },
            message: {
                type: String,
                required: true
            }
        })],
        required: true
    }
})

module.exports = model<MessageInterface>('Messages', MessageSchema)