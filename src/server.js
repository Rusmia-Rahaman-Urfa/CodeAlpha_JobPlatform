require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const jobRoutes = require('./routes/jobRoutes');

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves your HTML
// Add this line under your existing job routes
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/appRoutes')); // <--- Add this!

// Routes
app.use('/api/jobs', require('./routes/jobRoutes'));

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));