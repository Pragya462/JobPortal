import express from 'express';
import {postJob, getAllJobs, getJobById, getJobsByAdminId} from '../controllers/jobController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

router.post('/admin/post', isAuthenticated, postJob);
router.get('/getall', isAuthenticated, getAllJobs);
router.get('/get/:id', isAuthenticated, getJobById);
router.get('/admin/getall', isAuthenticated, getJobsByAdminId);

export default router;