const Certificate = require('../models/Certificate');
const User = require('../models/User');

// GET all certificate requests for a teacher
exports.getCertificateRequests = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const certificates = await Certificate.find({ teacher: teacherId })
            .populate('student', 'name email')
            .populate('internship', 'title')
            .sort({ createdAt: -1 });
        
        res.status(200).json({ success: true, data: certificates });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// GET all students (for certificate management)
exports.getStudents = async (req, res) => {
    try {
        const students = await User.find({ role: 'student' }).select('-password');
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Issue a certificate to a student
exports.issueCertificate = async (req, res) => {
    try {
        const { studentId, internshipId } = req.body;
        const teacherId = req.user.id;

        // Check if student exists
        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        // Find existing certificate or create new
        let certificate = await Certificate.findOne({ student: studentId, internship: internshipId });
        
        if (!certificate) {
            certificate = new Certificate({
                student: studentId,
                teacher: teacherId,
                internship: internshipId,
                status: 'issued',
                certificateNumber: `CERT-${Date.now()}-${studentId.toString().slice(-4)}`,
                issueDate: new Date()
            });
        } else {
            certificate.status = 'issued';
            certificate.issueDate = new Date();
            certificate.declineDate = null;
            certificate.declinedReason = null;
        }

        await certificate.save();
        await certificate.populate('student', 'name email');
        await certificate.populate('internship', 'title');

        res.status(200).json({ success: true, data: certificate, message: 'Certificate issued successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Decline a certificate
exports.declineCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;
        const { reason } = req.body;

        const certificate = await Certificate.findById(certificateId);
        if (!certificate) {
            return res.status(404).json({ success: false, error: 'Certificate not found' });
        }

        certificate.status = 'declined';
        certificate.declinedReason = reason || 'No reason provided';
        certificate.declineDate = new Date();
        certificate.issueDate = null;

        await certificate.save();
        await certificate.populate('student', 'name email');
        await certificate.populate('internship', 'title');

        res.status(200).json({ success: true, data: certificate, message: 'Certificate declined successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
