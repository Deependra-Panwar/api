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


export const deleteById = async(req,res,next)=>{
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: "User not found" });
        }
        return next(createSuccess(200,"User Deleted Successfully", deletedUser));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}


export const updateById = async(req,res,next) =>{
    try {
        const { username, email, ...restOfUserData } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.email,
            { $set: restOfUserData },
            { new: true }
        );

        if (!updatedUser) {
            return next(createError(500, "Internal Server Error"));
        }

        return next(createSuccess(200,"User update Successfully", updatedUser));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}



