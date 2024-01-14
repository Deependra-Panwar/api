import mongoose, { Schema } from "mongoose";

const transactionSchema =  mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ['deposit', 'withdrawal', 'gamePlay','Gamewin'],
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    },
    transactionId: {
        type: String,
    },
    utrNumber: {
        type:String,
    }
});

const walletSchema = new mongoose.Schema({
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
