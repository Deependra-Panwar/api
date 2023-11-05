import express from 'express';
import { getParticipantUserGroupedDataWithDetailsAndAmountPut, participantUser } from '../controllers/participantsUser.controller.js';
const router = express.Router();

//participantuser for game register
router.post("/participantUser",participantUser);

//getparticipantsUser
router.get('/getParticipantUser/:gameId',getParticipantUserGroupedDataWithDetailsAndAmountPut)
export default router;