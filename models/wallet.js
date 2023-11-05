import mongoose, { Schema } from "mongoose";

const transactionSchema =  mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'transfer'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const walletSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    wallet: {
        balance: {
            type: Number,
            default: 0
        },
        transactions: [transactionSchema]
    }
});

export default mongoose.model('wallet', walletSchema);
