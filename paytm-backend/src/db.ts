import mongoose, { Schema } from "mongoose";
const userShema=new Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
})
const accountSchema=new Schema({
    userId:Schema.Types.ObjectId,
    balance:Number,
    password:String
})
const transactionSchema=new Schema({
    from:Schema.Types.ObjectId,
    to:Schema.Types.ObjectId,
    amount:Number,
    createdAt:{type:Date,default:Date.now}
})

const User=mongoose.model('User',userShema)
const Transaction=mongoose.model('Transaction',transactionSchema)
const Account=mongoose.model('Account',accountSchema)
export {User,Account,Transaction}