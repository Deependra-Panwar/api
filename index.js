import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import gameRoute from './routes/game.js';
import walletRoute from './routes/wallet.js';
import participantsUserRoute from './routes/participantsUser.js';
import gameResultRoute from './routes/gameResult.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app =express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:4200',
    credentials:true
}))
app.use("/api/role",roleRoute);
app.use("/api/auth",authRoute);
app.use("/api/participantsUser",participantsUserRoute);
app.use("/api/user",userRoute);
app.use("/api/game",gameRoute);
app.use("/api/gameResult",gameResultRoute);
app.use("/api/wallet",walletRoute);


// Response Handle Middleware
app.use((obj,req,res,next)=>{
    const statusCode =obj.status || 500; 
    const message = obj.message || "something went wrong!";
    return res.status(statusCode).json({
        status:statusCode,
        success:[201,204].some(a=> a===obj.status)? true : false,
        message:message,
        data:obj.data
    });
});


//Db connection
const connectMangoDB =async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB connected');
    }catch(e){
        console.log('Db not connected',e);
    }
}

app.listen(3000, ()=>{
    connectMangoDB();
    console.log('connected to backend');
})