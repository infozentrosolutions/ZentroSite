const mongoose = require('mongoose');

const internPersonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        default: 'Intern'
    },
    batch: {
        type: String,
        default: ''
    },
    stack: {
        type: String,
        default: ''
    },
    summary: {
        type: String,
        default: ''
    },
    photoUrl: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('InternPerson', internPersonSchema);