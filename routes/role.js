import  express  from "express";
import { DeleteRole, createRole, getAllRoles, updateRole } from "../controllers/role.controller.js";
import { verifyAdmin } from "../utills/verifyToken.js";

const router =express.Router();

//Create a new Role in DB
router.post('/create',verifyAdmin, createRole);

//update role in DB
router.put('/update/:id',verifyAdmin, updateRole);

//Get all  the roles from DB
router.get('/getAll',verifyAdmin, getAllRoles);

//update role in DB
router.put('/delete/:id',verifyAdmin, DeleteRole);


export default router;