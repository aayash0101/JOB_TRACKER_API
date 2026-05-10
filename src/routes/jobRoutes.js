import { Router } from "express";
import { protect } from "../middleware/authmiddleware.js";
import { getJobs, createJob, getJob, updateJob, deleteJob } from '../controllers/jobController.js'

const router = Router();

router.use(protect)
router.get('/',  getJobs);
router.post('/',  createJob);
router.get('/:id',  getJob);
router.put('/:id',  updateJob);
router.delete('/:id',  deleteJob);

export default router;