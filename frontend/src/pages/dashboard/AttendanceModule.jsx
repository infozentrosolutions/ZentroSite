import { useEffect, useState } from 'react';
import { Calendar, Users, Target, CheckCircle, XCircle, Clock, Search, LayoutGrid, Save } from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const AttendanceModule = () => {
    const [dateFilter, setDateFilter] = useState('Today');
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState([]);
    const [summary, setSummary] = useState({ totalStudents: 0, daysConducted: 0, todayPresent: 0, todayAbsent: 0, currentDate: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [historyRange, setHistoryRange] = useState('This Month');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [history, setHistory] = useState({ student: null, summary: { totalMarks: 0, presentDays: 0, absentDays: 0 }, records: [] });
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                const res = await api.get('/attendance', { params: { range: dateFilter } });
                setStudents(res.data.data.students || []);
                setSummary(res.data.data.summary || { totalStudents: 0, daysConducted: 0, todayPresent: 0, todayAbsent: 0, currentDate: '' });
            } catch (error) {
                toast.error(error.response?.data?.error || 'Failed to load attendance data');
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [dateFilter]);

    useEffect(() => {
        if (!selectedStudentId && students.length > 0) {
            setSelectedStudentId(students[0]._id);
        }
    }, [students, selectedStudentId]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!selectedStudentId) {
                setHistory({ student: null, summary: { totalMarks: 0, presentDays: 0, absentDays: 0 }, records: [] });
                return;
            }

            setHistoryLoading(true);
            try {
                const res = await api.get(`/attendance/student/${selectedStudentId}`, {
                    params: { range: historyRange },
                });

                setHistory(res.data.data || { student: null, summary: { totalMarks: 0, presentDays: 0, absentDays: 0 }, records: [] });
            } catch (error) {
                toast.error(error.response?.data?.error || 'Failed to load attendance history');
            } finally {
                setHistoryLoading(false);
            }
        };

        fetchHistory();
    }, [selectedStudentId, historyRange]);

    const StatusBadge = ({ status }) => {
        switch (status) {
            case 'present':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        <CheckCircle className="w-3 h-3 justify-center mr-1" /> Present
                    </span>
                );
            case 'absent':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        <XCircle className="w-3 h-3 mr-1" /> Absent
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        <Clock className="w-3 h-3 mr-1" /> Not Marked
                    </span>
                );
        }
    };

    const filteredStudents = students.filter((student) =>
        `${student.name} ${student.email} ${student.batch || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleStatusChange = (studentId, status) => {
        setStudents(prev => prev.map(student => (
            student._id === studentId ? { ...student, todayStatus: status } : student
        )));
    };

    const handleSaveAttendance = async () => {
        const markedStudents = students.filter(student => ['present', 'absent'].includes(student.todayStatus));

        if (markedStudents.length === 0) {
            toast.error('Mark at least one student before saving attendance');
            return;
        }

        setSaving(true);
        try {
            await api.post('/attendance/mark', {
                date: summary.currentDate,
                marks: markedStudents.map(student => ({
                    studentId: student._id,
                    status: student.todayStatus,
                })),
            });

            const res = await api.get('/attendance', { params: { range: dateFilter } });
            setStudents(res.data.data.students || []);
            setSummary(res.data.data.summary || summary);
            toast.success('Attendance saved successfully');
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to save attendance');
        } finally {
            setSaving(false);
        }
    };

    const selectedStudent = history.student;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-violet-50 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10 flex-1">
                    <p className="text-sm font-semibold text-indigo-600 mb-1 tracking-wide uppercase flex items-center">
                        <LayoutGrid className="w-4 h-4 mr-1.5" /> Full Stack Web Development
                    </p>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Student Attendance Details</h2>
                    <p className="text-gray-500 font-medium flex items-center text-sm">
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 mr-2">Attendance tracking uses stored student records</span>
                    </p>
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
                        {['Today', 'This Week', 'This Month'].map(filter => (
                            <button
                                key={filter}
                                onClick={() => setDateFilter(filter)}
                                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${dateFilter === filter
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleSaveAttendance}
                        disabled={saving || loading}
                        className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/40 hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Attendance'}
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Total Students', value: String(summary.totalStudents), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { title: 'Days Conducted', value: String(summary.daysConducted), icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
                    { title: 'Today Present', value: String(summary.todayPresent), icon: Target, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                    { title: 'Today Absent', value: String(summary.todayAbsent), icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
                ].map((stat, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors group cursor-default">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-bold text-gray-900">Student Roster Attendance</h3>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50 hover:bg-white focus:bg-white"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Student Info</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Present Days</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Absent Days</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Attendance Rate</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Today's Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading attendance records...</td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No students found.</td>
                                </tr>
                            ) : filteredStudents.map((student) => {
                                const percentage = student.attendanceRate || 0;
                                const initials = student.name.split(' ').map(n => n[0]).join('').slice(0, 2);
                                return (
                                    <tr key={student._id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200/50 group-hover:scale-105 transition-transform">
                                                        {initials}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                        {student.name}
                                                        {student.batch && (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/50">
                                                                {student.batch}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm font-semibold text-gray-700">{student.presentDays}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm font-semibold text-gray-700">{student.absentDays}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="text-sm font-medium text-gray-900 w-12">{percentage}%</span>
                                                <div className="w-full max-w-[120px] bg-gray-100 rounded-full h-2.5 ml-2 overflow-hidden border border-gray-200/50">
                                                    <div
                                                        className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${percentage >= 85 ? 'bg-green-500' :
                                                            percentage >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex flex-col items-center gap-2">
                                                <select
                                                    value={student.todayStatus || 'not-marked'}
                                                    onChange={(e) => handleStatusChange(student._id, e.target.value)}
                                                    className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                                                >
                                                    <option value="not-marked">Not Marked</option>
                                                    <option value="present">Present</option>
                                                    <option value="absent">Absent</option>
                                                </select>
                                                <StatusBadge status={student.todayStatus} />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* Pagination placeholder matching the design language */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Showing {filteredStudents.length} of {students.length} students</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50">Previous</button>
                        <button className="px-3 py-1 text-sm border border-indigo-500 rounded-md bg-indigo-50 text-indigo-700 font-medium">1</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Attendance History Report</h3>
                        <p className="text-sm text-gray-500 mt-1">Date-wise attendance for a single student</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={selectedStudentId}
                            onChange={(e) => setSelectedStudentId(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                        >
                            <option value="">Select student</option>
                            {students.map(student => (
                                <option key={student._id} value={student._id}>{student.name} {student.batch ? `(${student.batch})` : ''}</option>
                            ))}
                        </select>
                        <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
                            {['Today', 'This Week', 'This Month'].map(range => (
                                <button
                                    key={range}
                                    type="button"
                                    onClick={() => setHistoryRange(range)}
                                    className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${historyRange === range
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-gray-100 bg-gray-50/40">
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</p>
                        <p className="mt-2 text-sm font-semibold text-gray-900">{selectedStudent ? selectedStudent.name : 'No student selected'}</p>
                        <p className="text-xs text-gray-500 mt-1">{selectedStudent ? selectedStudent.email : 'Choose a student to view history'}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Present Days</p>
                        <p className="mt-2 text-2xl font-bold text-green-600">{history.summary?.presentDays || 0}</p>
                    </div>
                    <div className="bg-white rounded-xl border border-gray-100 p-4">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Absent Days</p>
                        <p className="mt-2 text-2xl font-bold text-red-600">{history.summary?.absentDays || 0}</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Marked By</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {historyLoading ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">Loading attendance history...</td>
                                </tr>
                            ) : !selectedStudentId ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">Select a student to view the history report.</td>
                                </tr>
                            ) : (history.records || []).length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-10 text-center text-gray-500">No attendance records found for the selected period.</td>
                                </tr>
                            ) : (
                                history.records.map((record) => (
                                    <tr key={record._id} className="hover:bg-gray-50/80 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{record.date}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <StatusBadge status={record.status} />
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {record.markedBy ? `${record.markedBy.name}${record.markedBy.email ? ` (${record.markedBy.email})` : ''}` : 'System'}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceModule;
