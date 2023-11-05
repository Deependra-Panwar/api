import User from "../models/User.js";
import { createError } from "../utills/error.js"
import { createSuccess } from "../utills/success.js";

export const getAllUsers = async(req, res, next)=>{
    try{
        const user = await User.find();
        return next(createSuccess(200,"All Users", user));
    }catch(error){
        return next(createError(500, "Internal Server Error"));
    }


}
export const getById = async(req, res, next)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return next(createError(400, "User not Found!"));
        }
        return next(createSuccess(200,"Single User",user))
    }catch(error){
        return next(createError(500, "Internal Server Error"));
    }
}