const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['candidate', 'employer'], default: 'candidate' },
    logo: { type: String, default: 'https://via.placeholder.com/150' }, // new add
    shortDescription: { type: String }, // new add
    fullDescription: { type: String }, // new add
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);