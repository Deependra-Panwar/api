import mongoose, { Schema } from "mongoose";

const withdrawalSchema = mongoose.Schema(
    {
    requestId:{
        type:Number,
        required:true,
        unique:true,
    },
    requestNumber:{
        type:String,
        required:true,
    },
    ammount:{
        type:Number,
        required:true
    },
    requestStatus:{
        type:Number,
        required:true
    },
},
{
    timestamps: true
}
)
export default mongoose.model("withdrawal", withdrawalSchema);