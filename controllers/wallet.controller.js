import user from "../models/wallet.js";

export const Deposit = async(req, res, next)=>{
    try {
        const { username, amount } = req.body;

        // Find the user by their username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user's balance and add a deposit transaction
        user.wallet.balance += amount;
        user.wallet.transactions.push({
            amount,
            type: 'deposit'
        });

        // Save the updated user
        await user.save();

        return res.status(200).json({ message: 'Deposit successful' });
        } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
        }
};

export const withdrawal = async(req, res, next)=>{
    try {
        const { username, amount } = req.body;
    
        // Find the user by their username
        const user = await User.findOne({ username });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Check if the user has sufficient balance for withdrawal
        if (user.wallet.balance < amount) {
          return res.status(400).json({ message: 'Insufficient balance' });
        }
    
        // Update user's balance and add a withdrawal transaction
        user.wallet.balance -= amount;
        user.wallet.transactions.push({
          amount,
          type: 'withdrawal'
        });
    
        // Save the updated user
        await user.save();
    
        return res.status(200).json({ message: 'Withdrawal successful' });
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
};

export const balance = async( req,res,next)=>{
    try {
        const { username } = req.query;
    
        // Find the user by their username and return the balance
        const user = await User.findOne({ username });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        return res.status(200).json({ balance: user.wallet.balance });
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
};
export const transactions = async(req,res,next)=>{
    try {
        const { username } = req.query;
    
        // Find the user by their username and return the transaction history
        const user = await User.findOne({ username });
    
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        return res.status(200).json({ transactions: user.wallet.transactions });
      } catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
      }
}