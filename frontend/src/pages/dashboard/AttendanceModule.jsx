import { useState } from 'react';
import { Calendar, Users, Target, CheckCircle, XCircle, Clock, Search, Filter, LayoutGrid } from 'lucide-react';

const mockStudents = [
    { id: 1, name: 'Alex Johnson', email: 'alex.j@example.com', batch: 'Batch 1', program: 'MERN Intern', present: 22, absent: 2, status: 'present' },
    { id: 2, name: 'Samantha Lee', email: 'sam.lee@example.com', batch: 'Batch 2', program: 'MERN Intern', present: 24, absent: 0, status: 'present' },
    { id: 3, name: 'Michael Chen', email: 'm.chen@example.com', batch: 'Batch 1', program: 'Python Intern', present: 18, absent: 6, status: 'absent' },
    { id: 4, name: 'Emily Davis', email: 'emily.d@example.com', batch: 'Batch 2', program: 'MERN Intern', present: 20, absent: 4, status: 'not-marked' },
    { id: 5, name: 'Robert Wilson', email: 'r.wilson@example.com', batch: 'Batch 1', program: 'Data Science Intern', present: 23, absent: 1, status: 'present' },
];

const AttendanceModule = () => {
    const [dateFilter, setDateFilter] = useState('Today');
    const totalDays = 24;

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
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-700 mr-2">March 2026 Batch</span>
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
                    <button className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/40 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Mark Today
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { title: 'Total Students', value: '120', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                    { title: 'Days Conducted', value: '24', icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
                    { title: 'Today Present', value: '115', icon: Target, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
                    { title: 'Today Absent', value: '5', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
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
                            {mockStudents.map((student) => {
                                const percentage = Math.round((student.present / totalDays) * 100);
                                return (
                                    <tr key={student.id} className="hover:bg-gray-50/80 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200/50 group-hover:scale-105 transition-transform">
                                                        {student.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                                        {student.name}
                                                        <span className="px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100/50">
                                                            {student.batch}
                                                        </span>
                                                        <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase rounded-full border ${student.program.includes('MERN') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                            {student.program}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-500">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm font-semibold text-gray-700">{student.present}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className="text-sm font-semibold text-gray-700">{student.absent}</span>
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
                                            <StatusBadge status={student.status} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {/* Pagination placeholder matching the design language */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Showing 1 to 5 of 120 results</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50">Previous</button>
                        <button className="px-3 py-1 text-sm border border-indigo-500 rounded-md bg-indigo-50 text-indigo-700 font-medium">1</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendanceModule;
