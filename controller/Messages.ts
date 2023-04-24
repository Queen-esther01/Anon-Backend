import { Novu, PushProviderIdEnum } from '@novu/node';
import { MessageAdditionInterface } from '../interface/Interface'
import { result } from '../utils/Result'
import { Paginate } from '../utils/Paginate'
import { novu } from './Account';
const Message = require('../model/Message')
const User = require('../model/Account')

//change novu api key

const createMessage = async(data: any) => {

    let message = new Message({
        userId: data._id,
        messages: []
    })

    let response = await message.save()
    return result("Successful", 201, 'Message created successfully', response)
}


const addMessage = async(data:MessageAdditionInterface) => {
    //Check if user exists
    let user = await User.findById({_id: data.userId})
    if(!user) return result("Unsuccessful", 404, "This user does not exist", null)

    let message = await Message.findOne({_id: data.messagesId})
    if(!message) return result("Unsuccessful", 404, "This message does not exist", null)

    message?.messages.unshift({
        date: new Date(),
        message: data.message
    })

    user.messageCount = message.messages.length

    await message.save()
    await user.save()

    await novu.trigger('anon-push-notification',
        {
            to: {
                subscriberId: user._id,
            },
            payload: {
                message: data.message.slice(0, 30) + '...',
                name: user.username,
            },
            // overrides: {
            //     fcm: {
            //         icon: 'https://res.cloudinary.com/tinkerbell/image/upload/v1682185418/incognito_j8wzfs.png'
            //     }
            // }
        }
    );

    return result("Successful", 200, 'Anonymous message sent successfully', data)
}


const getMessageByUserId = async(id:string, query: { page: string; limit: string }) => {
    //Check if user exists
    let user = await User.findById({_id: id})
    if(!user) return result("Unsuccessful", 404, "This user does not exist", null)

    let messageData = await Message.findById({_id: user.messagesId})
    if(!messageData) return result("Unsuccessful", 404, "This message does not exist", null)

    let messages = Paginate(query, messageData.messages)
    

    return result("Successful", 200, 'User messages fetched successfully', messages)
}


//Get all messages by user ID

module.exports = {
    createMessage,
    addMessage,
    getMessageByUserId,
}