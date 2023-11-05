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
        recommendationCode: {
            type: String,
        },
        privacyPolicy:{
            type:Boolean,
            required:true
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
