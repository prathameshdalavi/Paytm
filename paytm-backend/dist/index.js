"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleware_1 = require("./middleware");
const db_1 = require("./db");
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect("mongodb+srv://prathameshdalavi04:patya131104@cluster0.8rk6v.mongodb.net/paytm");
    });
}
main();
app.post("/api/v1/signUp", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { firstName, lastName, email, password } = req.body;
        const requireBody = zod_1.z.object({
            firstName: zod_1.z.string().min(3).max(30),
            lastName: zod_1.z.string().min(3).max(30),
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6).max(30),
        });
        try {
            const parseData = requireBody.safeParse(req.body);
            if (!parseData.success) {
                res.status(400).json({
                    message: "invalid data",
                    error: parseData.error,
                });
                return;
            }
        }
        catch (e) {
            if (e instanceof zod_1.z.ZodError) {
                res.json({
                    message: "invalid data",
                    error: e.errors
                });
                return;
            }
        }
        try {
            const existingUser = yield db_1.User.findOne({ email });
            if (existingUser) {
                res.status(400).json({
                    message: "user already exists"
                });
                return;
            }
            const hashPassword = yield bcrypt_1.default.hash(password, 10);
            yield db_1.User.create({
                email: email,
                firstName: firstName,
                lastName: lastName,
                password: hashPassword
            });
            res.json({
                message: "You are signed up"
            });
        }
        catch (e) {
            res.status(500).json({
                message: "something went wrong",
                error: e
            });
        }
    });
});
app.post("/api/v1/signIn", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!password) {
            res.status(400).json({
                message: "Email and Password are required"
            });
            alert("enter the username");
            return;
        }
        try {
            const response = yield db_1.User.findOne({ email });
            if (!response) {
                res.status(401).json({
                    message: "user doesnot exits"
                });
                alert("user doesNot exists");
                return;
            }
            const userId = response._id.toString();
            if (response.password && typeof response.password === "string") {
                const passwordMatch = yield bcrypt_1.default.compare(password, response.password);
                if (passwordMatch) {
                    const token = jsonwebtoken_1.default.sign({ userId: userId }, middleware_1.JWT_SECRET_KEY);
                    res.json({
                        message: "you are signed in",
                        token: token
                    });
                    return;
                }
                else {
                    res.status(401).json({
                        message: "incorrect Password"
                    });
                    return;
                }
            }
        }
        catch (error) {
            res.status(500).json({
                message: "Error occured during signin",
            });
        }
    });
});
app.post("/api/v1/addAccount", middleware_1.usermiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.userId.userId;
        const password = req.body.password;
        const requireBody = zod_1.z.object({
            password: zod_1.z.string().min(6).max(30),
        });
        try {
            const parseData = requireBody.safeParse(req.body);
            if (!parseData.success) {
                res.status(400).json({
                    message: "invalid data",
                    error: parseData.error,
                });
                return;
            }
        }
        catch (e) {
            if (e instanceof zod_1.z.ZodError) {
                res.json({
                    message: "invalid data",
                    error: e.errors
                });
                return;
            }
        }
        try {
            const hashPassword = yield bcrypt_1.default.hash(password, 10);
            yield db_1.Account.create({
                userId: userId,
                balance: 1 + Math.random() * 10000,
                password: hashPassword
            });
            res.json({
                message: "account created"
            });
        }
        catch (e) {
            res.status(500).json({
                message: "something went wrong",
                error: e
            });
        }
    });
});
app.get("/api/v1/users", middleware_1.usermiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const thisUserId = req.body.userId.userId;
        try {
            const users = yield db_1.User.find({ _id: { $ne: thisUserId } });
            const usersData = users.map((users) => ({
                name: users.firstName + " " + users.lastName,
                accountNumber: users._id.toString()
            }));
            res.json({ data: usersData });
        }
        catch (e) {
            res.status(500).json({
                message: "Something went wrong",
                error: e
            });
        }
    });
});
app.get("/api/v1/balance", middleware_1.usermiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.userId.userId;
        const password = req.query.password;
        try {
            const account = yield db_1.Account.findOne({ userId: userId });
            if (!account) {
                res.status(404).json({ message: "Account not found" });
                return;
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, account.password);
            if (!passwordMatch) {
                res.status(401).json({ message: "Incorrect password" });
                return;
            }
            res.json({ balance: account.balance });
        }
        catch (e) {
            res.status(500).json({
                message: "Something went wrong",
                error: e
            });
        }
    });
});
app.post("/api/v1/transaction", middleware_1.usermiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { amount, to, password } = req.body;
        const userId = req.body.userId.userId;
        try {
            const account = yield db_1.Account.findOne({ userId: userId });
            if (!account) {
                res.status(404).json({ message: "Account not found" });
                return;
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, account.password);
            if (!passwordMatch) {
                res.status(401).json({ message: "Incorrect password" });
                return;
            }
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            if (account.balance < amount) {
                yield session.abortTransaction();
                res.status(400).json({ message: "Insufficient balance" });
                return;
            }
            const toAccount = yield db_1.Account.findOne({ userId: to }).session(session);
            if (!toAccount) {
                yield session.abortTransaction();
                res.status(400).json({ message: "Invalid recipient account" });
                return;
            }
            yield db_1.Account.updateOne({ userId: userId }, { $inc: { balance: -amount } }).session(session);
            yield db_1.Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
            yield db_1.Transaction.create([{ from: userId, to: to, amount: amount }], { session });
            yield session.commitTransaction();
            res.json({ message: "Transfer successful" });
        }
        catch (e) {
            res.status(500).json({
                message: "Something went wrong",
                error: e
            });
        }
    });
});
app.get("/api/v1/transactionHistory", middleware_1.usermiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = req.body.userId.userId;
        try {
            const transactionHistory = yield db_1.Transaction.find({ from: req.body.userId.userId }).sort({ createdAt: -1 });
            res.json(transactionHistory);
        }
        catch (e) {
            res.status(500).json({
                message: "something went wrong",
                error: e
            });
        }
    });
});
app.listen(3001, () => {
    console.log("listening on port 3001");
});
