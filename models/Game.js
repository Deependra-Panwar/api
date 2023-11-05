import mongoose, { Schema } from "mongoose";

const gameSchema = mongoose.Schema(
    {
        gameId:{
            type:String,
            required:true,
            unique:true,
        },
        participantUsercount:{
            type:Number,
            required:true,
        },
        totalAomountCollect:{
            type:Number,
            required:true
        },
        priceGiven:{
            type:String,
            required:true
        },
        colorWin:{
            type:String,
            required:true
        },
        earning:{
            type:String,
            required:true
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("game", gameSchema);