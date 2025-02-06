import express, { Request, Response } from 'express';
const app = express();
import bcrypt from "bcrypt"
import { z } from "zod"
import Jwt from "jsonwebtoken"
import { JWT_SECRET_KEY, usermiddleware } from './middleware';
import { User, Account, Transaction } from './db'
import mongoose from 'mongoose';
import cors from 'cors';
app.use(cors());
app.use(express.json());
async function main() {
    await mongoose.connect("mongodb+srv://prathameshdalavi04:patya131104@cluster0.8rk6v.mongodb.net/paytm");
}
main();
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
    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            res.status(400).json({
                message: "user already exists"
            })
            return;
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: hashPassword
        })
        res.json({
            message: "You are signed up"
        })
    }
    catch (e) {
        res.status(500).json({
            message: "something went wrong",
            error: e
        })
    }
})
app.post("/api/v1/signIn", async function (req: Request, res: Response) {
    const {email, password } = req.body;
    if ( !password) {
        res.status(400).json({
            message: "Email and Password are required"
        })
        alert("enter the username")
        return
    }
    try {
        const response = await User.findOne({email});
        if (!response) {
            res.status(401).json({
                message: "user doesnot exits"
            })
            alert("user doesNot exists")
            return
        }
        const userId: string = response._id.toString();
        if (response.password && typeof response.password === "string") {
            const passwordMatch = await bcrypt.compare(password, response.password);
            if (passwordMatch) {
                const token = Jwt.sign(
                    { userId: userId }, JWT_SECRET_KEY
                )
                res.json({
                    message: "you are signed in",
                    token: token
                })
                return
            }
            else {
                res.status(401).json({
                    message: "incorrect Password"
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
app.post("/api/v1/addAccount", usermiddleware, async function (req: Request, res: Response) {
    const userId = req.body.userId.userId;
    try {
        await Account.create({
            userId: userId,
            balance: 1 + Math.random() * 10000
        })
        res.json({
            message: "account created"
        })
    }
    catch (e) {
        res.status(500).json({
            message: "something went wrong",
            error: e
        })
    }
})
app.get("/api/v1/balance", usermiddleware, async function (req: Request, res: Response) {
    const userId = req.body.userId.userId;
    try {
        const balance: any = await Account.findOne({ userId: userId });
        res.json(balance.balance)
    }
    catch (e) {
        res.status(500).json({
            message: "something went wrong",
            error: e
        })
    }
})

app.post("/api/v1/transaction", usermiddleware, async function (req: Request, res: Response) {
    const session = await mongoose.startSession();
    session.startTransaction();
    const { amount, to } = req.body;
    const account: any = await Account.findOne({ userId: req.body.userId.userId }).session(session);
    if (!account || account.balance < amount) {
        await session.abortTransaction();
        res.status(400).json({
            message: "Insufficient balance"
        });
        return;
    }
    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        res.status(400).json({
            message: "Invalid account"
        });
        return
    }
    await Account.updateOne({ userId: req.body.userId.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    await Transaction.create([{ 
        from: req.body.userId.userId, 
        to: to, 
        amount: amount 
    }], { session });
    await session.commitTransaction();
    res.json({
        message: "Transfer successful"
    });
})
app.get("/api/v1/transactionHistory", usermiddleware, async function (req: Request, res: Response) {
    const userId = req.body.userId.userId;
    try {
        const transactionHistory: any = await Transaction.find({ from:req.body.userId.userId }).sort({ createdAt: -1 });
        res.json(transactionHistory)
    }
    catch (e) {
        res.status(500).json({
            message: "something went wrong",
            error: e
        })
    }
})
app.listen(3000, () => {
    console.log("listening on port 3000");
})