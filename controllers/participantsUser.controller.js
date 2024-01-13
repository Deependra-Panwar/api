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
    const groupedData = await groupGameDataBySelection(gameData);
    const totalAmountBySelection = await calculateTotalAmountBySelection(gameId,groupedData);
    const GameResultstatus = await insertGameResultData(gameId,totalAmountBySelection);
    const totalAmountcollectinAGame = sumAmountPutForAllSections(groupedData); 
    const gameEarning = calculateEarning(totalAmountBySelection,totalAmountcollectinAGame);
    const participantUsercount = gameData.length;
    const insertGameDatas=insertGameData(gameId,participantUsercount,totalAmountBySelection, totalAmountcollectinAGame,gameEarning)
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
        } else if (selection === 0 ) {
            adjustedTotalAmount += (selectionTen + selectionTen);
        }else if(selection === 5){
            adjustedTotalAmount += (selectionTwelve + selectionEleven)
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
    let color = 'white';
    try {
         if(totalAmountBySelection.winner==2 ||totalAmountBySelection.winner==4||totalAmountBySelection.winner==6||totalAmountBySelection.winner==8){
                color='warn';
         }else if(totalAmountBySelection.winner==1 ||totalAmountBySelection.winner==3 ||totalAmountBySelection.winner==7 ||totalAmountBySelection.winner==9 ){
                color ="primary"
         }else if(totalAmountBySelection.winner==0 || totalAmountBySelection.winner== 5 ){
                color = "accent"
         }
        const game = new Game({
            gameId: gameId,
            participantUsercount: participantUsercount,
            totalAomountCollect:totalAmountcollectinAGame,
            priceGiven: totalAmountBySelection.lowestAmount,
            colorWin: totalAmountBySelection.winner,
            color:color,
            earning: gameEarning,
        });

        await game.save();
        console.log('Game data inserted successfully');
    } catch (error) {
        console.error('Error while inserting game data:', error);
    }
};

export const AddWinningAmount = async()=>{
    try {

        const gameIds = 2023123000002;
        const winner = 1;
        if(winner === 1 || winner === 3 || winner === 7 || winner === 9){
          const userList =  await ParticipantsUser.find({gameId:gameIds,  selection: { $in: [winner, 11] }})
          const usernamesAndAmounts = userList.map(user => ({ username: user.username, amountput: user.amountput, selection: user.selection }));
          console.log(usernamesAndAmounts)
          for(const userRecord of usernamesAndAmounts){
            const email = userRecord.username;
            const user = await User.findOne({ email });
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
              }
          
              const Wallet = await wallet.findOne({ _id: user.wallet});
      
              if (!Wallet) {
                return res.status(404).json({ message: 'Wallet not found' });
              }
            let amount = 0;
            user.selection===11 ?amount = userRecord.amountput*2 :amount = userRecord.amountput*9
            console.log('amount', amount)
            Wallet.wallet.balance += amount;

            Wallet.wallet.transactions.push({
                amount,
                type: 'Gamewin',
                approved: true
            });
            await Wallet.save();
          }
          
        }
        else if(winner === 2 || winner === 4 || winner === 6 || winner === 8){
            const userList =  await ParticipantsUser.find({gameId:gameIds,  selection: { $in: [winner, 13] }})
            const usernamesAndAmounts = userList.map(user => ({ username: user.username, amountput: user.amountput, selection: user.selection }));
            console.log(usernamesAndAmounts)
            for(const userRecord of usernamesAndAmounts){
              const email = userRecord.username;
              const user = await User.findOne({ email });
              
              if (!user) {
                  return res.status(404).json({ message: 'User not found' });
                }
            
                const Wallet = await wallet.findOne({ _id: user.wallet});
        
                if (!Wallet) {
                  return res.status(404).json({ message: 'Wallet not found' });
                }
              let amount = 0;
              user.selection===11 ?amount = userRecord.amountput*2 :amount = userRecord.amountput*9
              console.log('amount', amount)
              Wallet.wallet.balance += amount;
  
              Wallet.wallet.transactions.push({
                  amount,
                  type: 'Gamewin',
                  approved: true
              });
              await Wallet.save();
            }
        }
        else if(winner === 0){
            const userList =  await ParticipantsUser.find({gameId:gameIds,  selection: { $in: [winner,11, 12] }})
            const usernamesAndAmounts = userList.map(user => ({ username: user.username, amountput: user.amountput, selection: user.selection }));
            console.log(usernamesAndAmounts)
            for(const userRecord of usernamesAndAmounts){
              const email = userRecord.username;
              const user = await User.findOne({ email });
              
              if (!user) {
                  return res.status(404).json({ message: 'User not found' });
                }
            
                const Wallet = await wallet.findOne({ _id: user.wallet});
        
                if (!Wallet) {
                  return res.status(404).json({ message: 'Wallet not found' });
                }
              let amount = 0;
              if(selection==11){
                amount = userRecord.amountput*1.5
              }else if(selection==12){
                amount = userRecord.amountput*4.5
              }else{
                amount = userRecord.amountput*9
              }
              console.log('amount', amount)
              Wallet.wallet.balance += amount;
  
              Wallet.wallet.transactions.push({
                  amount,
                  type: 'Gamewin',
                  approved: true
              });
              await Wallet.save();
            }
        }else if(winner === 5){ 
            const userList =  await ParticipantsUser.find({gameId:gameIds,  selection: { $in: [winner,12,13] }})
            const usernamesAndAmounts = userList.map(user => ({ username: user.username, amountput: user.amountput, selection: user.selection }));
            console.log(usernamesAndAmounts)
            for(const userRecord of usernamesAndAmounts){
              const email = userRecord.username;
              const user = await User.findOne({ email });
              
              if (!user) {
                  return res.status(404).json({ message: 'User not found' });
                }
            
                const Wallet = await wallet.findOne({ _id: user.wallet});
        
                if (!Wallet) {
                  return res.status(404).json({ message: 'Wallet not found' });
                }
              let amount = 0;
              if(selection==11){
                amount = userRecord.amountput*1.5
              }else if(selection==12){
                amount = userRecord.amountput*4.5
              }else{
                amount = userRecord.amountput*9
              }
              console.log('amount', amount)
              Wallet.wallet.balance += amount;
  
              Wallet.wallet.transactions.push({
                  amount,
                  type: 'Gamewin',
                  approved: true
              });
              await Wallet.save();
            }
        }
      } catch (error) {
        console.log(error)
        // return res.status(500).json({ message: 'Internal server error' });
      }
  };

  const calculateWinningAmount = (amountput, totalAmountBySelection) => {
    // Implement the logic to calculate winning amount based on the user's input and total amount
    // You may use your own calculation formula here
    return /* calculated amount */;
};
//end of getParticipantUserGroupedDataWithDetailsAndAmountPut

