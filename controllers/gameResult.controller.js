// controllers/gameResult.controller.js
import GameResult from "../models/gameResult.js";

export const insertGameResult = async (req, res, next) => {
  try {
    const { game_id, totalAmountPut } = req.body;

    // Calculate the winner based on the lowest value from 0 to 13
    const winner = Math.min(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13);

    // Create a new game result document
    const newGameResult = new GameResult({
      game_id,
      zero: totalAmountPut[0] || null,
      one: totalAmountPut[1] || null,
      two: totalAmountPut[2] || null,
      three: totalAmountPut[3] || null,
      four: totalAmountPut[4] || null,
      five: totalAmountPut[5] || null,
      six: totalAmountPut[6] || null,
      seven: totalAmountPut[7] || null,
      eight: totalAmountPut[8] || null,
      nine: totalAmountPut[9] || null,
      ten: totalAmountPut[10] || null,
      eleven: totalAmountPut[11] || null,
      twelve: totalAmountPut[12] || null,
      winner,
    });

    // Save the game result
    await newGameResult.save();

    res.status(201).json(newGameResult);
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
