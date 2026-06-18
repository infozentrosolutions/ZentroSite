const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        const email = 'admin@gmail.com';
        const password = 'Admin@123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await User.findOneAndUpdate(
            { email },
            {
                name: 'System Admin',
                email,
                password: hashedPassword,
                role: 'admin'
            },
            {
                upsert: true,
                returnDocument: 'after',
                setDefaultsOnInsert: true
            }
        );

        if (admin) {
            console.log('Default admin ready.');
            console.log('Email: admin@gmail.com');
            console.log('Password: Admin@123');
        }
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
};

module.exports = seedAdmin;
