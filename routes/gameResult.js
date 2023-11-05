// routes/gameResult.route.js
import express from "express";
import { insertGameResult } from "../controllers/gameResult.controller.js";

const router = express.Router();

router.post("/gameResult", insertGameResult);

export default router;
