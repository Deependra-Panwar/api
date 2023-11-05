import mongoose, { Schema } from "mongoose";

const complainSchema = mongoose.Schema(
    {
    complainId:{
        type:String,
        required:true,
        unique:true,
    },
    complainUser:{
        type:String,
        required:true,
    },
    compalain:{
        type:String,
        required:true
    },
    complainStatus:{
        type:String,
        required:true
    },
},
{
    timestamps: true
}
)
export default mongoose.model("complain", complainSchema);