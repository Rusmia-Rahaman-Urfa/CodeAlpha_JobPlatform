const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Remote', 'Contract'], default: 'Full-time' },
    description: { type: String, required: true },
    postedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);