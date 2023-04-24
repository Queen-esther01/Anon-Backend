import express, { Request, Response } from 'express'
import { SettingsInterface } from '../interface/Interface'
const { toggle } = require('../controller/Settings')
const ObjectIdError = require('../utils/ObjectIdError')
const auth = require('../middlewares/auth')
const router = express.Router()
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)


router.put('/toggle-visibility', [auth], async(req:Request, res:Response) => {
    const { error } = validate(req.body, 'visibility')
    if(error){
        return ObjectIdError(res, error, "UserId is invalid" )
    }
    let result = await toggle(req.body, req)
    return res.status(result.status).send(result);
})

router.put('/toggle', [auth], async(req:Request, res:Response) => {
    const { error } = validate(req.body, req.body.status ? 'status' : 'theme')
    if(error){
        return ObjectIdError(res, error, "UserId is invalid" )
    }
    
    let result = await toggle(req.body, req)
    return res.status(result.status).send(result);
})


const validate = (data: SettingsInterface, type:string) => {
    const schema = Joi.object().keys({
        userId: Joi.objectId().required().messages({
            'objectId.base': 'User ID is invalid'
        }),
        status: Joi.boolean(),
        theme: Joi.string(),
    }).xor('status', 'theme')
    let result = schema.validate(data);
    return result
}

module.exports = router