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
        userName: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        emailStatus:{
            type :String,
            required:true,
            default: "unverified"
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
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", UserSchema);
