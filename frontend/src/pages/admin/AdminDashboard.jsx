import { Plus, Edit2, Trash2, Users, BookOpen } from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-soft border border-gray-100">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
                    <p className="text-gray-500 mt-1">Manage everything across Zentro Solutions</p>
                </div>
                <button className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center">
                    <Plus className="mr-2" size={20} /> New Internship
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Internships Management List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center">
                            <BookOpen className="text-primary mr-2" /> Active Internships
                        </h2>
                    </div>

                    {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="mb-4 md:mb-0">
                                <h3 className="text-lg font-bold text-gray-900">MERN Stack Development {item}</h3>
                                <div className="text-sm text-gray-500 mt-1 flex space-x-4">
                                    <span>Teacher: John Doe</span>
                                    <span>Students: 42</span>
                                    <span>Duration: 15 Days</span>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <button className="p-2 text-gray-400 hover:text-primary transition-colors bg-gray-50 hover:bg-indigo-50 rounded-lg">
                                    <Edit2 size={18} />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 hover:bg-red-50 rounded-lg">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* User Management */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center">
                                <Users className="text-primary mr-2" /> Recent Users
                            </h2>
                            <button className="text-sm text-primary font-medium">View All</button>
                        </div>

                        <div className="space-y-4">
                            {[1, 2, 3, 4].map(idx => (
                                <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-primary flex items-center justify-center font-bold text-sm">
                                            S{idx}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Student Name {idx}</p>
                                            <p className="text-xs text-gray-500">MERN Stack</p>
                                        </div>
                                    </div>
                                    <button className="text-xs font-semibold text-red-500 hover:underline">Remove</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg bg-indigo-50 border-indigo-100">
                        <h3 className="font-bold text-gray-900 mb-2">System Status</h3>
                        <p className="text-sm text-gray-600 mb-4">All services are running smoothly. Database connection is currently skipped per user requirement.</p>
                        <div className="flex items-center text-sm text-green-600 font-semibold">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                            Frontend UI Active
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
