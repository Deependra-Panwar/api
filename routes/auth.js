import express from 'express';
import { login, register, registerAdmin, resetPassword, sendEmail } from '../controllers/auth.controller.js';

const router = express.Router();

//register
router.post("/register",register);
//login
router.post("/login",login);
// register as an admin
router.post("/register-admin",registerAdmin)
//send forget mail end point
router.post("/send-email", sendEmail)
//reset password
router.post('/reset-password',resetPassword)
export default router;