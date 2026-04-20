const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Get all jobs (with search filter)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        
        // Search by job title or company name
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { company: { $regex: search, $options: 'i' } }
                ]
            };
        }
        
        const jobs = await Job.find(query).sort({ postedAt: -1 });
        res.json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get job by ID for details view
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id).populate('companyId');
        
        if (!job) {
            return res.status(404).json({ msg: 'Job not found' });
        }
        
        res.json(job);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Job not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Post a new job
router.post('/', async (req, res) => {
    try {
        const { title, company, location, description } = req.body;
        
        const newJob = new Job({
            title,
            company,
            location,
            description
        });

        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;