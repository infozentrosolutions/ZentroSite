import { useRef, useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';
import { Briefcase, Users, Layers, Calendar, Award, Video, Plus, Edit, Trash2, UserPlus, UserMinus, ShieldAlert, CheckCircle, XCircle, QrCode, Download, ExternalLink, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { jsPDF } from 'jspdf';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AttendanceModule from './AttendanceModule';
import { QRCodeSVG } from 'qrcode.react';
import InternPeopleHub from '../../components/InternPeopleHub';
import { maskEmail } from '../../utils/masking';

const SuperDashboard = () => {
    const { user } = useContext(AuthContext);
    const role = user?.role || 'teacher';
    const [searchParams, setSearchParams] = useSearchParams();
    const initialTab = searchParams.get('tab') || 'internships';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);

    // Create Internship Modal State
    const [showModal, setShowModal] = useState(false);
    const [newInternship, setNewInternship] = useState({ title: '', description: '', duration: '', fee: 0 });

    // Edit Internship Modal State
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingInternship, setEditingInternship] = useState(null);

    // Edit Syllabus Modal State
    const [showSyllabusModal, setShowSyllabusModal] = useState(false);
    const [editingSyllabus, setEditingSyllabus] = useState(null);

    // Teacher Management State
    const [showTeacherModal, setShowTeacherModal] = useState(false);
    const [newTeacher, setNewTeacher] = useState({ name: '', email: '', password: '' });
    const [teachers, setTeachers] = useState([]);
    const [showStudentForm, setShowStudentForm] = useState(false);
    const [newStudent, setNewStudent] = useState({ name: '', email: '', password: '', batch: '' });
    const [studentSaving, setStudentSaving] = useState(false);
    const [editingStudentId, setEditingStudentId] = useState(null);

    // Certificate Management State
    const [certificates, setCertificates] = useState([]);
    const [students, setStudents] = useState([]);
    const [showIssueCertificateModal, setShowIssueCertificateModal] = useState(false);
    const [showDeclineModal, setShowDeclineModal] = useState(false);
    const [selectedCertificate, setSelectedCertificate] = useState(null);
    const [declineReason, setDeclineReason] = useState('');
    const [newCertificateData, setNewCertificateData] = useState({ studentId: '', internshipId: '' });
    const [selectedStudentForQr, setSelectedStudentForQr] = useState(null);
    const qrPreviewRef = useRef(null);

    const tabs = [
        ...(role === 'admin' ? [
            { id: 'internships', name: 'Internship Mgmt', icon: Briefcase },
            { id: 'intern-peoples', name: 'Intern Profiles', icon: Users }
        ] : []),
        { id: 'students', name: 'Student Mgmt', icon: Users },
        { id: 'batches', name: 'Batch Mgmt', icon: Layers },
        { id: 'attendance', name: 'Attendance', icon: Calendar },
        { id: 'certificates', name: 'Certificates', icon: Award },
        ...(role === 'admin' ? [{ id: 'teachers', name: 'Teacher Mgmt', icon: Users }] : []),
    ];

    // Ensure teacher starts on a valid tab
    useEffect(() => {
        if (role !== 'admin' && activeTab === 'internships') {
            setActiveTab('students');
            setSearchParams({ tab: 'students' });
        }
    }, [role]);

    // Sync activeTab with URL search params
    useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl && tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }
    }, [searchParams]);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const res = await api.get(role === 'admin' ? '/internships' : '/internships/assigned');
                setInternships(res.data.data);
            } catch (err) {
                toast.error('Failed to load internships');
            } finally {
                setLoading(false);
            }
        };

        if (['internships', 'students', 'batches', 'certificates'].includes(activeTab)) {
            fetchInternships();
        }
    }, [activeTab, role]);

    const handleDeleteInternship = async (id) => {
        if (!window.confirm('Are you sure you want to delete this internship?')) return;
        try {
            await api.delete(`/internships/${id}`);
            setInternships(internships.filter(i => i._id !== id));
            toast.success('Internship deleted successfully');
        } catch (err) {
            toast.error('Failed to delete internship');
        }
    };

    const handleCreateInternship = async (e) => {
        e.preventDefault();
        try {
            const data = {
                ...newInternship,
                fee: Number(newInternship.fee)
            };
            const res = await api.post('/internships', data);
            setInternships([...internships, res.data.data]);
            setShowModal(false);
            setNewInternship({ title: '', description: '', duration: '', fee: 0 });
            toast.success('Internship created successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to create internship');
        }
    };

    const getStudentProfileUrl = (studentId) => `${window.location.origin}/student-profile/${studentId}`;

    const handleDownloadStudentQr = (format = 'image') => {
        if (!selectedStudentForQr) return;

        const svgElement = qrPreviewRef.current?.querySelector('svg');
        if (!svgElement) return;

        const serializer = new XMLSerializer();
        let svgSource = serializer.serializeToString(svgElement);
        if (!svgSource.includes('xmlns="http://www.w3.org/2000/svg"')) {
            svgSource = svgSource.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }
        if (!svgSource.includes('xmlns:xlink="http://www.w3.org/1999/xlink"')) {
            svgSource = svgSource.replace('<svg', '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
        }

        const blob = new Blob([svgSource], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 500;
            canvas.height = 500;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            const pngUrl = canvas.toDataURL('image/png');
            const safeName = selectedStudentForQr.name ? selectedStudentForQr.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase() : 'student';

            if (format === 'pdf') {
                const doc = new jsPDF({
                    orientation: 'portrait',
                    unit: 'px',
                    format: [500, 500]
                });
                doc.addImage(pngUrl, 'PNG', 0, 0, 500, 500);
                doc.save(`${safeName}-qr.pdf`);
            } else {
                const anchor = document.createElement('a');
                anchor.href = pngUrl;
                anchor.download = `${safeName}-qr.png`;
                document.body.appendChild(anchor);
                anchor.click();
                anchor.remove();
            }
            URL.revokeObjectURL(url);
        };
        img.src = url;
    };

    const handleEditInternship = (internship) => {
        setEditingInternship({ ...internship });
        setShowEditModal(true);
    };

    const handleUpdateInternship = async (e) => {
        e.preventDefault();
        if (!editingInternship?._id) return;
        try {
            const updatedData = {
                ...editingInternship,
                fee: Number(editingInternship.fee)
            };
            const res = await api.put(`/internships/${editingInternship._id}`, updatedData);
            // Refetch fresh data from server
            const refreshRes = await api.get('/internships');
            setInternships(refreshRes.data.data);
            setShowEditModal(false);
            setEditingInternship(null);
            toast.success('Internship updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update internship');
        }
    };

    const handleEditSyllabus = (internship) => {
        setEditingSyllabus({ internshipId: internship._id, content: internship.syllabus || '' });
        setShowSyllabusModal(true);
    };

    const handleUpdateSyllabus = async (e) => {
        e.preventDefault();
        if (!editingSyllabus?.internshipId) return;
        try {
            const res = await api.put(`/internships/${editingSyllabus.internshipId}`, { syllabus: editingSyllabus.content });
            setInternships(internships.map(i => i._id === editingSyllabus.internshipId ? res.data.data : i));
            setShowSyllabusModal(false);
            setEditingSyllabus(null);
            toast.success('Syllabus updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to update syllabus');
        }
    };

    const generateRandomPassword = () => {
        return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase();
    };

    const handleDeleteTeacher = async (id) => {
        const teacher = teachers.find(t => t._id === id);
        if (!window.confirm(`Remove ${teacher?.name}?`)) return;
        try {
            await api.delete(`/users/${id}`);
            setTeachers(teachers.filter(t => t._id !== id));
            toast.success(`${teacher?.name} removed successfully`);
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to remove teacher');
        }
    };

    const handleGenerateTeacher = async (e) => {
        e.preventDefault();
        if (!newTeacher.name || !newTeacher.email || !newTeacher.password) {
            toast.error('Please fill all fields');
            return;
        }

        try {
            const res = await api.post('/auth/register', {
                name: newTeacher.name,
                email: newTeacher.email,
                password: newTeacher.password,
                role: 'teacher'
            });
            // Refresh teachers list from server for consistent data shape
            try {
                const listRes = await api.get('/users?role=teacher');
                setTeachers(listRes.data.data || []);
            } catch (listErr) {
                // fallback: append created teacher response
                setTeachers(prev => [...prev, res.data]);
            }
            setShowTeacherModal(false);
            setNewTeacher({ name: '', email: '', password: '' });
            toast.success('Teacher created successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create teacher');
        }
    };

    const handleGenerateStudent = async (e) => {
        e.preventDefault();

        if (!newStudent.name || !newStudent.email || (!editingStudentId && !newStudent.password)) {
            toast.error('Please fill all required fields');
            return;
        }

        setStudentSaving(true);

        try {
            if (editingStudentId) {
                const res = await api.put(`/users/${editingStudentId}`, {
                    name: newStudent.name,
                    email: newStudent.email,
                    password: newStudent.password,
                    batch: newStudent.batch
                });

                setStudents(prev => prev.map(s => s._id === editingStudentId ? res.data.data : s));
                setNewStudent({ name: '', email: '', password: '', batch: '' });
                setEditingStudentId(null);
                setShowStudentForm(false);
                toast.success('Student updated successfully!');
            } else {
                const res = await api.post('/auth/register', {
                    name: newStudent.name,
                    email: newStudent.email,
                    password: newStudent.password,
                    batch: newStudent.batch,
                    role: 'student'
                });

                setStudents(prev => [{ ...res.data, role: 'student' }, ...prev]);
                setNewStudent({ name: '', email: '', password: '', batch: '' });
                setShowStudentForm(false);
                toast.success('Student created successfully!');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to save student');
        } finally {
            setStudentSaving(false);
        }
    };

    // Fetch teachers when Teacher Management tab is active
    useEffect(() => {
        if (activeTab === 'teachers' && role === 'admin') {
            const fetchTeachers = async () => {
                try {
                    const res = await api.get('/users?role=teacher');
                    setTeachers(res.data.data || []);
                } catch (err) {
                    toast.error('Failed to load teachers');
                }
            };
            fetchTeachers();
        }
    }, [activeTab, role]);

    // Fetch certificates and students when certificates tab is active
    useEffect(() => {
        if (activeTab === 'certificates') {
            const fetchCertificates = async () => {
                try {
                    const [certRes, studRes] = await Promise.all([
                        api.get('/certificates/requests'),
                        api.get('/certificates/students/list')
                    ]);
                    setCertificates(certRes.data.data || []);
                    setStudents(studRes.data.data || []);
                } catch (err) {
                    toast.error('Failed to load certificate data');
                }
            };
            fetchCertificates();
        }

        if (activeTab === 'students') {
            setLoading(true);
            const fetchStudents = async () => {
                try {
                    const res = await api.get('/users?role=student');
                    setStudents(res.data.data || []);
                } catch (err) {
                    toast.error('Failed to load students');
                } finally {
                    setLoading(false);
                }
            };
            fetchStudents();
        }
    }, [activeTab]);

    const handleIssueCertificate = async (e) => {
        e.preventDefault();
        if (!newCertificateData.studentId || !newCertificateData.internshipId) {
            toast.error('Please select student and internship');
            return;
        }

        try {
            const res = await api.post('/certificates/issue', {
                studentId: newCertificateData.studentId,
                internshipId: newCertificateData.internshipId
            });
            // Refresh certificates list
            const certRes = await api.get('/certificates/requests');
            setCertificates(certRes.data.data || []);
            setShowIssueCertificateModal(false);
            setNewCertificateData({ studentId: '', internshipId: '' });
            toast.success('Certificate issued successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to issue certificate');
        }
    };

    const handleDeclineCertificate = async (e) => {
        e.preventDefault();
        if (!selectedCertificate || !declineReason.trim()) {
            toast.error('Please provide a reason for decline');
            return;
        }

        try {
            const res = await api.put(`/certificates/decline/${selectedCertificate._id}`, {
                reason: declineReason
            });
            // Refresh certificates list
            const certRes = await api.get('/certificates/requests');
            setCertificates(certRes.data.data || []);
            setShowDeclineModal(false);
            setSelectedCertificate(null);
            setDeclineReason('');
            toast.success('Certificate declined successfully!');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to decline certificate');
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-10">
            <Helmet>
                <title>Super Dashboard | Zentro Solutions - Admin Control</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 gap-4">
                <div className="min-w-0">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-1 md:space-y-0 md:space-x-3 mb-1">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Super Control Dashboard</h1>
                        {role === 'admin' ? (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center flex-shrink-0">
                                <ShieldAlert size={14} className="mr-1" /> OWNER
                            </span>
                        ) : (
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex-shrink-0">TEACHER</span>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm md:text-base">Manage internships, students, tracking, and live sessions.</p>
                </div>
            </div>

            {/* Navigation Tabs - Responsive */}
            <div className="flex space-x-1 border-b border-gray-200 overflow-x-auto no-scrollbar pb-px mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveTab(tab.id);
                            setSearchParams({ tab: tab.id });
                        }}
                        className={`px-2 md:px-4 py-3 font-medium text-xs md:text-sm transition-colors border-b-2 whitespace-nowrap flex items-center flex-shrink-0
              ${activeTab === tab.id
                                ? 'border-primary text-primary bg-indigo-50/50 rounded-t-lg'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        <tab.icon size={16} className="mr-1 md:mr-2 flex-shrink-0" />
                        <span className="hidden sm:inline">{tab.name}</span>
                    </button>
                ))}
            </div>

            {/* 1. Internship Management (ADMIN ONLY) */}
            {activeTab === 'internships' && role === 'admin' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Internship Programs</h2>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center text-sm justify-center sm:justify-start">
                            <Plus size={16} className="mr-2 flex-shrink-0" /> Create Internship
                        </button>
                    </div>
                    {loading ? (
                        <div className="text-center py-10 text-gray-500">Loading internships...</div>
                    ) : internships.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">No internships found. Create one.</div>
                    ) : (
                        <div className="space-y-4">
                            {internships.map(internship => (
                                <div key={internship._id} className="border border-gray-100 p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{internship.title}</h3>
                                        <p className="text-sm text-gray-600 mb-1">{internship.description}</p>
                                        <p className="text-sm text-gray-500">{internship.duration} • ₹{internship.fee || 'Free'} • {internship.batches?.length || 0} Batches</p>
                                        {internship.syllabus && internship.syllabus.length > 0 && (
                                            <ul className="mt-2 list-disc list-inside text-xs text-gray-400">
                                                {internship.syllabus.map((item, idx) => (
                                                    <li key={idx}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEditSyllabus(internship)} className="p-2 text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100" title="Edit Syllabus">
                                            <Layers size={18} />
                                        </button>
                                        <button onClick={() => handleEditInternship(internship)} className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100" title="Edit Internship">
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteInternship(internship._id)}
                                            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100" title="Delete Internship">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Other tabs kept functionally mock for now, ready structure wise */}
            {activeTab === 'students' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Student Roster</h2>
                            <p className="text-sm text-gray-500 mt-1">Students added here can log in with the email and password you create.</p>
                        </div>
                        {role === 'admin' && (
                            <form onSubmit={handleGenerateStudent} className="w-full lg:max-w-xl bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 flex items-center">
                                            <UserPlus size={16} className="mr-2 text-primary" /> {editingStudentId ? 'Edit Student Account' : 'Add Student'}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-0.5">{editingStudentId ? 'Modify student account details manually.' : 'Create a student account manually.'}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowStudentForm(prev => !prev)}
                                        className="text-sm font-medium text-primary hover:underline"
                                    >
                                        {showStudentForm ? 'Hide' : 'Show'}
                                    </button>
                                </div>

                                {showStudentForm && (
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            required
                                            placeholder="Student name"
                                            value={newStudent.name}
                                            onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                                        />
                                        <input
                                            type="email"
                                            required
                                            placeholder="Student email"
                                            value={newStudent.email}
                                            onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                                        />
                                        <input
                                            type="password"
                                            required={!editingStudentId}
                                            placeholder={editingStudentId ? "Password (leave blank)" : "Password"}
                                            value={newStudent.password}
                                            onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Batch assignment"
                                            value={newStudent.batch}
                                            onChange={(e) => setNewStudent({ ...newStudent, batch: e.target.value })}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 sm:col-span-3 text-slate-900"
                                        />
                                        <div className="sm:col-span-3 flex justify-end gap-2">
                                            <button
                                                type="submit"
                                                disabled={studentSaving}
                                                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                                            >
                                                {studentSaving ? 'Saving...' : editingStudentId ? 'Update Student' : 'Add Student'}
                                            </button>
                                            {editingStudentId && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingStudentId(null);
                                                        setNewStudent({ name: '', email: '', password: '', batch: '' });
                                                        setShowStudentForm(false);
                                                    }}
                                                    className="px-4 py-2 border border-gray-200 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </form>
                        )}
                    </div>
                    <div>
                        {loading ? (
                            <div className="text-center py-10 text-gray-500">Loading students...</div>
                        ) : students.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No students found.</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Batch</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Internship</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {students.map(s => (
                                            <tr
                                                key={s._id}
                                                role="button"
                                                tabIndex={0}
                                                onClick={() => setSelectedStudentForQr(s)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        setSelectedStudentForQr(s);
                                                    }
                                                }}
                                                className="cursor-pointer transition-colors hover:bg-indigo-50/50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{maskEmail(s.email)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{s.batch || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{internships.find(i => i._id === s.internshipAssigned)?.title || '-'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedStudentForQr(s);
                                                            }}
                                                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700 hover:bg-indigo-100"
                                                        >
                                                            <QrCode size={14} /> View QR
                                                        </button>
                                                        {role === 'admin' && (
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setEditingStudentId(s._id);
                                                                    setNewStudent({
                                                                        name: s.name || '',
                                                                        email: s.email || '',
                                                                        password: '',
                                                                        batch: s.batch || ''
                                                                    });
                                                                    setShowStudentForm(true);
                                                                }}
                                                                className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700 hover:bg-indigo-100"
                                                            >
                                                                <Edit size={14} /> Edit
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {selectedStudentForQr && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 px-4 py-6 backdrop-blur-sm"
                    onClick={() => setSelectedStudentForQr(null)}
                >
                    <div
                        className="w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0A0B1A] text-white shadow-[0_30px_80px_rgba(15,23,42,0.45)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 sm:px-8">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-200">Student QR</p>
                                <h3 className="mt-2 text-2xl font-black text-white">{selectedStudentForQr.name}</h3>
                                <p className="mt-1 text-sm text-slate-300">Scan this QR to open the public student profile popup.</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setSelectedStudentForQr(null)}
                                className="rounded-full border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10"
                                aria-label="Close QR modal"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1fr_0.9fr]">
                            <div className="rounded-[1.75rem] bg-white p-6 text-slate-900 shadow-inner">
                                <div ref={qrPreviewRef} className="flex items-center justify-center">
                                    <QRCodeSVG value={getStudentProfileUrl(selectedStudentForQr._id)} size={260} includeMargin />
                                </div>
                                <p className="mt-4 break-all text-center text-xs text-slate-500">{getStudentProfileUrl(selectedStudentForQr._id)}</p>
                            </div>

                            <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
                                <div className="rounded-2xl bg-white/5 p-4">
                                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400">Student</p>
                                    <p className="mt-2 text-lg font-bold text-white">{selectedStudentForQr.name}</p>
                                    <p className="text-sm text-slate-300">{maskEmail(selectedStudentForQr.email)}</p>
                                    <p className="mt-1 text-sm text-slate-400">Batch: {selectedStudentForQr.batch || '-'}</p>
                                </div>

                                <div className="flex flex-col gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleDownloadStudentQr('image')}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-cyan-400 px-4 py-3 font-bold text-slate-950 transition hover:bg-cyan-300"
                                    >
                                        <Download size={18} /> Download as Image (PNG)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDownloadStudentQr('pdf')}
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-bold text-white transition hover:bg-white/10"
                                    >
                                        <Download size={18} /> Download as PDF
                                    </button>
                                    <Link
                                        to={`/student-profile/${selectedStudentForQr._id}`}
                                        target="_blank"
                                        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
                                    >
                                        <ExternalLink size={18} /> Open profile page
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'batches' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Batch Management (Coming Soon)</h2>
                    </div>
                    <p className="text-gray-500 text-sm">Integration in progress...</p>
                </div>
            )}

            {['attendance'].includes(activeTab) && (
                <div className="w-full">
                    <AttendanceModule />
                </div>
            )}

            {/* Certificate Management */}
            {activeTab === 'certificates' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Certificate Management</h2>
                        {role === 'teacher' && (
                            <button
                                onClick={() => setShowIssueCertificateModal(true)}
                                className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center text-sm justify-center sm:justify-start">
                                <Plus size={16} className="mr-2 flex-shrink-0" /> Issue Certificate
                            </button>
                        )}
                    </div>
                    <div className="space-y-4">
                        {certificates.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No certificates yet.</div>
                        ) : (
                            certificates.map(cert => (
                                <div key={cert._id} className="border border-gray-100 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{cert.student?.name}</h3>
                                        <p className="text-sm text-gray-500">Internship: {cert.internship?.title}</p>
                                        <p className="text-xs text-gray-400">Cert #: {cert.certificateNumber}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${cert.status === 'issued' ? 'bg-green-50 text-green-600' :
                                                cert.status === 'declined' ? 'bg-red-50 text-red-600' :
                                                    'bg-yellow-50 text-yellow-600'
                                            }`}>
                                            {cert.status.charAt(0).toUpperCase() + cert.status.slice(1)}
                                        </span>
                                        {role === 'teacher' && cert.status === 'pending' && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await api.post('/certificates/issue', {
                                                                studentId: cert.student._id,
                                                                internshipId: cert.internship._id
                                                            });
                                                            const certRes = await api.get('/certificates/requests');
                                                            setCertificates(certRes.data.data || []);
                                                            toast.success('Certificate issued successfully!');
                                                        } catch (err) {
                                                            toast.error(err.response?.data?.error || 'Failed to issue certificate');
                                                        }
                                                    }}
                                                    className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100" title="Issue Certificate">
                                                    <CheckCircle size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedCertificate(cert);
                                                        setShowDeclineModal(true);
                                                    }}
                                                    className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100" title="Decline Certificate">
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {/* Teacher Management - ADMIN ONLY */}
            {activeTab === 'teachers' && role === 'admin' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                        <h2 className="text-lg md:text-xl font-bold text-gray-900">Teacher Management</h2>
                        <button
                            onClick={() => setShowTeacherModal(true)}
                            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center text-sm justify-center sm:justify-start">
                            <Plus size={16} className="mr-2 flex-shrink-0" /> Generate Teacher
                        </button>
                    </div>
                    <div className="space-y-4">
                        {teachers.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No teachers created yet.</div>
                        ) : (
                            teachers.map(teacher => (
                                <div key={teacher._id} className="border border-gray-100 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{teacher.name}</h3>
                                        <p className="text-sm text-gray-500">Email: {teacher.email}</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 text-sm font-medium">
                                            Active
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTeacher(teacher._id)}
                                            className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100" title="Remove Teacher">
                                            <UserMinus size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'intern-peoples' && role === 'admin' && (
                <div className="w-full">
                    <InternPeopleHub isDashboard={true} />
                </div>
            )}

            {/* Create Internship Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Create New Internship</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleCreateInternship} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input required type="text" value={newInternship.title} onChange={e => setNewInternship({ ...newInternship, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900" placeholder="e.g. Full Stack Web Dev" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required value={newInternship.description} onChange={e => setNewInternship({ ...newInternship, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900" rows="3" placeholder="Brief description..."></textarea>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                    <input required type="text" value={newInternship.duration} onChange={e => setNewInternship({ ...newInternship, duration: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900" placeholder="e.g. 3 Months" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee (₹)</label>
                                    <input type="number" value={newInternship.fee} onChange={e => setNewInternship({ ...newInternship, fee: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900" placeholder="0 for free" />
                                </div>
                            </div>
                            <button type="submit" className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                                Create Internship
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Internship Modal */}
            {showEditModal && editingInternship && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Edit Internship</h2>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleUpdateInternship} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input required type="text" value={editingInternship.title} onChange={e => setEditingInternship({ ...editingInternship, title: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required value={editingInternship.description} onChange={e => setEditingInternship({ ...editingInternship, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900" rows="3"></textarea>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                    <input required type="text" value={editingInternship.duration} onChange={e => setEditingInternship({ ...editingInternship, duration: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee (₹)</label>
                                    <input type="number" value={editingInternship.fee} onChange={e => setEditingInternship({ ...editingInternship, fee: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900" />
                                </div>
                            </div>
                            <button type="submit" className="w-full mt-6 px-4 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                Update Internship
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Syllabus Modal */}
            {showSyllabusModal && editingSyllabus && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Edit Syllabus</h2>
                            <button onClick={() => setShowSyllabusModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleUpdateSyllabus} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Syllabus Content</label>
                                <textarea required value={editingSyllabus.content} onChange={e => setEditingSyllabus({ ...editingSyllabus, content: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm" rows="10" placeholder="Enter syllabus content..."></textarea>
                            </div>
                            <button type="submit" className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                                Update Syllabus
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Generate Teacher Modal */}
            {showTeacherModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Generate Teacher Account</h2>
                            <button onClick={() => setShowTeacherModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleGenerateTeacher} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher Name *</label>
                                <input
                                    required
                                    type="text"
                                    value={newTeacher.name}
                                    onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                                <input
                                    required
                                    type="email"
                                    value={newTeacher.email}
                                    onChange={e => setNewTeacher({ ...newTeacher, email: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm text-slate-900"
                                    placeholder="e.g. teacher@example.com"
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-1">
                                    <label className="block text-sm font-medium text-gray-700">Password *</label>
                                    <button
                                        type="button"
                                        onClick={() => setNewTeacher({ ...newTeacher, password: generateRandomPassword() })}
                                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                                        Generate
                                    </button>
                                </div>
                                <input
                                    required
                                    type="text"
                                    value={newTeacher.password}
                                    onChange={e => setNewTeacher({ ...newTeacher, password: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm font-mono text-slate-900"
                                    placeholder="Enter password"
                                />
                                <p className="text-xs text-gray-500 mt-1">Click "Generate" to auto-generate a password</p>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                                <p className="text-xs text-blue-700">
                                    <span className="font-semibold">Info:</span> Teachers will login with their email and this password. Make sure to share these credentials securely.
                                </p>
                            </div>
                            <button type="submit" className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                                Generate Teacher Account
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Issue Certificate Modal */}
            {showIssueCertificateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Issue Certificate</h2>
                            <button onClick={() => setShowIssueCertificateModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleIssueCertificate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Student *</label>
                                <select
                                    required
                                    value={newCertificateData.studentId}
                                    onChange={e => setNewCertificateData({ ...newCertificateData, studentId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                >
                                    <option value="">Choose a student...</option>
                                    {students.map(s => (
                                        <option key={s._id} value={s._id}>{s.name} ({s.email})</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Internship *</label>
                                <select
                                    required
                                    value={newCertificateData.internshipId}
                                    onChange={e => setNewCertificateData({ ...newCertificateData, internshipId: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                >
                                    <option value="">Choose an internship...</option>
                                    {internships.map(i => (
                                        <option key={i._id} value={i._id}>{i.title}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full mt-6 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors text-sm">
                                Issue Certificate
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Decline Certificate Modal */}
            {showDeclineModal && selectedCertificate && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-4 md:p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg md:text-xl font-bold text-gray-900">Decline Certificate</h2>
                            <button onClick={() => setShowDeclineModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        </div>
                        <form onSubmit={handleDeclineCertificate} className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Student: <span className="font-semibold">{selectedCertificate.student?.name}</span>
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Decline *</label>
                                <textarea
                                    required
                                    value={declineReason}
                                    onChange={e => setDeclineReason(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary text-sm"
                                    rows="4"
                                    placeholder="Explain why the certificate is being declined..."
                                />
                            </div>
                            <button type="submit" className="w-full mt-6 px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-sm">
                                Decline Certificate
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperDashboard;
