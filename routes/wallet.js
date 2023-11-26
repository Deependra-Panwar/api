
import express from "express";
import { Deposit, withdrawal, balance, transactions, deducteAmount } from "../controllers/wallet.controller.js";

const router =express.Router();
// Deposit route
router.post('/deposit',Deposit);

// Withdrawal route
router.post('/withdrawal',withdrawal);

// Get balance route
router.post('/balance', balance);

// Get transaction history route
router.post('/transactions',transactions);

//deductionamount on game play
router.post('/deduction',deducteAmount)

export default router;
