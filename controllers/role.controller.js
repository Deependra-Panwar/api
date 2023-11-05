import  Role from "../models/Role.js";
import { createError } from "../utills/error.js";
import { createSuccess } from "../utills/success.js";

export const createRole = async(req,res,next)=>{
    try{
        if(req.body.role && req.body.role !== ''){
            const newRole =new Role(req.body);
            await newRole.save();
            return next(createSuccess(200,"Role Created"));
        }else{
            return next(createError(400,"Bad Request"));
        }
    } catch(error){
        return next(createError(500,"Internal Server Error"));
    }
}

export const updateRole = async(req,res,next)=>{
    try{
        const role = await Role.findById({_id:req.params.id});
        if(role){
            const newData = await Role.findByIdAndUpdate(
                req.params.id,
                {$set:req.body},
                {new:true}
                );
                return next(createSuccess(200,"Role updated"));
        }else{
            return next(createError(404,"Role not updated!"));
        }
    }catch(error){
        return next(createError(500,"Internal Server Error"));
    }
}

export const getAllRoles = async(req,res,next)=>{
    try{
        const roles = await Role.find()
        return next(createSuccess(200,"Get all data",roles));
    }catch(error){
        return next(createError(500,"Internal Server Error"));
    }
}

export const DeleteRole = async(req,res,next)=>{
    try{
        const roleId = req.parms.id;
        const role = await Role.findById({_id:roleId})
        if(role){
            await Role.findByIdAndDelete(roleId);
            return next(createSuccess(200, "Role Deleted"));
        }else{
            return next(createError(404,"Role Not Found")); 
        }    
    }catch(error){
        return next(createError(500,"Internal Server Error"));
    }
}