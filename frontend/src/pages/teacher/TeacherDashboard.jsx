import { useState } from 'react';
import { Users, BookOpen, CheckCircle, FileBadge, UserPlus } from 'lucide-react';

const TeacherDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-soft border border-gray-100 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Teacher Portal</h1>
                    <p className="text-gray-500 mt-1">Assigned: MERN Stack Development Internship</p>
                </div>
                <button className="px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center">
                    <BookOpen className="mr-2 w-5 h-5" /> Manage Syllabus
                </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 border-b border-gray-200 pb-px mb-6">
                {['Overview', 'Batches & Students', 'Daily Tasks', 'Certificates'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab.toLowerCase().split(' ')[0])}
                        className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 
              ${activeTab === tab.toLowerCase().split(' ')[0]
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            {activeTab === 'overview' && (
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg bg-indigo-50 border-indigo-100 flex items-center space-x-4">
                        <div className="p-3 bg-white rounded-lg"><Users className="text-primary w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Total Students</p>
                            <h3 className="text-2xl font-bold text-gray-900">42</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg bg-green-50 border-green-100 flex items-center space-x-4">
                        <div className="p-3 bg-white rounded-lg"><CheckCircle className="text-green-600 w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Tasks Reviewed</p>
                            <h3 className="text-2xl font-bold text-gray-900">128</h3>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg bg-yellow-50 border-yellow-100 flex items-center space-x-4">
                        <div className="p-3 bg-white rounded-lg"><FileBadge className="text-yellow-600 w-6 h-6" /></div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Certificates Issued</p>
                            <h3 className="text-2xl font-bold text-gray-900">0</h3>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'batches' && (
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Batch A (Morning)</h2>
                            <button className="text-sm text-primary font-medium flex items-center"><UserPlus size={16} className="mr-1" /> Add Student</button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                            {[1, 2, 3, 4, 5].map(i => (
                                <div key={`a-${i}`} className="p-3 border border-gray-100 rounded-lg flex justify-between items-center bg-gray-50/50 hover:bg-white cursor-grab transition-colors">
                                    <div className="font-medium text-gray-800">Student Name {i}</div>
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">Present</button>
                                        <button className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">Absent</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg h-[500px] flex flex-col">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Batch B (Evening)</h2>
                            <button className="text-sm text-primary font-medium flex items-center"><UserPlus size={16} className="mr-1" /> Add Student</button>
                        </div>
                        <div className="flex-1 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400">
                            Drag students here to assign to Batch B
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'certificates' && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Issue Certificates Manual Review</h2>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase">
                                <th className="pb-3 pt-2 px-4">Student</th>
                                <th className="pb-3 pt-2 px-4">Attendance</th>
                                <th className="pb-3 pt-2 px-4">Tasks</th>
                                <th className="pb-3 pt-2 px-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map(i => (
                                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="py-4 px-4 font-medium text-gray-900">Jane Smith {i}</td>
                                    <td className="py-4 px-4 text-green-600 font-medium">15/15</td>
                                    <td className="py-4 px-4 text-green-600 font-medium">100%</td>
                                    <td className="py-4 px-4">
                                        <button className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 py-1.5 text-sm px-4">Issue Certificate</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <p className="text-sm text-gray-500 mt-6">* Certificates are not auto-generated. Please carefully review student performance before issuing.</p>
                </div>
            )}
        </div>
    );
};

export default TeacherDashboard;
