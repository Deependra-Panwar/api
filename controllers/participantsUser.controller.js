import ParticipantsUser from "../models/ParticipantsUser.js";
import Game from '../models/Game.js';
import GameResult from '../models/gameResult.js';
import { createError } from '../utills/error.js';
import { createSuccess } from '../utills/success.js';

export const participantUser = async (req, res, next) => {
    const gameId = req.body.gameId;
    const username = req.body.username;
    // Check if a document with the same gameId and username already exists
    const existingParticipantsUser = await ParticipantsUser.findOne({
        username: username,
        gameId: gameId,
    });
    console.log(existingParticipantsUser)
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

export const getParticipantUserGroupedDataWithDetailsAndAmountPut = async (req, res, next) => {
    const gameId = req.params.gameId;
    const gameData = await getAllGameDataByGameId(gameId);
    const groupedData = await groupGameDataBySelection(gameData);
    const totalAmountBySelection = await calculateTotalAmountBySelection(gameId,groupedData);
 // const GameResultstatus = insertGameResultData(gameId,totalAmountBySelection);
    const totalAmountcollectinAGame = sumAmountPutForAllSections(groupedData); 
    const gameEarning = calculateEarning(totalAmountBySelection,totalAmountcollectinAGame);
    const participantUsercount = gameData.length;
   // const insertGameDatas=insertGameData(gameId,participantUsercount,totalAmountBySelection, totalAmountcollectinAGame,gameEarning)
   // console.log('gameEarning',insertGameDatas)    
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

export const groupGameDataBySelection = (gameData) => {
    const groupedData = {};

    // Loop through the gameData and group it by the "selection" field
    gameData.forEach((data) => {
        const selection = data.selection;

        if (!groupedData[selection]) {
            groupedData[selection] = [];
        }

        groupedData[selection].push(data);
    });

    return groupedData;
};

export const calculateTotalAmountBySelection = (gameId, groupedData) => {
    const totalAmountBySelection = {};
    let lowestAmount = Number.MAX_VALUE;
    let winner = '';
    
    // Calculate values for selectionTen, selectionTwelve, and selectionEleven
    let selectionTen = 0;
    let selectionTwelve = 0;
    let selectionEleven = 0;

    for (let selection = 0; selection <= 12; selection++) {
        const data = groupedData[selection] || [];
        const totalAmount = data.reduce((total, item) => total + item.amountput, 0);
        if (selection === 10) {
            selectionTen = totalAmount * 1.5;
        }
        if (selection === 11) {
            selectionEleven = totalAmount * 4.5;
        }
        if (selection === 12) {
            selectionTwelve = totalAmount * 1.5;
        }
    }

    for (let selection = 0; selection <= 12; selection++) {
        const data = groupedData[selection] || [];
        const totalAmount = data.reduce((total, item) => total + item.amountput, 0);

        // Apply multipliers based on selection
        let multiplier = 1; // Default multiplier
        if (selection >= 0 && selection <= 9) {
            multiplier = 9; // Multiplier for selections 0-9
        } else if (selection === 10 || selection === 12) {
            multiplier = 1.5; // Multiplier for selections 10 and 12
        } else if (selection === 11) {
            multiplier = 4.5; // Multiplier for selection 11
        }
        // Calculate adjusted total amount
        let adjustedTotalAmount = totalAmount * multiplier;

        // Update totalAmountBySelection based on the selection
        if (selection === 1 || selection === 3 || selection === 7 || selection === 9) {
            adjustedTotalAmount += selectionTen;
        } else if (selection === 2 || selection === 4 || selection === 6 || selection === 8) {
            adjustedTotalAmount += selectionTwelve;
        } else if (selection === 0 || selection === 5) {
            adjustedTotalAmount += selectionEleven;
        }

        totalAmountBySelection[selection] = adjustedTotalAmount;

        // Check if this section has the lowest amount so far
        if (selection >= 0 && selection <= 9 && adjustedTotalAmount < lowestAmount && adjustedTotalAmount >= 10) {
            lowestAmount = adjustedTotalAmount;
            winner = selection.toString();
        }
    }

    if (lowestAmount < 10) {
        lowestAmount = null;
        winner = null;
    }

    return {
        gameId,
        totalAmountBySelection,
        lowestAmount,
        winner
    };
};

export const insertGameResultData = async (gameId, result) => {
    try {
        const {
            totalAmountBySelection,
            winner,
        } = result;

        const newGameResult = new GameResult({
            game_id: gameId,
            zero: totalAmountBySelection[0] || 0,
            one: totalAmountBySelection[1] || 0,
            two: totalAmountBySelection[2] || 0,
            three: totalAmountBySelection[3] || 0,
            four: totalAmountBySelection[4] || 0,
            five: totalAmountBySelection[5] || 0,
            six: totalAmountBySelection[6] || 0,
            seven: totalAmountBySelection[7] || 0,
            eight: totalAmountBySelection[8] || 0,
            nine: totalAmountBySelection[9] || 0,
            ten: totalAmountBySelection[10] || 0,
            eleven: totalAmountBySelection[11] || 0,
            twelve: totalAmountBySelection[12] || 0,
            winner: winner,
        });

        await newGameResult.save();
        console.log('GameResult data inserted successfully');
    } catch (error) {
        console.error('Error while inserting gameResult data:', error);
    }
};

export const sumAmountPutForAllSections = (groupedData) => {
    const totalAmount = Object.values(groupedData).reduce((total, sectionData) => {
        sectionData.forEach((item) => {
            total += item.amountput;
        });
        return total;
    }, 0);

    return totalAmount;
};

export const calculateEarning = (totalAmountBySelection, totalAmountcollectinAGame) => {
    const priceGivenAmmount = totalAmountBySelection.lowestAmount;
    const participantput = totalAmountcollectinAGame;
    let earning; // Declare as let, not const

    try {
        earning = participantput - priceGivenAmmount;
    } catch (error) {
        // Handle the error appropriately, if needed
        console.error('Error calculating earning:', error);
    }

    return earning;
};

const insertGameData = async (gameId, participantUsercount, totalAmountBySelection, totalAmountcollectinAGame,gameEarning) => {
    try {
        const game = new Game({
            gameId: gameId,
            participantUsercount: participantUsercount,
            totalAomountCollect:totalAmountcollectinAGame,
            priceGiven: totalAmountBySelection.lowestAmount,
            colorWin: totalAmountBySelection.winner,
            earning: gameEarning,
        });

        await game.save();
        console.log('Game data inserted successfully');
    } catch (error) {
        console.error('Error while inserting game data:', error);
    }
};

