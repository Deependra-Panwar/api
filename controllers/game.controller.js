export const insertGameResults = async (req, res, next) => {
    try {
        // Here, you can use the global variables to insert the data into the Game collection
        const newGame = new Game({
            gameId: sectionWin, // Example, you can modify this as needed
            participantUserCount: totalParticipantCount,
            totalAmountCollect: totalAmountCollect,
            priceGiven: "Example Price", // Example, replace with your data
            colorWin: sectionWithLowestAmountPut,
            earning: earning,
        });

        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (error) {
        console.error(error);
        return next(error);
    }
};