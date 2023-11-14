import express from 'express';
import { adminGetAllGameWinnerList, adminGetAllParticipantList, admindeleteById, admingetAllUsers, adminupdateById } from '../controllers/admin.controller.js';

const router = express.Router();

                                                //admin User Tab
//admin  getall user
router.get('/allUser',admingetAllUsers);
router.delete('/deleteUser/:id',admindeleteById);
router.put('/updateUser/:id',adminupdateById);



                                                //admin Participant Tab
//admin get participantUserList
router.get('/getAllParticipantList',adminGetAllParticipantList)


                                                //admin game Tab
//getAllGameWinnerList
router.get('/getAllGameWinnerList',adminGetAllGameWinnerList)





export default router;