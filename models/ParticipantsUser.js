import mongoose, { Schema } from "mongoose";

const ParticipantsUserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        gameId: {
            type: String,
            required: true,
        },
        amountput: {
            type: Number,
            required: true,
        },
        selection: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model("ParticipantsUser", ParticipantsUserSchema);