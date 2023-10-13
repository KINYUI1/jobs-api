const {StatusCodes} = require('http-status-codes')
const {BadRequestError,UnauthenticatedError}= require('../errors')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

const register = async (req,res)=>{
    const user = await User.create(req.body)
    const token = user.createToken()
    res.status(StatusCodes.CREATED).json({name:user.name,token})
}

const login = async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user = await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError(`No user with email ${email}`)
    }
    const comparePassword = user.comparePassword(user.password)
    if(!comparePassword){
        throw new BadRequestError('Wrong password')
    }
    const token = user.createToken()
    res.status(StatusCodes.OK).json({msg:' Log In',name: user.name,token})
}    

module.exports = {register,login}