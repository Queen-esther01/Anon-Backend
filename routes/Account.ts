import express, { Request, Response } from 'express'
import { AccountInterface } from '../interface/Interface'
const ObjectIdError = require('../utils/ObjectIdError')
const { createUser, loginUser, getAllUsers, getUsersByVisibility, getUserByUsername, getUserByCode, getCurrentUser } = require('../controller/Account')
const auth = require('../middlewares/auth')
const router = express.Router()
const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)


router.post('/register', async(req:Request, res:Response) => {
    const { error } = validateUser(req.body)
    if(error){
        return ObjectIdError(res, error )
    }
    let result = await createUser(req.body, res)
    return res.status(result.status).send(result);
})

router.post('/login', async(req:Request, res:Response) => {
    const { error } = validateUser(req.body)
    if(error){
        return ObjectIdError(res, error )
    }
    let result = await loginUser(req.body, res)
    return res.status(result.status).send(result);
})

router.get('/get-users', async(req:Request, res:Response) => {
    let result = await getAllUsers(req.query)
    return res.status(result.status).send(result);
})

router.get('/get-users-by-visibility', async(req:Request, res:Response) => {
    let result = await getUsersByVisibility(req.query)
    return res.status(result.status).send(result);
})

router.get('/get-user-by-code/:id', async(req:Request, res:Response) => {
    const { error } = validateCode(req.params.id)
    if(error){
        return ObjectIdError(res, error )
    }
    let result = await getUserByCode(req.params.id, res)
    return res.status(result.status).send(result);
})

router.get('/get-user-by-username/:username', async(req:Request, res:Response) => {
    const { error } = validateUsername(req.params.username)
    if(error){
        return ObjectIdError(res, error )
    }
    let result = await getUserByUsername(req.params.username, res)
    return res.status(result.status).send(result);
})

router.get('/get-current-user',[auth], async(req:Request, res:Response) => {
    let result = await getCurrentUser(req)
    return res.status(result.status).send(result);
})



const validateUser = (user: AccountInterface) => {
    const schema = Joi.object({
        username: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(255).required(),
        deviceToken: Joi.string(),
    })
    let result = schema.validate(user);
    return result
}

const validateCode = (code: string) => {
    const schema = Joi.string().min(8).max(8).required()
    let result = schema.validate(code);
    return result
}

const validateUsername = (code: string) => {
    const schema = Joi.string().required()
    let result = schema.validate(code);
    return result
}


module.exports = router