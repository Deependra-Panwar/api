import express from "express";
import { insertGameResults } from "../controllers/game.controller.js";

const router = express.Router();

// Route to insert game results
router.post("/insert", insertGameResults);

export default router;