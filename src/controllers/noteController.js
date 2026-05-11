import Job from '../models/Job.js';
import Note from '../models/Note.js';
import asyncHandler from '../utils/asyncHandler.js';

const getNotes = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'No job found' });
  }
  if (job.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to view notes for this job');
  }

  const notes = await Note.find({ jobId: req.params.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, notes });
});

const createNote = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content || !content.trim()) {
    res.status(400);
    throw new Error('Note content is required');
  }

  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ success: false, message: 'No job found' });
  }
  if (job.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to add a note to this job');
  }

  const note = await Note.create({
    content: content.trim(),
    jobId: req.params.id,
    userId: req.user._id,
  });

  res.status(201).json({ success: true, note });
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);
  if (!note) {
    return res.status(404).json({ success: false, message: 'No note found' });
  }
  if (note.jobId.toString() !== req.params.id) {
    res.status(400);
    throw new Error('Note does not belong to this job');
  }
  if (note.userId.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this note');
  }

  await note.deleteOne();
  res.status(200).json({ success: true, noteId: note._id });
});

export { getNotes, createNote, deleteNote };
