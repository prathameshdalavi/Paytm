import Jwt,{JwtPayload} from "jsonwebtoken";
import { NextFunction,Request,Response } from "express";
const JWT_SECRET_KEY="prathameshdalavi"
function usermiddleware(req:Request,res:Response,next:NextFunction){
    const token=req.headers.token;
    if(typeof token ==="string"){
        const decodedToken=Jwt.verify(token,JWT_SECRET_KEY);
        if(decodedToken){
            req.body.userId=decodedToken
            next();
        }
        else{
            res.status(401).json({
                message:"you are not signed in",
                decodedToken
            })
        }
    }
}
export{JWT_SECRET_KEY,usermiddleware}