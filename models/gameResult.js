import mongoose from "mongoose";

const gameResultSchema = mongoose.Schema(
  {
    game_id: {
      type: String,
      required: true,
      unique: true,
    },
    zero: { type: Number, required: true },
    one: { type: Number, required: true },
    two: { type: Number, required: true },
    three: { type: Number, required: true },
    four: { type: Number, required: true },
    five: { type: Number, required: true },
    six: { type: Number, required: true },
    seven: { type: Number, required: true },
    eight: { type: Number, required: true },
    nine: { type: Number, required: true },
    ten: { type: Number, required: true },
    eleven: { type: Number, required: true },
    twelve: { type: Number, required: true },
    winner: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("GameResult", gameResultSchema);
