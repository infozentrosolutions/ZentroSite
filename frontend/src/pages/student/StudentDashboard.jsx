import { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { CheckSquare, Calendar, Video, FileText, Download, BookOpen, Upload, Award, User, Lock, ExternalLink } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);
    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-10">
            <Helmet>
                <title>Student Dashboard | Zentro Solutions</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            {/* 1. My Internship & 2. Profile Summary */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div className="flex items-center mb-4 text-primary">
                        <BookOpen className="mr-3" size={28} />
                        <h1 className="text-3xl font-bold text-gray-900">My Internship</h1>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">MERN Stack Development</h2>
                    <p className="text-gray-500 mb-6">Mastering MongoDB, Express, React, and Node.js through practical projects.</p>
                    <div className="flex gap-4">
                        <span className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-lg text-sm border border-indigo-100">Batch: March 2024 (A)</span>
                        <span className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg text-sm border border-blue-100">Duration: 15 Days</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <User size={32} className="text-primary" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{user?.name || 'Loading...'}</h3>
                    <p className="text-gray-500 text-sm mb-4">{user?.email || 'Loading...'}</p>
                    <div className="flex items-center text-xs text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                        <Lock size={12} className="mr-1" /> Profile is Read-Only
                    </div>
                </div>
            </div>

            {/* 3. Join Live Class & 4. Attendance */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center justify-between">
                    <div>
                        <div className="flex items-center mb-2">
                            <Video className="text-red-500 mr-2" size={24} />
                            <h2 className="text-xl font-bold text-gray-900">Live Class</h2>
                        </div>
                        <p className="text-gray-500 text-sm">Join the daily interactive mentor session.</p>
                    </div>
                    <a href="#" className="flex items-center px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 border border-red-100 transition-colors">
                        Join Now <ExternalLink size={18} className="ml-2" />
                    </a>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <Calendar className="text-primary mr-2" /> Attendance
                        </h2>
                        <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-sm">80%</span>
                    </div>
                    <div className="flex justify-between items-center mb-2 text-sm">
                        <span className="text-gray-600 font-medium">Present: <span className="text-gray-900 font-bold">12 Days</span></span>
                        <span className="text-gray-600 font-medium">Absent: <span className="text-gray-900 font-bold">3 Days</span></span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full w-[80%]"></div>
                    </div>
                </div>
            </div>

            {/* 5. Daily Tasks & 6. Submit Project */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <CheckSquare className="text-primary mr-2" /> Daily Tasks
                        </h2>
                        <span className="text-sm font-medium text-gray-500">Day 12 of 15</span>
                    </div>

                    <div className="space-y-4">
                        <div className="border border-gray-100 bg-gray-50/50 p-5 rounded-xl">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900 text-lg">Task 12: React Router & State</h3>
                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full border border-yellow-200">Pending</span>
                            </div>
                            <p className="text-gray-600 mb-4 text-sm">Implement client-side routing and global state management using Context API for the e-commerce cart.</p>

                            {/* Read Only Submission Status */}
                            <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between">
                                <span className="text-sm text-gray-500">Not submitted yet. Submit via form below.</span>
                            </div>
                        </div>

                        <div className="border border-gray-100 p-5 rounded-xl opacity-75">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-gray-900">Task 11: JWT Authentication</h3>
                                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full border border-green-200">Reviewed</span>
                            </div>
                            <p className="text-sm text-gray-500">Graded: 10/10 - Excellent implementation.</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Submit Project */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 bg-indigo-50/30">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center mb-4">
                            <Upload className="text-primary mr-2" /> Submit Project
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">Submit your final mega project GitHub repository link here for evaluation.</p>
                        <div className="space-y-3">
                            <input type="text" placeholder="https://github.com/..." className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary" />
                            <button className="w-full py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm text-sm">
                                Submit Repository
                            </button>
                        </div>
                    </div>

                    {/* 7. Assessment & 8. Certificate */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center mb-4">
                            <FileText className="text-accent mr-2" /> Assessment Score
                        </h2>
                        <div className="flex items-end space-x-2 mb-4">
                            <span className="text-4xl font-extrabold text-gray-900">92</span>
                            <span className="text-gray-500 font-medium mb-1">/ 100</span>
                        </div>
                        <p className="text-xs text-gray-500 bg-gray-50 p-2 rounded border border-gray-100">Top 10% of the batch. Excellent performance in backend APIs.</p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center border-dashed border-2 border-indigo-100">
                        <Award className="w-10 h-10 text-primary mx-auto mb-2 opacity-80" />
                        <h3 className="font-bold text-gray-900 mb-1">Certificate</h3>
                        <p className="text-xs text-gray-500 mb-4">Unlocked upon completion.</p>
                        <button className="w-full py-2 bg-gray-100 text-gray-400 font-medium rounded-lg cursor-not-allowed flex items-center justify-center text-sm" disabled>
                            <Download size={16} className="mr-2" /> Download Link
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
