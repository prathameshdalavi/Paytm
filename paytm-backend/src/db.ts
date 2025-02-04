import mongoose, { Schema } from "mongoose";
import {Types} from 'mongoose'
const userShema=new Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
})
const accountSchema=new Schema({
    userId:Schema.Types.ObjectId,
    balance:Number,
})


const User=mongoose.model('User',userShema)
const Account=mongoose.model('Account',accountSchema)
export {User,Account}