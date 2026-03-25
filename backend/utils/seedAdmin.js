const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        // Check if any admin exists
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            console.log('No admin user found. Creating default admin...');
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);

            await User.create({
                name: 'System Admin',
                email: 'admin@zen.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Default admin created successfully!');
            console.log('Email: admin@zen.com');
            console.log('Password: admin123');
        } else {
            console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
