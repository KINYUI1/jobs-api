const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide name'],
        maxlength:50,
        minlength:3
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
        unique:true
    },
    password:{
        type:String,
        required:[true,'Please provide password'],
        minlength:6,
        
    }
})

userSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
    next()
})

userSchema.methods.createToken = function(){
    const token = jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
    return token
}

userSchema.methods.comparePassword = async function(userPassword){
    const compare = await bcrypt.compare(userPassword,this.password)
    return compare
}

module.exports = mongoose.model('User',userSchema)