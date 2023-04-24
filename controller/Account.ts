import { AccountInterface } from '../interface/Interface'
import { Paginate } from '../utils/Paginate'
import { result } from '../utils/Result'
const { createMessage } = require('../controller/Messages' )
import dayjs from 'dayjs'
import { Novu, PushProviderIdEnum } from '@novu/node';
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)
const bcrypt = require('bcrypt')
const User = require('../model/Account')

const env = process.env.NODE_ENV || "development"

export const novu = new Novu(env === 'development' ? process.env.DEV_NOVU_API_KEY! : process.env.PROD_NOVU_API_KEY!)


const createUser = async(data: AccountInterface, res: any) => {
    //Check if user already exists
    let user = await User.findOne({username: data.username})
    if(user) return result("Unsuccessful", 400, "Account already exists", null)

    //If user does not exist, create it
    user = new User({
        username: data.username,
        password: data.password,
        uniqueId: Math.random().toString(36).substring(2, 10),
        theme: 'pinkgradient',
        isPublic: false,
        messageCount: 0,
        deviceToken: data.deviceToken
    })

    //Hash user password 
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    let response = await user.save()

    let message = await createMessage(response)
    user.messagesId = message.data._id

    //CREATE NOVU SUBSCRIBER
    await novu.subscribers.identify(response._id, {
        
    });

    //REGISTER SUBSCRIBER DEVICE TOKEN
    await novu.subscribers.setCredentials(response._id, PushProviderIdEnum.FCM, {
        deviceTokens: [`${data.deviceToken}`],
    });

    //Generate access token and save user details
    const authToken = user.generateAuthToken()
    res.header('x-auth-token', authToken)
    
    await user.save()

    return result("Successful", 201, "Account created successfully", { accessToken: authToken, id: user.uniqueId })
}


const loginUser = async(data: AccountInterface, res: any) => {
    //Check if user  exists
    let user = await User.findOne({username: data.username})
    if(!user) return result("Unsuccessful", 400, "Invalid email or password", null)
  
    //If user exists, compare password
    const validPassword = await bcrypt.compare(data.password, user.password)
    if(!validPassword){
        return result("Unsuccessful", 400, 'Invalid email or password', null)
    }

    //Generate access token
    const authToken = user.generateAuthToken()
    res.header('x-auth-token', authToken)

    return result("Successful", 200, "Login successfull", { accessToken: authToken })
}

const getAllUsers = async(query: { page: string; limit: string }) => {
    let user = await User.find().sort({ createdAt: -1 }).select({deviceToken:0, password:0, createdAt:0})
    if(user.length === 0){
        if(user) return result("Successful", 204, "No users found", [])
    } 
    let users = Paginate(query, user)

    return result("Successful", 200, 'Users fetched successfully', users)
}

const getUsersByVisibility = async(query: { page: string; limit: string; username:string }) => {
    let user 
    if(query.username){
        let value = new RegExp(".*" + query.username + ".*", "i")
        user = await User.find({ username: value, isPublic:true }).sort({ createdAt: -1 }).select({deviceToken:0, password:0, createdAt:0})
    }
    else{
        user = await User.find({ isPublic: true}).sort({ createdAt: -1 }).select({deviceToken:0, password:0, createdAt:0})
    }
    
    if(user.length === 0){
        if(user) return result("Successful", 204, "No public users found", [])
    } 
    let users = Paginate(query, user)

    return result("Successful", 200, 'Users fetched successfully', users)
}

const getUserByCode = async(id:string, res: any) => {
    //Check if user  exists
    let user = await User.findOne({uniqueId: id}).select({deviceToken:0, password:0, createdAt:0})
    if(!user) return result("Unsuccessful", 400, "User does not exist", null)

    return result("Successful", 200, 'User fetched successfully', user)
}

const getCurrentUser = async(req: any) => {
    //Check if user  exists
    // console.log(req.user)
    // console.log(req.user.exp - req.user.iat)
    // console.log(dayjs.unix(req.user.exp))
    // const date = dayjs.unix(req.user.exp)
    // console.log(date['$d' as keyof typeof date])
    let user = await User.findById({_id: req.user._id}).select({deviceToken:0, password:0, createdAt:0})

    if(!user) return result("Unsuccessful", 404, "This user does not exist", null)
    return result("Successful", 200, 'Profile fetched successfully', user)
}

module.exports = {
    createUser,
    loginUser,
    getAllUsers,
    getUsersByVisibility,
    getUserByCode,
    getCurrentUser,
}