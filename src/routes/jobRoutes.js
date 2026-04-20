const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Get all jobs (with search filter)
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = { title: { $regex: search, $options: 'i' } };
        }
        const jobs = await Job.find(query).sort({ postedAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Post a new job
router.post('/', async (req, res) => {
    try {
        const newJob = new Job(req.body);
        const job = await newJob.save();
        res.json(job);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;