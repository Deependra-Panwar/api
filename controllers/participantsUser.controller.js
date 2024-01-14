import ParticipantsUser from "../models/ParticipantsUser.js";
import Game from '../models/Game.js';
import GameResult from '../models/gameResult.js';
import { createError } from '../utills/error.js';
import { createSuccess } from '../utills/success.js';
import User from "../models/User.js";
import wallet from '../models/wallet.js';

export const participantUser = async (req, res, next) => {
    const gameId = req.body.gameId;
    const username = req.body.username;
    // Check if a document with the same gameId and username already exists
    const existingParticipantsUser = await ParticipantsUser.findOne({
        username: username,
        gameId: gameId,
    });
    if (!existingParticipantsUser) {
        // No existing document found, so you can insert the new user
        const newParticipantsUser = new ParticipantsUser({
            gameId: gameId,
            username: username,
            amountput: req.body.amountput,
            selection: req.body.selection,
        });

        try {
            await newParticipantsUser.save();
            return next(createSuccess(200, "User has been added successfully."));
        } catch (error) {
            console.log(error)
            return next(createError(500, "Error while saving the user."));
        }
    } else {
        // A document with the same gameId and username already exists
        return next(createSuccess(200, "Can't update for that game as you already applied."));
    }
};

export const getGameResult =async (req,res,next) =>{
    try {
        const gameData = await Game.find({});
        return next(createSuccess(200,"Get all Data",gameData))
    } catch (error) {
        console.error("Error while fetching game data:", error);
        return [];
    }
}
export const getUserByemail = async(req, res,next) =>{
    const {email} =req.params
    console.log(email)
    try{
        const user = await User.findOne({email});
        if(!user){
            return next(createError(400, "User not Found!"));
        }
        return next(createSuccess(200,"Single User",user))
    }catch(error){
        console.log(error)
        return next(createError(500, "Internal Server Error"));
    }
}

export const getParticipantUserGroupedDataWithDetailsAndAmountPut = async (req, res, next) => {
    const gameId = req.params.gameId;
    const gameData = await getAllGameDataByGameId(gameId);
    // const AddWinningAmounts = AddWinningAmount()

    return next(createSuccess(200, "All process done"));
};

export const getAllGameDataByGameId = async (gameId) => {
    try {
        const gameData = await ParticipantsUser.find({ gameId }).exec();
        return gameData;
    } catch (error) {
        console.error("Error while fetching game data:", error);
        return [];
    }
};
//end of getParticipantUserGroupedDataWithDetailsAndAmountPut

