import express, { Request, Response } from 'express'
import { MessageAdditionInterface } from '../interface/Interface'
const ObjectIdError = require('../utils/ObjectIdError')
const { addMessage, getMessageByUserId } = require('../controller/Messages')
const router = express.Router()
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)


router.put('/', async(req:Request, res:Response) => {
    const { error } = validateMessage(req.body)
    if(error){
        if(error.details[0].path[0] === 'userId'){
            return ObjectIdError(res, error, "UserId is invalid" )
        }
        else {
            return ObjectIdError(res, error, "MessageId is invalid" )
        }
    }
    let result = await addMessage(req.body, res)
    return res.status(result.status).send(result);
})

router.get('/:id', async(req:Request, res:Response) => {
    const { error } = validateId(req.params.id)
    if(error){
        return ObjectIdError(res, error, "UserId is invalid" )
    }
    let result = await getMessageByUserId(req.params.id, req.query)
    return res.status(result.status).send(result);
})



const validateMessage = (message: MessageAdditionInterface) => {
    const schema = Joi.object({
        userId: Joi.objectId().required().messages({
            'objectId.base': 'User ID is invalid'
        }),
        messagesId: Joi.objectId().required().messages({
            'objectId.base': 'Message ID is invalid'
        }),
        message: Joi.string().min(5).required(),
    })
    let result = schema.validate(message);
    return result
}

const validateId = (id: string) => {
    const schema = Joi.objectId().required().messages({
            'objectId.base': 'User ID is invalid'
       
    })
    let result = schema.validate(id);
    return result
}

module.exports = router