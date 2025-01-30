import express, { Request, Response } from 'express';
const app = express();
import bcrypt from "bcrypt"
import { z } from "zod"
import Jwt from "jsonwebtoken"
import { JWT_SECRET_KEY,usermiddleware} from './middleware';
import { User, Balance, Transaction, BankAccount } from './db'
app.post("/api/v1/signUp", async function (req: Request, res: Response) {
    const { firstName, lastName, email, password } = req.body;
    const requireBody = z.object({
        firstName: z.string().min(3).max(30),
        lastName: z.string().min(3).max(30),
        email: z.string().email(),
        password: z.string().min(6).max(30),
    })
    try {
        const parseData = requireBody.safeParse(req.body);
        if (!parseData.success) {
            res.status(400).json({
                message: "invalid data",
                error: parseData.error,
            })
            return;
        }
    }
    catch (e) {
        if (e instanceof z.ZodError) {
            res.json({
                message: "invalid data",
                error: e.errors
            })
            return;
        }
    }
    try{
        const existingUser=await User.findOne({email})
        if(existingUser){
            res.status(400).json({
                message:"user already exists"
            })
            return;
        }
        const hashPassword=await bcrypt.hash(password,10);
        await User.create({
            email:email,
            firstName:firstName,
            lastName:lastName,
            password:hashPassword
        })
        res.json({
            message:"You are signed up"
        })
    }
    catch(e){
        res.status(500).json({
            message:"something went wrong",
            error:e
        })
    }
})
app.post("/api/v1/signIn",async function(req:Request,res:Response){
        const {userName,password}=req.body;
        if(!userName || !password){
            res.status(400).json({
                message:"Email and Password are required"
            })
            alert("enter the username")
            return 
        }
        try{
            const response=await User.findOne({userName});
            if(!response){
                res.status(401).json({
                    message:"user doesnot exits"
                })
                alert("user doesNot exists")
                return
            }
            const userId:string=response._id.toString();
            if(response.password && typeof response.password==="string"){
                const passwordMatch=await bcrypt.compare(password,response.password);
                if(passwordMatch){
                    const token=Jwt.sign(
                        {userId:userId},JWT_SECRET_KEY
                    )
                    res.json({
                        message:"you are signed in",
                        token:token
                    })
                    return
                }
                else{
                    res.status(401).json({
                        message:"incorrect Password"
                    })
                    return 
                }
            
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Error occured during signin",
            })
        }




})

app.listen(3000);