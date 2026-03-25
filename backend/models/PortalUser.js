const mongoose = require('mongoose');

const portalUserSchema = new mongoose.Schema({
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
    password: {
        type: String,
        required: true
    },
    payment_id: {
        type: String
    },
    date: {
        type: String
    }
}, {
    timestamps: false // Adjust based on if portalusers has timestamps natively or not
});

// Use existing 'portalusers' collection
module.exports = mongoose.model('PortalUser', portalUserSchema, 'portalusers');
