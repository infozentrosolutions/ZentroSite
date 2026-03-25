import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, GraduationCap, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeacherLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            const data = res.data;

            if (data.role === 'teacher') {
                login(data);
                toast.success('Login Successful!');
                navigate(`/dashboard/teacher`);
            } else {
                toast.error('Unauthorized access. This portal is for Teachers only.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-100 border border-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <GraduationCap className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Teacher Portal</h2>
                    <p className="mt-2 text-sm text-gray-600">Login with your credentials to access the dashboard</p>
                </div>

                <form className="space-y-6" onSubmit={handleLogin}>
                    <div className="pt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder-gray-500"
                                placeholder="your.email@example.com"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 pr-12 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder-gray-500"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'} <ArrowRight size={20} />
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600">
                        Don't have credentials?{' '}
                        <span className="text-indigo-600 font-semibold">
                            Contact your administrator
                        </span>
                    </p>
                </div>

                <div className="mt-6 flex gap-2">
                    <Link to="/" className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        Home
                    </Link>
                    <Link to="/login" className="flex-1 text-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                        Student Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default TeacherLogin;
