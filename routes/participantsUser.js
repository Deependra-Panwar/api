import express from 'express';
import { getAllGameDataByGameId, participantUser } from '../controllers/participantsUser.controller.js';
const router = express.Router();

//participantuser for game register
router.post("/participantUser",participantUser);


//getparticipantsUser by game id
router.get('/getParticipantUser/:gameId',getAllGameDataByGameId)


export default router;