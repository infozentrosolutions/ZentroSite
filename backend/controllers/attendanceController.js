const Attendance = require('../models/Attendance');
const User = require('../models/User');

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const getRange = (range = 'Today') => {
    const end = new Date();
    const start = new Date(end);

    if (range === 'This Week') {
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
    } else if (range === 'This Month') {
        start.setDate(1);
    }

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return {
        startDate: start.toISOString().slice(0, 10),
        endDate: end.toISOString().slice(0, 10),
    };
};

const getAttendanceOverview = async (req, res) => {
    try {
        const range = req.query.range || 'Today';
        const { startDate, endDate } = getRange(range);
        const today = getTodayKey();

        const students = await User.find({ role: 'student' }).select('name email batch internshipAssigned');
        const records = await Attendance.find({ date: { $gte: startDate, $lte: endDate } }).lean();
        const todayRecords = await Attendance.find({ date: today }).lean();

        const recordsByStudent = records.reduce((acc, record) => {
            const studentId = String(record.student);
            if (!acc[studentId]) {
                acc[studentId] = [];
            }
            acc[studentId].push(record);
            return acc;
        }, {});

        const todayMap = todayRecords.reduce((acc, record) => {
            acc[String(record.student)] = record.status;
            return acc;
        }, {});

        const uniqueDates = new Set(records.map(record => record.date));

        const rows = students.map((student) => {
            const studentRecords = recordsByStudent[String(student._id)] || [];
            const presentDays = studentRecords.filter(record => record.status === 'present').length;
            const absentDays = studentRecords.filter(record => record.status === 'absent').length;
            const markedDays = presentDays + absentDays;
            const attendanceRate = markedDays === 0 ? 0 : Math.round((presentDays / markedDays) * 100);

            return {
                _id: student._id,
                name: student.name,
                email: student.email,
                batch: student.batch,
                presentDays,
                absentDays,
                attendanceRate,
                todayStatus: todayMap[String(student._id)] || 'not-marked',
            };
        });

        const summary = {
            totalStudents: students.length,
            daysConducted: uniqueDates.size,
            todayPresent: todayRecords.filter(record => record.status === 'present').length,
            todayAbsent: todayRecords.filter(record => record.status === 'absent').length,
            currentDate: today,
        };

        res.json({
            success: true,
            data: {
                summary,
                students: rows,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const markAttendance = async (req, res) => {
    try {
        const { date, marks } = req.body;
        const targetDate = date || getTodayKey();

        if (!Array.isArray(marks) || marks.length === 0) {
            return res.status(400).json({ success: false, error: 'Attendance marks are required' });
        }

        const operations = marks
            .filter(mark => mark && mark.studentId && ['present', 'absent'].includes(mark.status))
            .map(mark => ({
                updateOne: {
                    filter: { student: mark.studentId, date: targetDate },
                    update: {
                        $set: {
                            student: mark.studentId,
                            date: targetDate,
                            status: mark.status,
                            markedBy: req.user?._id || null,
                        },
                    },
                    upsert: true,
                },
            }));

        if (operations.length === 0) {
            return res.status(400).json({ success: false, error: 'Valid attendance marks are required' });
        }

        await Attendance.bulkWrite(operations);

        res.status(200).json({
            success: true,
            message: 'Attendance saved successfully',
            data: { date: targetDate },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const getStudentAttendanceHistory = async (req, res) => {
    try {
        const { studentId } = req.params;
        const range = req.query.range || 'This Month';
        const { startDate, endDate } = getRange(range);

        const student = await User.findById(studentId).select('name email batch');

        if (!student) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        const records = await Attendance.find({
            student: studentId,
            date: { $gte: startDate, $lte: endDate },
        })
            .populate('markedBy', 'name email')
            .sort({ date: 1 })
            .lean();

        const summary = {
            totalMarks: records.length,
            presentDays: records.filter(record => record.status === 'present').length,
            absentDays: records.filter(record => record.status === 'absent').length,
        };

        res.json({
            success: true,
            data: {
                student,
                range,
                summary,
                records,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getAttendanceOverview,
    markAttendance,
    getStudentAttendanceHistory,
};