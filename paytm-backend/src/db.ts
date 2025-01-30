import mongoose, { Schema } from "mongoose";
import {Types} from 'mongoose'
const userShema=new Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
})
const balanceSchema=new Schema({
    balance:Number,
    userId:Schema.Types.ObjectId,
})
const transactionSchema=new Schema({
    amount:Number,
    userId:Schema.Types.ObjectId,
    type:String,
    senderId:Schema.Types.ObjectId,
    receiverId:Schema.Types.ObjectId,
}) 
const BankAccountSchema=new Schema({
    bankName:String,
    userId:Schema.Types.ObjectId,
})
const User=mongoose.model('User',userShema)
const Balance=mongoose.model('Balance',balanceSchema)
const Transaction=mongoose.model('Transaction',transactionSchema)
const BankAccount=mongoose.model('BankAccount',BankAccountSchema)
export {User,Balance,Transaction,BankAccount}