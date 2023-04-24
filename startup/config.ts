const config = require('config')

module.exports = function(){
    if(!process.env.privatekey){
        throw new Error('jWT private key is not defined')
    }
}