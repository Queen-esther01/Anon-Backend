import { Response } from 'express'


function ObjectIdError(res: Response, error: any, message: string){
    
    return res.status(400).send({
        result: "Unsuccessful",
        data: {
            status: 400,
            message: error.details[0].context.name === 'valid mongo id' 
            ? message : error.details[0].message
        }
    });
}

module.exports = ObjectIdError