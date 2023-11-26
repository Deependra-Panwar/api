import express from 'express';
import { getGameResult, getParticipantUserGroupedDataWithDetailsAndAmountPut, getUserByemail, participantUser } from '../controllers/participantsUser.controller.js';
const router = express.Router();

//participantuser for game register
router.post("/participantUser",participantUser);

//participantUser for user
router.get("/getGameResult",getGameResult)

//getparticipantsUser by game id
router.get('/getParticipantUser/:gameId',getParticipantUserGroupedDataWithDetailsAndAmountPut)

router.get('/getUserByemail/:email',getUserByemail)

export default router;