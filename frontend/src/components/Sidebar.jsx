import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { Home, BookOpen, CheckSquare, Calendar, Users, Briefcase, FileText, Settings, LogOut, Video, Upload, Award, User, X } from 'lucide-react';
import { useState } from 'react';

const Sidebar = ({ onClose, isOpen = true }) => {
    // In a real app, this would be determined by auth state context
    // For demo, we parse the role from the URL
    const pathname = window.location.pathname;
    const role = pathname.includes('admin') ? 'admin' : pathname.includes('teacher') ? 'teacher' : 'student';
    const [searchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'internships';

    const studentLinks = [
        { name: 'My Internship', path: '/dashboard/student', icon: <BookOpen size={20} /> },
        { name: 'Daily Tasks', path: '/dashboard/student', icon: <CheckSquare size={20} /> },
        { name: 'Attendance', path: '/dashboard/student', icon: <Calendar size={20} /> },
        { name: 'Live Class', path: '/dashboard/student', icon: <Video size={20} /> },
        { name: 'Submit Project', path: '/dashboard/student', icon: <Upload size={20} /> },
        { name: 'Assessment', path: '/dashboard/student', icon: <FileText size={20} /> },
        { name: 'Certificate', path: '/dashboard/student', icon: <Award size={20} /> },
        { name: 'Profile', path: '/dashboard/student', icon: <User size={20} /> },
    ];

    const superLinks = [
        { id: 'internships', name: 'Internship Mgmt', icon: <Briefcase size={20} />, activeFor: ['admin'] },
        { id: 'students', name: 'Student Mgmt', icon: <Users size={20} />, activeFor: ['admin', 'teacher'] },
        { id: 'batches', name: 'Batch Mgmt', icon: <Users size={20} />, activeFor: ['admin', 'teacher'] },
        { id: 'attendance', name: 'Attendance', icon: <Calendar size={20} />, activeFor: ['admin', 'teacher'] },
        { id: 'certificates', name: 'Certificates', icon: <FileText size={20} />, activeFor: ['admin', 'teacher'] },
        { id: 'teachers', name: 'Teacher Mgmt', icon: <Users size={20} />, activeFor: ['admin'] },
    ];

    const links = role === 'student' ? studentLinks : superLinks.filter(link => link.activeFor.includes(role));

    // Desktop sidebar
    const sidebarContent = (
        <aside className="h-full bg-white shadow-soft flex flex-col pt-6">
            <div className="px-6 mb-8">
                <Link to="/" className="text-2xl font-bold text-primary">Zentro<span className="text-accent">Solutions</span></Link>
            </div>

            <div className="flex-1 px-4 space-y-2 overflow-y-auto">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                    {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                </div>
                {links.map((link, idx) => {
                    const isActive = link.id && link.id === activeTab;
                    return (
                        <Link 
                            key={idx} 
                            to={link.id ? `?tab=${link.id}` : link.path} 
                            className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                                isActive 
                                    ? 'bg-indigo-50 text-primary font-semibold' 
                                    : 'text-gray-600 hover:bg-indigo-50 hover:text-primary'
                            }`}
                            onClick={onClose}
                        >
                            {link.icon}
                            <span className="font-medium">{link.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-100">
                <Link to="/" className="flex items-center space-x-3 px-3 py-3 text-red-500 rounded-lg hover:bg-red-50 transition-colors w-full">
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </Link>
            </div>
        </aside>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block fixed left-0 top-0 w-64 h-screen z-40">
                {sidebarContent}
            </div>

            {/* Mobile Sidebar */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div 
                        className="fixed inset-0 bg-black/50 lg:hidden z-30" 
                        onClick={onClose}
                    ></div>
                    {/* Sidebar */}
                    <div className="fixed left-0 top-0 w-64 h-screen bg-white shadow-lg lg:hidden z-40 overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b">
                            <Link to="/" className="text-2xl font-bold text-primary">Zentro<span className="text-accent">Solutions</span></Link>
                            <button onClick={onClose} className="text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="px-4 space-y-2 pt-4">
                            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2">
                                {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
                            </div>
                            {links.map((link, idx) => {
                                const isActive = link.id && link.id === activeTab;
                                return (
                                    <Link 
                                        key={idx} 
                                        to={link.id ? `?tab=${link.id}` : link.path} 
                                        className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                                            isActive 
                                                ? 'bg-indigo-50 text-primary font-semibold' 
                                                : 'text-gray-600 hover:bg-indigo-50 hover:text-primary'
                                        }`}
                                        onClick={onClose}
                                    >
                                        {link.icon}
                                        <span className="font-medium text-sm">{link.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="p-4 border-t border-gray-100 mt-auto">
                            <Link to="/" className="flex items-center space-x-3 px-3 py-3 text-red-500 rounded-lg hover:bg-red-50 transition-colors w-full">
                                <LogOut size={20} />
                                <span className="font-medium text-sm">Logout</span>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Sidebar;
