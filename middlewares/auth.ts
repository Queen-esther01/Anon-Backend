import { Request, Response } from 'express'
const jwt = require('jsonwebtoken')
const config = require('config')

function auth(req: any, res: Response, next: any){
    const token = req.header('x-auth-token')
    if(token === undefined) return res.status(401).send({
        result: 'Unsuccessful',
        data: {
            status: 401,
            message: 'Access denied. No token provided',
            data: null
        }
    })

    try{
        jwt.verify(token, process.env.privatekey, (err: any, decodedPayload: any) => {
            if(err){
                res.status(400).send({
                    result: 'Unsuccessful',
                    data: {
                        status: 400,
                        message: 'Expired token',
                        data: null
                    }
                })
            }
            else {
                req.user = decodedPayload
                next()
            }
        })
        
    }
    catch(e){
        return res.status(400).send({
            result: 'Unsuccessful',
            data: {
                status: 400,
                message: 'Invalid token',
                data: null
            }
        })
    }
}

module.exports = auth;