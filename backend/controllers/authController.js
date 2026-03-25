const User = require('../models/User');
const bcrypt = require('bcryptjs'); // or 'bcrypt'
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key', {
        expiresIn: '30d',
    });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check for user email in main User collection
        let user = await User.findOne({ email });
        let isPortalUser = false;

        // If not found in User, check PortalUser collection
        if (!user) {
            const PortalUser = require('../models/PortalUser');
            user = await PortalUser.findOne({ email });
            isPortalUser = true;
        }

        if (user) {
            // Check password (handle both bcrypt and possible plaintext for older portal users)
            const isMatch = (await bcrypt.compare(password, user.password)) || (password === user.password);

            if (isMatch) {
                res.json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: isPortalUser ? 'student' : user.role,
                    token: generateToken(user._id)
                });
                return;
            }
        }

        res.status(401).json({ message: 'Invalid credentials' });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Register user (Admin only creates Teacher/Student)
// @route   POST /api/auth/register
// @access  Private/Admin
const register = async (req, res) => {
    const { name, email, password, role, batch } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Role validation - ensure admin can't create an invalid role
        if (!['admin', 'teacher', 'student'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
            batch
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    login,
    register
};
