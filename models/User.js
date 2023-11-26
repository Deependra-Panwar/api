import mongoose, { Schema } from "mongoose";

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        mobileNumber: {
            type: Number,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        recommendationCode: {
            type: String,
        },
        privacyPolicy:{
            type:Boolean,
            required:true
        },
        userStatus:{
            type:String,
            required:true,
            default:'active'
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        roles: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: 'Role'
        },
        wallet: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Wallet'
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", UserSchema);
