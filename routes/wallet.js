
import express from "express";
import { Deposit, withdrawal, balance, transactions } from "../controllers/wallet.controller.js";

const router =express.Router();
// Deposit route
router.post('/deposit',Deposit);

// Withdrawal route
router.post('/withdraw',withdrawal);

// Get balance route
router.get('/balance', balance);

// Get transaction history route
router.get('/transactions',transactions);

export default router;
