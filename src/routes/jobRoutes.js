import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getJobs, createJob, getJob, updateJob, deleteJob, getStats, generateCoverLetter } from '../controllers/jobController.js'
import { getNotes, createNote, deleteNote } from '../controllers/noteController.js'

const router = Router();

router.use(protect)
router.get('/',  getJobs);
router.post('/',  createJob);
router.get('/stats', getStats);
router.get('/:id',  getJob);
router.put('/:id',  updateJob);
router.delete('/:id',  deleteJob);
router.get('/:id/notes', getNotes);
router.post('/:id/notes', createNote);
router.delete('/:id/notes/:noteId', deleteNote);
router.post('/:id/cover-letter', generateCoverLetter);

export default router;