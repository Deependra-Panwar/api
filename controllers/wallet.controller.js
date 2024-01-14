import User from "../models/User.js";
import Wallet from "../models/wallet.js";
import { createError } from "../utills/error.js";
import { createSuccess } from "../utills/success.js";

export const Deposit = async(req, res, next)=>{
  try {
    const { email, amount, transactionId , utrNumber } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    // Assuming the user has a wallet associated (make sure to set this ID when creating a user)
    const wallet = await Wallet.findOne({ _id: user.wallet });
    if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found' });
    }
            // Ensure the transactions array is initialized and is an array
            wallet.wallet.transactions = wallet.wallet.transactions || [];
            wallet.wallet.transactions.push({
                amount,
                type: 'deposit',
                approved: false,
                transactionId,
                utrNumber
            });
    // Save the updated wallet
   await wallet.save();

    return res.status(200).json({ message: 'Deposit successful' });
} catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Internal server error' });
}

  
};
export const withdrawal = async(req, res, next)=>{
    try {
        const { email, amount } = req.body;
        // Find the user by their username
        const user = await User.findOne({ email });
        if (!user) {
          return next(createError(404,"User not Found"));
        }
    
        const wallet = await Wallet.findOne({ _id: user.wallet });
        console.log('wallet',wallet)
        if (!wallet) {
          return next(createError(404,"Wallet not Found"));
        }
        // Check if the user has sufficient balance for withdrawal
        if (wallet.wallet.balance > amount) {
            // Ensure the transactions array is initialized and is an array
            wallet.wallet.transactions = wallet.wallet.transactions || [];
            wallet.wallet.transactions.push({
                amount,
                type: 'withdrawal',
                approved: false
            });
             // Save the updated wallet
       await wallet.save();
       return res.status(200).json({ message: 'Withdrawal Request successfully' });
        }else{
          return next(createError(400,"Insufficient balance"));
        }
      } catch (error) {
        console.log(error)
        return next(createError(500,"Internal Server Error!"));
      }
};
export const balance = async( req,res,next)=>{
    try {
        const { email } = req.body;
    
        // Find the user by their username and return the balance
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        const wallet = await Wallet.findOne({ _id: user.wallet });
        
        return next(createSuccess(200,"Fetched Successfully",{balance: wallet.wallet.balance}))
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
};
export const transactions = async(req,res,next)=>{
  try {
    const { email } = req.body;

    // Find the user by their username and return the balance
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const wallet = await Wallet.findOne({ _id: user.wallet });
    
    return next(createSuccess(200,"Fetched Successfully",{balance: wallet.wallet.transactions}))
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export const deducteAmount = async(req, res, next)=>{
  try {
      const { email, amount } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return next(createError(404,"User not Found"));
      }
      const wallet = await Wallet.findOne({ _id: user.wallet });
      if (!wallet) {
        return next(createError(404,"Wallet not Found"));
      }
          wallet.wallet.balance -= amount;
          wallet.wallet.transactions.push({
              amount,
              type: 'gamePlay',
              approved: true
          });
           // Save the updated wallet
     await wallet.save();
     return next(createSuccess(200,"'Balance Deduction successfully'"));
    } catch (error) {
      console.log(error)
      return next(createError(500,"Internal Server Error!"));
    }
};
