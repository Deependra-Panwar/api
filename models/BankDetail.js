import mongoose, { Schema } from "mongoose";

const bankDetailSchema = mongoose.Schema(
    {
    bankName:{
        type:String,
        required:true,   
    },
    accountNumber:{
        type:Number,
        required:true,
        unique:true,
    },
    ifscCode:{
        type:String,
        required:true
    },
    accountHolderName:{
        type:String,
        required:true
    },
    mobileNumber:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    }
},
{
    timestamps: true
}
)
export default mongoose.model("bankDetail", bankDetailSchema);