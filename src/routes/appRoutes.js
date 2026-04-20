const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Application = require('../models/Application');

// Configure Multer for PDF storage
const storage = multer.diskStorage({
    destination: './src/uploads/',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /pdf/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (extname) return cb(null, true);
        cb('Error: Only PDFs are allowed!');
    }
});

// Apply for a job with a resume
router.post('/', upload.single('resume'), async (req, res) => {
    try {
        const { jobId, candidateName, candidateEmail } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ msg: 'Please upload a resume' });
        }

        const newApplication = new Application({
            jobId,
            candidateName,
            candidateEmail,
            resumeUrl: `/uploads/${req.file.filename}`
        });

        const savedApp = await newApplication.save();
        res.json(savedApp);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Get all applications for a specific job (Employer View)
router.get('/:jobId', async (req, res) => {
    try {
        const apps = await Application.find({ jobId: req.params.jobId }).sort({ appliedAt: -1 });
        res.json(apps);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;