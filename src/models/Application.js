const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
    jobId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: true 
    },
    candidateName: { type: String, required: true },
    candidateEmail: { type: String, required: true },
    resumeUrl: { type: String, required: true }, // Path to the uploaded file
    status: { 
        type: String, 
        enum: ['Pending', 'Reviewed', 'Accepted', 'Rejected'], 
        default: 'Pending' 
    },
    appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', ApplicationSchema);