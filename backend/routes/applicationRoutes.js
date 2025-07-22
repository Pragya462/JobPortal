import express from 'express';
import { applyJob, getAppliedJobs, getApplicants, updateStatus} from '../controllers/applicationController.js';
import { isAuthenticated } from '../middleware/isAuthenticated.js';

const router = express.Router();

//to apply to a job
router.get('/apply/:id', isAuthenticated, applyJob);

//to get all the applied jobs by a user
router.get('/get', isAuthenticated, getAppliedJobs);

//get all the applicants for a particular job
router.get('/:id/applicants', isAuthenticated, getApplicants);

//to update the status
router.get('/status/:id/update', isAuthenticated, updateStatus);

export default router;