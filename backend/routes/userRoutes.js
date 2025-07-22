import express from "express";
import { register, login, logout, updateProfile } from '../controllers/userController.js'
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from '../middleware/multer.js';

const router = express.Router();

router.post('/register', singleUpload, register);
router.post('/login', login);
router.get('/logout', logout);
router.put('/profile/update', isAuthenticated, updateProfile);

export default router;