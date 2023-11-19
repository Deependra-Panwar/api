import Role from "../models/Role.js";
import User from "../models/User.js";
import UserToken from "../models/userToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { createError } from '../utills/error.js';
import { createSuccess } from '../utills/success.js';
import RegisterToken from "../models/RegisterToken.js";
import wallet from "../models/wallet.js";

export const register = async (req,res,next)=>{
    const role = await Role.find({role:'User'});
    const salt = await bcrypt.genSalt(10);
    const user = await User.findOne({email: req.body.email}).populate("roles","role")
    const hashpassword = await bcrypt.hash(req.body.password,salt);
    if(!user){
        const newWallet = new wallet({
            email: req.body.email,
            balance: 0,
            transactions: []
        });
        
        const savedWallet = await newWallet.save()
        const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:hashpassword,
            mobileNumber:req.body.mobileNumber,
            privacyPolicy:req.body.privacyPolicy,
            userStatus:req.body.userStatus,
            recommendationCode:req.body.recommendationCode,
            roles:role,
            wallet: savedWallet._id
        });
        await newUser.save();
        return next(createSuccess(200,"User Registration successfully!"));
    }else{
        return next(createError(401,"User already Register"));
    }
    
};
export const login = async (req,res, next)=>{
    try{
        const user = await User.findOne({email: req.body.email}).populate("roles","role");
        const {roles} = user;
        console.log(user)
        if(!user){
            return next(createError(400,"User not found!"))
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        console.log(isPasswordCorrect);
        if(!isPasswordCorrect){
            return next(createError(400, "Password is Incorrect"))
        }
        // if(user.emailStatus === 'unverified'){
        //     return next(createError(400, "Email is not verfied  yet"))
        // }
        const token =jwt.sign(
            {id:user._id, isAdmin:user.isAdmin, roles:roles},
            process.env.JWT_SECRET  
        )
        res.cookie("access_token",token, {httpOnly: true})
        .status(200)
        .json({
            status:200,
            message:"Login success",
            data:user
        })
    }catch(error){
        return next(createError(500,"Something went wrong!"))
    }   
};
export const registerAdmin = async (req,res,next)=>{
    const role = await Role.find({});
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(req.body.password,salt);
    const newUser = new User({
        firstName:req.body.firstName,
        lastName:req.body.lastName ,
        username:req.body.username,
        email:req.body.email,
        password:hashpassword,
        isAdmin:true,
        mobileNumber:req.body.mobileNumber,
        roles:role
    });
    await newUser.save();
    return next(createSuccess(200,"User Registration successfully!"));
};

export const generateVerificationCode =(()=>{
    return Math.floor(100000 + Math.random() * 900000).toString();
});

export const registerSendEmail =async(req,res,next) =>{
    
    const email = req.body.email;
    const user = await User.findOne({email: req.body.email}).populate("roles","role")
    if(!user){
        const verifyCode = await generateVerificationCode();

    // Save user and verification code to the database
    const newUser = new RegisterToken({
      email:email,
      VerificationCode:verifyCode,
      isVerified: false,
    });
    const mailTransporter  = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"codewithdeeptech@gmail.com",
            pass:"ffbx lrqv xfxm bhyq"
        }
    });
    let mailDetails ={
        form: "codewithdeeptech@gmail.com",
        to:email,
        subject:"Reset Password!",
        html:`
<html>
        <head>
            <title>Password Reset Request</title>
        </head>
        <body>
            <h1>Password Reset Request</h1>
            <p>We have received to reset your password for your account with Game. To complete the password reset process, please click on the button below: </p>
           <h1>${verifyCode}</h1>
            <p>Please note that this link is only valid for 5 mins. If you did not request a password reset, please disregard this message</p>
            <p>Thank You,</p>
            <p>Game Team </p>
        </body>
</html>
        `,
    };
    mailTransporter.sendMail(mailDetails, async(err, data)=>{
        if(err){
            console.log(err);
            return next(createError(500,"Internal Server error" )) 
        }else{
            await newUser.save();
            return next(createSuccess(200,"Mail Sent Successfully!"));
        }
    })
    }else{
        return next(createError(401,"User already Register"));
    }
    
    
}

export const VerifyEmail = async(req,res,next) =>{
    const { email, code } = req.body;
    console.log(email,code )
    const user = await RegisterToken.findOne({ email });
    const register =await User
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(user.VerificationCode)
    if (user.VerificationCode === code) {
      // Update user status to verified
      user.isVerified = true;
      await user.save();

      res.json({ message: 'Email verified successfully' });
    } else {
      res.status(401).json({ message: 'Invalid verification code' });
    }
}


export const sendEmail = async(req ,res, next)=>{
    const email = req.body.email;
    console.log(email);
    const user = await User.findOne({email:{$regex:'^'+email+'$', $options:'i'}});
    if(!user){
        return next(createError(404,"User is not Found to send the Email"))
    }
    const payload ={
        email:user.email
    }
    const expiryTime = 300
    const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:expiryTime});

    const newToken =new UserToken({
        userId: user._id,
        token:token 
    })
    
    const mailTransporter  = nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:"codewithdeeptech@gmail.com",
            pass:"ffbx lrqv xfxm bhyq"
        }
    });
    let mailDetails ={
        form: "codewithdeeptech@gmail.com",
        to:email,
        subject:"Reset Password!",
        html:`
<html>
        <head>
            <title>Password Reset Request</title>
        </head>
        <body>
            <h1>Password Reset Request</h1>
            <p>Dear ${user.name},</p>
            <p>We have received to reset your password for your account with Game. To complete the password reset process, please click on the button below: </p>
            <a href=${process.env.LIVE_URL}/reset/${token}><button style ="background-color:#4CAF50; color:white; padding:14px 20px; border:none; cursor:pointer; border-radius:4px;">Reset Password</button></a>
            <p>Please note that this link is only valid for 5 mins. If you did not request a password reset, please disregard this message</p>
            <p>Thank You,</p>
            <p>Game Team </p>
        </body>
</html>
        `,
    };
    try{
        await mailTransporter.sendMail(mailDetails, async(err, data)=>{
            if(err){
                console.log(err);
                return next(createError(500,"Something went wrong while sending the email")) 
            }else{
                await newToken.save();
                return next(createSuccess(200,"Mail Sent Successfully!"));
            }
        })
    }
    catch(err){
        console.log(err)
    }
    
};

export const resetPassword =(req,res,next)=>{
    const token =req.body.token;
    const newPassword =req.body.password;
    jwt.verify(token,process.env.JWT_SECRET,async(err,data)=>{
        if(err){
            return next(createError(500,"Reset link expired!"))
        }else{
            const response =data;
            const user = await User.findOne({email:{$regex:'^'+response.email+'$', $options:'i'}});
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(newPassword,salt);
            user.password =encryptedPassword;
            try{
                const updatedUser =await User.findOneAndUpdate(
                    {_id: user._id},
                    {$set: user},
                    {new: true}
                )
                return next(createSuccess(200,"password Reset successfully!"));
            }catch(error){
                return next(createError(500,"Something went wrong while creating password"))
            }
        }
    }) 
}