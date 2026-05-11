import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getJobs, createJob, getJob, updateJob, deleteJob, getStats} from '../controllers/jobController.js'

const router = Router();

router.use(protect)
router.get('/',  getJobs);
router.post('/',  createJob);
router.get('/stats', getStats);
router.get('/:id',  getJob);
router.put('/:id',  updateJob);
router.delete('/:id',  deleteJob);

export default router;