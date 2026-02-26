import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import User from "../models/User.js";

dotenv.config()
export const protect = async (req, res, next) =>{
    try {
        let token = req.cookies.token;

        if(!token){
            return res.status(401).json({message:"Not authorized"})
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = await User.findById(decoded.id).select("-password");

            next();
            
        } catch (error) {
            res.status(401).json({message:"Token Invalid"})
        }
    } catch (error) {
        res.status(500).json({message:"Server Error"})
    }
}