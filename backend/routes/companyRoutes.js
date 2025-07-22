import express from 'express';
import { registerCompany, getCompany, getCompanyById, updateCompany } from '../controllers/companyController.js';
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post('/register', isAuthenticated, registerCompany);
router.get('/get', isAuthenticated, getCompany);
router.get('/get/:id', isAuthenticated, getCompanyById);
router.put('/update/:id', isAuthenticated, updateCompany);

export default router;