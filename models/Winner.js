import mongoose, { Schema } from "mongoose";

const winnerSchema = mongoose.Schema(
    {
    gameId:{
        type:String,
        required:true,
        unique:true,
    },
    winnerId:{
        type:String,
        required:true,
    },
    ammountPut:{
        type:Number,
        required:true
    },
    ammountGiven:{
        type:Number,
        required:true
    },
    ammountBeforeGame:{
        type:Number,
        required:true
    },
    ammountAfterGame:{
        type:Number,
        required:true
    }
},
{
    timestamps: true
}
)
export default mongoose.model("winner", winnerSchema);