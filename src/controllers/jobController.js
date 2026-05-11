import Job from '../models/Job.js';
import asyncHandler from '../utils/asyncHandler.js';

const createJob = asyncHandler(async (req, res) => {
    const { company, position, status, location, salary, jobUrl, notes } = req.body;

    const job = await Job.create({
        user: req.user._id,
        company,
        position,
        status,
        location,
        salary,
        jobUrl,
        notes
    })
    res.status(201).json({ success: true, job })
});

const getJobs = asyncHandler(async (req, res) => {
    const { search,  status } = req.query;

    const query = { user: req.user._id }
    
    if(search){
    query.$or = [
        { company: { $regex: search, $options: 'i' } },
        { position: { $regex: search, $options: 'i' } }
    ]
    }
    if (status) query.status = status;

    const total = await Job.countDocuments(query);
    res.status(200).json({ success:true, total, jobs })

    const jobs = await Job.find(query);
    res.status(200).json({ success: true, jobs })
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
    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });
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

const getStats = asyncHandler(async(req, res) => {
    const totalJobs = await Job.countDocuments({ user: req.user._id});
    const stats = await Job.aggregate([
        { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
        { $group: { _id: '$status', count: { $sum: 1}}}
    ])
    res.status(200).json({ success: true, totalJobs, stats })
})

export { createJob, getJobs, getJob, updateJob, deleteJob, getStats };