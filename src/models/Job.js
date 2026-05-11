import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    position: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['applied', 'interview', 'offer', 'rejected'],
        default: 'applied'
    },
    location: {
        type: String,
        trim: true
    },
    salary: {
        type: String
    },
    jobUrl: {
        type: String
    },
    notes: {
        type: String
    },
    appliedAt: {
        type: Date,
        default: Date.now
    },
    followUpDate: {
        type: Date,
    }
}, { timestamps: true })

export default mongoose.model('Job', jobSchema);