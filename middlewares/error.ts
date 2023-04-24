import { Request, Response } from 'express'
const logger = require('../utils/logger')



function error(err: any, req:Request, res:Response, next: any){
    //console.log(err)
    logger.log({level: 'error', message: err.message})
    
    res.status(500).send({
        result: 'Internal Server Error',
        data: {
            status: 500,
            message: "Something went wrong",
            data: err
        }
    })
}

module.exports = error