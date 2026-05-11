import Job from '../models/Job.js';
import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const createJob = asyncHandler(async (req, res) => {
    const { company, position, status, location, salary, jobUrl, notes, followUpDate } = req.body;

    const job = await Job.create({
        user: req.user._id,
        company,
        position,
        status,
        location,
        salary,
        jobUrl,
        notes,
        followUpDate: followUpDate || undefined
    })
    res.status(201).json({ success: true, job })
});

const getJobs = asyncHandler(async (req, res) => {
    const { search, status } = req.query;

    const query = { user: req.user._id }

    if (search) {
        query.$or = [
            { company: { $regex: search, $options: 'i' } },
            { position: { $regex: search, $options: 'i' } }
        ]
    }
    if (status) query.status = status;

    const jobs = await Job.find(query);
    const total = await Job.countDocuments(query);
    res.status(200).json({ success: true, total, jobs })

})

const getJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ success: false, message: 'No job found' })
    }
    if (job.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error(' Not Authorized to view this job ');
    }
    res.status(200).json({ success: true, job })
});

const updateJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id)
    if (!job) {
        return res.status(404).json({ success: false, message: 'No job found' })
    }
    if (job.user.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error('Not Authorized to Update this Job')
    }
    const updateData = { ...req.body }
    if (updateData.followUpDate === '') {
        delete updateData.followUpDate
    }
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, updateData, { runValidators: true, new: true });
    res.status(200).json({ success: true, updatedJob })
})

const deleteJob = asyncHandler(async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ success: false, message: 'No job found' })
    }
    if (job.user.toString() !== req.user._id.toString()) {
        res.status(401)
        throw new Error('Not Authorized to Delete this Job')
    }
    await job.deleteOne();
    res.status(200).json({ success: true, job })
});

const getStats = asyncHandler(async (req, res) => {
    const totalJobs = await Job.countDocuments({ user: req.user._id });
    const stats = await Job.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
    ])
    res.status(200).json({ success: true, totalJobs, stats })
})

const generateCoverLetter = asyncHandler(async (req, res) => {
    const { extraInfo = '' } = req.body;

    const job = await Job.findById(req.params.id);
    if (!job) {
        return res.status(404).json({ success: false, message: 'No job found' });
    }
    if (job.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to generate a cover letter for this job');
    }

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: 'You are an expert career coach and professional cover letter writer. Write concise, compelling, personalized cover letters that are professional but not generic.',
        messages: [
            {
                role: 'user',
                content: `Write a cover letter for a ${job.position} role at ${job.company}. Additional context about the applicant: ${extraInfo || 'None'}. Job notes: ${job.notes || 'None'}. Keep it to 3-4 paragraphs, professional tone.`
            }
        ]
    });

    const coverLetter = response.content[0].text;
    if (!coverLetter) {
        res.status(500);
        throw new Error('Failed to generate cover letter');
    }

    res.status(200).json({ success: true, coverLetter });
});

export { createJob, getJobs, getJob, updateJob, deleteJob, getStats, generateCoverLetter };