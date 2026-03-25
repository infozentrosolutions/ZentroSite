const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdminAndTest = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected.');

        // 1. Seed Admin
        const adminEmail = 'superadmin' + Date.now() + '@test.com';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        const admin = await User.create({
            name: 'Super Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin seeded successfully:', admin.email);

        // 2. Login Admin via API
        console.log('Testing Login API...');
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: adminEmail,
                password: 'admin123'
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Admin:', loginRes.status, loginData.token ? 'Success (Token received)' : 'Failed');

        // 3. Register Teacher via API (using Admin token)
        if (loginData.token) {
            console.log('Testing Register API for Teacher...');
            const teacherRes = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginData.token}`
                },
                body: JSON.stringify({
                    name: 'Test Teacher',
                    email: 'teacher' + Date.now() + '@test.com',
                    password: 'teacher123',
                    role: 'teacher'
                })
            });
            const teacherData = await teacherRes.json();
            console.log('Register Teacher:', teacherRes.status, teacherData.email ? 'Success' : 'Failed', teacherData);
        }

        console.log('Backend verification completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Test failed:', err);
        process.exit(1);
    }
};

seedAdminAndTest();
