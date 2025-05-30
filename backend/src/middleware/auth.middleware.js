import { User } from "../models/User.js";
import jwt from "jsonwebtoken"
export const protectRoute=async(req ,res ,next)=>{

    try {
        const token=req.cookies.jwt

        if(!token) return res.status(401).json({message:"Unauthorized access"})


        const decode=jwt.verify(token,process.env.JWT_SECRET_KEY)
        if(!decode){
            return res.status(401).json({message:"Unauthorized access"})
        }

        const user=await User.findById(decode.userId).select("-password")
        if(!user){
                        return res.status(401).json({message:"Unauthorized - User not found"})

        }

        req.user=user
        next()
        
    } catch (error) {
        console.log("Error in protectRoute",error);
        
        res.status(500).json({message:"Internal Server Error"})

        
    }
}