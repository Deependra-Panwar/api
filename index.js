import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import roleRoute from './routes/role.js';
import authRoute from './routes/auth.js';
import userRoute from './routes/user.js';
import gameRoute from './routes/game.js';
import walletRoute from './routes/wallet.js';
import adminRoute from './routes/admin.js';
import participantsUserRoute from './routes/participantsUser.js';
import gameResultRoute from './routes/gameResult.js';
import cookieParser from 'cookie-parser';
import CountdownService from './controllers/countDown.controller.js';
import GameIdService from './controllers/gameId.controller.js';
import http from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
const app =express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
const countdownService = new CountdownService();
const gameIdService = new GameIdService();

const server =http.createServer(app);
const io = new Server(server,{
    cors:{
        origin:true,
        credentials:true,
    },
    allowEIO3:true
});


app.use("/api/role",roleRoute);
app.use("/api/auth",authRoute);
app.use("/api/participantsUser",participantsUserRoute);
app.use("/api/user",userRoute);
app.use("/api/game",gameRoute);
app.use("/api/gameResult",gameResultRoute);
app.use("/api/wallet",walletRoute);
app.use("/api/admin",adminRoute);

// socket.io

io.on("connection",(socket)=>{
    console.log("A new user is connected", socket.id)
    socket.emit("hello","world");
   const intervalEmitter = setInterval(() => {
    const intervalTime = countdownService.getTime();
    const gameid = countdownService.GAMEID;
    socket.emit('gameId', gameid)
    socket.emit('intervalTime', intervalTime,gameid);
  }, 1000);
    const isLast30Seconds =countdownService.isLast30Seconds();
    socket.emit('islast30second', isLast30Seconds);
})


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

server.listen(3000, ()=>{
    connectMangoDB();
    console.log('connected to backend');
})