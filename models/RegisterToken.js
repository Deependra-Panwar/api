import mongoose, { Schema } from "mongoose";
const  RegisterTokenSchema = mongoose.Schema(
    {
       email:{
            type:String,
            required:true,
        },
        VerificationCode:{
            type: String,
            required: true
        },
        createAt:{
            type:Date,
            default:Date.now,
            expires:300
        },
        isVerified:{
            type:Boolean
        }
    }
);

export default mongoose.model("RegisterToken",RegisterTokenSchema);