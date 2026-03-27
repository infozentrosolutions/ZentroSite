const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const userRoutes = require('./routes/userRoutes');
const certificateRoutes = require('./routes/certificateRoutes');
const seedAdmin = require('./utils/seedAdmin'); // Import seed utility

// Load env vars
dotenv.config();

// Connect to database (Using Atlas 'test' DB)
connectDB().then(() => {
    // Seed default admin if none exists
    seedAdmin();
});

const app = express();

// Middleware to parse JSON
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'https://zentrosolution.fun',
    'https://www.zentrosolution.fun',
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());

// Root API endpoint
app.get('/api', (req, res) => {
    res.json({
        message: 'Zen1 API Server',
        endpoints: {
            auth: '/api/auth',
            internships: '/api/internships'
        }
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/users', userRoutes);
app.use('/api/certificates', certificateRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
