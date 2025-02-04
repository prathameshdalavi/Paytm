"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET_KEY = void 0;
exports.usermiddleware = usermiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET_KEY = "prathameshdalavi";
exports.JWT_SECRET_KEY = JWT_SECRET_KEY;
function usermiddleware(req, res, next) {
    const token = req.headers.token;
    if (typeof token === "string") {
        const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET_KEY);
        if (decodedToken) {
            req.body.userId = decodedToken;
            next();
        }
        else {
            res.status(401).json({
                message: "you are not signed in",
                decodedToken
            });
        }
    }
}
