import { NextFunction,Response,Request } from "express";
import jwt  from "jsonwebtoken";
import { JWT_PASSWORD } from "../config";




export interface ExpressRequest extends Request{
    userId?:string
}

export const authmiddleware=(req:ExpressRequest,res:Response,next:NextFunction)=>{
     const header=req.headers['authorization']
     const token=header?.split(" ")[1]

     if (!token){
        res.status(403).json({
            message:"no auth"
        })
        return
     }
    
      
    try {
        const decode=jwt.verify(token,JWT_PASSWORD) as {id:string}
        req.userId=decode.id
        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({message:"error in auth"})
    }


}
