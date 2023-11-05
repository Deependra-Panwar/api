import mongoose, { Schema } from "mongoose";

const referralSchema = mongoose.Schema(
    {
    referralId:{
        type:String,
        required:true,
    },
    userComefromreferId:{
        type:String,
        required:true,
    },
    ammount:{
        type:Number,
        required:true
    },
    amountStatus:{
        type:String,
        required:true
    },
},
{
    timestamps: true
}
)
export default mongoose.model("referral", referralSchema);