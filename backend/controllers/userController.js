const User = require('../models/User');

// GET /api/users?role=teacher
exports.getUsersByRole = async (req, res) => {
    try {
        const { role } = req.query;
        if (!role) return res.status(400).json({ success: false, error: 'Role query param is required' });

        const users = await User.find({ role }).select('-password');
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        res.status(200).json({ success: true, message: 'User deleted successfully', data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.getPublicStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        const student = await User.findOne({ _id: id, role: 'student' }).select('-password');

        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
