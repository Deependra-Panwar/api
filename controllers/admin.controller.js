import User from '../models/User.js';
import ParticipantsUser from "../models/ParticipantsUser.js";
import GameResult from "../models/gameResult.js";
import { createError } from '../utills/error.js';
import { createSuccess } from '../utills/success.js';
import wallet from '../models/wallet.js';
                                                        //User Tab
//get all user    
export const admingetAllUsers = async(req, res, next)=>{
    try{
        const user = await User.find();
        return next(createSuccess(200,"All Users", user));
    }catch(error){
        return next(createError(500, "Internal Server Error"));
    }
}

//delete user by id
export const admindeleteById = async(req,res,next)=>{
    try {
        const { username  } = req.params;
        const userToDelete = await User.findOne({ username });
        if (!userToDelete) {
            return res.status(404).json({ error: "User not found" });
        }
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);
        return next(createSuccess(200,"Delete user Successfully", deletedUser));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

//update user by id

export const adminupdateById = async(req,res,next) =>{
    try {
        const { username, email, ...restOfUserData } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.email,
            { $set: restOfUserData },
            { new: true }
        );

        if (!updatedUser) {
            return next(createError(500, "Internal Server Error"));
        }

        return next(createSuccess(200,"User update Successfully", updatedUser));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}



                                                        //participantUser list Tab

//get all partcipantUser of a game
export const adminGetAllParticipantList = async (req,res,next) => {
    try {
        const participants = await ParticipantsUser.find({});
        return next(createSuccess(200,"Data Fetched",participants))
    } catch (error) {
        console.error("Error fetching participants:", error);
        throw error;
    }
};


                                                            //game Tab
//get all game winner List
export const adminGetAllGameWinnerList = async (req,res,next) =>{
    try {
        const participants = await GameResult.find({});
        return next(createSuccess(200,"Data Fetched",participants))
    } catch (error) {
        console.error("Error fetching participants:", error);
        throw error;
    }
}
                                                        //Transcation Tab
    
 //get all Wallet Data                                                       

 export const adminGetAllWalletList = async (req,res,next) =>{
    try {
        const Wallet = await wallet.find({});
        return next(createSuccess(200,"Data Fetched",Wallet))
    } catch (error) {
        console.error("Error fetching participants:", error);
        throw error;
    }
}
    

// User approve Deposit in Wallet controller
export const adminApproveDeposit = async (req, res, next) => {
    try {
        const { email, transactionId, requestType } = req.body;
    
        // Find the user by email
        const user = await User.findOne({ email });
        console.log(user.wallet)
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Find the wallet associated with the user
        const Wallet = await wallet.findOne({ _id: user.wallet});

        if (!Wallet) {
          return res.status(404).json({ message: 'Wallet not found' });
        }
        if(requestType === 'deposit'){
             // Find the pending deposit transaction
            const depositTransaction = Wallet.wallet.transactions.find(
                (transaction) => transaction._id.toString() === transactionId && !transaction.approved
            );
        
            if (!depositTransaction) {
                return res.status(404).json({ message: 'Pending deposit transaction not found' });
            }
        
            // Approve the deposit
            depositTransaction.approved = true;
            Wallet.wallet.balance += depositTransaction.amount;
        
            // Save the updated wallet
            await Wallet.save();
        
            return res.status(200).json({ message: 'Deposit approved and added to the balance' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
};

//User approve withdrawal from wallet  controller
export const adminWithdrawalDeposit = async () =>{
    try {
        const { email, transactionId, requestType } = req.body;
    
        // Find the user by email
        const user = await User.findOne({ email });
        console.log(user.wallet)
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Find the wallet associated with the user
        const Wallet = await wallet.findOne({ _id: user.wallet});

        if (!Wallet) {
          return res.status(404).json({ message: 'Wallet not found' });
        }
        if(requestType === 'withdrawal'){
             // Find the pending deposit transaction
            const depositTransaction = Wallet.wallet.transactions.find(
                (transaction) => transaction._id.toString() === transactionId && !transaction.approved
            );
        
            if (!depositTransaction) {
                return res.status(404).json({ message: 'Pending Withdrawal transaction not found' });
            }
        
            // Approve the deposit
            depositTransaction.approved = true;
            Wallet.wallet.balance -= depositTransaction.amount;
        
            // Save the updated wallet
            await Wallet.save();
        
            return res.status(200).json({ message: 'Withdrawal approved and added to the balance' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
}



