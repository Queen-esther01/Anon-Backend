import { SettingsInterface } from '../interface/Interface'
import { result } from '../utils/Result'
const User = require('../model/Account')


const toggle = async(data:any, req:any) => {
    //Check if user exists
    let user = await User.findById({_id: data.userId})

    if(req.user._id !== data.userId){
        return result("Unsuccessful", 401, 'Invalid Credential', null)
    }
    if(!user) return result("Unsuccessful", 404, "This user does not exist", null)

    if('status' in data){
        user.isPublic = data.status
        await user.save()
    }
    else{
        user.theme = data.theme
        await user.save()
    }

    return result("Successful", 200, 'Settings Changed Successfully', user)
}

module.exports = {
    toggle
}