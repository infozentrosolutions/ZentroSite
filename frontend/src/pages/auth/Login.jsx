import { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCircle, Eye, EyeOff } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';
import LoginGif from '../../assets/Login.gif';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    // Determine initial state based on route (e.g. if arriving at /login/admin)
    const location = useLocation();
    const [isStudentMode, setIsStudentMode] = useState(!location.pathname.includes('admin'));

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Reset fields when switching modes
    useEffect(() => {
        setEmail('');
        setPassword('');
        setShowPassword(false);
    }, [isStudentMode]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            const data = res.data;

            if (isStudentMode) {
                if (data.role === 'student') {
                    login(data);
                    toast.success('Login Successful!');
                    navigate('/dashboard/student');
                } else {
                    toast.error('Unauthorized. Please use the Admin login portal.');
                }
            } else {
                if (data.role === 'admin' || data.role === 'teacher') {
                    login(data);
                    toast.success('Login Successful!');
                    navigate(`/dashboard/${data.role}`);
                } else {
                    toast.error('Unauthorized. Please use the Student login portal.');
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed. Please check credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ zoom: "80%" }} className="min-h-[125vh] bg-[#FDFBF7] flex items-center justify-center p-4 pt-32 pb-12 sm:p-6 lg:p-8 relative overflow-hidden">
            <ToastContainer position="top-right" autoClose={4000} />
            {/* Background ambient blobs */}
            <div className={`absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 transition-colors duration-1000 ${isStudentMode ? 'bg-indigo-300' : 'bg-purple-300'}`}></div>
            <div className={`absolute bottom-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 transition-colors duration-1000 ${isStudentMode ? 'bg-blue-300' : 'bg-violet-400'}`}></div>

            <div className="relative w-full max-w-5xl h-[650px] bg-white rounded-3xl mt-12 lg:mt-24 shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100/50 backdrop-blur-sm">

                {/* 
                  MOBILE VIEW (Stacked) 
                  Visible only on small screens
                */}
                <div className="md:hidden flex flex-col w-full h-full overflow-y-auto">
                    <div className={`p-8 text-white transition-colors duration-700 ${isStudentMode ? 'bg-gradient-to-br from-indigo-600 to-blue-700' : 'bg-gradient-to-br from-violet-800 to-purple-900'}`}>
                        <div className="flex items-center space-x-3 mb-6">
                            {isStudentMode ? <UserCircle className="w-8 h-8 text-indigo-200" /> : <ShieldCheck className="w-8 h-8 text-purple-200" />}
                            <h2 className="text-2xl font-bold">{isStudentMode ? 'Student Portal' : 'Admin Portal'}</h2>
                        </div>
                        <p className="text-indigo-100">
                            {isStudentMode
                                ? "Start building your future with real-world projects and expert mentorship."
                                : "Manage students, monitor performance, and control internship programs efficiently."}
                        </p>
                    </div>
                    <div className="p-8 flex-grow flex flex-col justify-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-6">{isStudentMode ? 'Student Login' : 'Admin Login'}</h3>
                        {/* Mobile Form */}
                        <form className="space-y-5" onSubmit={handleLogin}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{isStudentMode ? 'Email Address' : 'Admin Email'}</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder={isStudentMode ? 'student@example.com' : 'info.zentro.solutions@gmail.com'} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-12 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg flex justify-center items-center transition-all duration-300 disabled:opacity-70 ${isStudentMode ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30' : 'bg-violet-700 hover:bg-violet-800 shadow-violet-700/30'}`}>
                                {loading ? 'Logging in...' : (isStudentMode ? 'Login as Student' : 'Login as Admin')}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </form>
                        <div className="mt-8 text-center">
                            <button onClick={() => setIsStudentMode(!isStudentMode)} className="text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
                                {isStudentMode ? 'Are you an Admin? Switch to Admin Login' : 'Are you a Student? Switch to Student Login'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 
                  DESKTOP VIEW (Split Screen with sliding animation) 
                  Hidden on small screens
                */}
                <div className="hidden md:block w-full h-full relative">

                    {/* Welcome Overlay Panel (Slides Left/Right) */}
                    <div
                        className={`absolute top-0 h-full w-1/2 z-20 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] transform
                            ${isStudentMode ? 'translate-x-0' : 'translate-x-full'}`}
                    >
                        <div className={`absolute inset-0 transition-opacity duration-500 ${isStudentMode ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                            <div className="w-full h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 p-12 flex flex-col justify-center text-white relative overflow-hidden">
                                {/* Glassmorphism decorative elements */}
                                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>

                                <div className={`transition-all duration-500 transform pt-12 ${isStudentMode ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-8 opacity-0'}`}>
                                    <img src={LoginGif} alt="Welcome Animation" className="w-44 h-44 mb-4 rounded-xl shadow-lg mix-blend-screen transform translate-x-6" />
                                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">Welcome,<br />Student</h2>
                                    <p className="text-lg text-indigo-100/90 leading-relaxed max-w-sm">
                                        Start building your future with real-world projects and expert mentorship.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`absolute inset-0 transition-opacity duration-500 ${!isStudentMode ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
                            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-violet-900 to-purple-900 p-12 flex flex-col justify-center text-white relative overflow-hidden">
                                <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>
                                <div className="absolute bottom-20 left-10 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl"></div>

                                <div className={`transition-all duration-500 transform pt-12 ${!isStudentMode ? 'translate-y-0 opacity-100 delay-300' : 'translate-y-8 opacity-0'}`}>
                                    <img src={LoginGif} alt="Welcome Animation" className="w-44 h-44 mb-4 rounded-xl shadow-lg mix-blend-screen transform translate-x-6" />
                                    <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">Welcome,<br />Admin 🛠️</h2>
                                    <p className="text-lg text-purple-100/80 leading-relaxed max-w-sm">
                                        Manage students, monitor performance, and control internship programs efficiently.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Panel (Static background behind sliding overlay, but we slide the forms themselves) */}
                    <div className="absolute inset-0 w-full h-full flex">

                        {/* Student Form Side (Right visually when StudentMode=true, Left visually when StudentMode=false) */}
                        <div className={`w-1/2 h-full flex flex-col justify-center p-12 xl:p-16 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] transform absolute top-0
                            ${isStudentMode ? 'translate-x-full opacity-100 z-10' : 'translate-x-full opacity-0 pointer-events-none z-0 scale-95'}`}>

                            <div className="w-full max-w-sm mx-auto">
                                <h3 className="text-3xl font-extrabold text-gray-900 mb-8">Student Login</h3>

                                <form className="space-y-6" onSubmit={handleLogin}>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500" />
                                            </div>
                                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-gray-900 placeholder-gray-400" placeholder="student@example.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-600">
                                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500" />
                                            </div>
                                            <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-12 pr-12 w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 focus:bg-white transition-all outline-none font-medium text-gray-900 placeholder-gray-400" placeholder="••••••••" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <div className="flex justify-end mt-3">
                                            <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">Forgot password?</a>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-indigo-600/30 flex justify-center items-center disabled:opacity-70 disabled:transform-none mt-2">
                                        {loading ? 'Logging in...' : 'Login as Student'}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </button>
                                </form>

                                <div className="mt-10 text-center">
                                    <button onClick={() => setIsStudentMode(false)} className="text-sm font-semibold text-gray-500 hover:text-indigo-600 transition-colors inline-block pb-1 border-b border-transparent hover:border-indigo-600">
                                        Are you an Admin? Switch to Admin Login
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Admin Form Side (Left visually when StudentMode=false, Right visually when StudentMode=true) */}
                        <div className={`w-1/2 h-full flex flex-col justify-center p-12 xl:p-16 transition-all duration-700 ease-[cubic-bezier(0.87,0,0.13,1)] transform absolute top-0
                            ${!isStudentMode ? 'translate-x-0 opacity-100 z-10' : 'translate-x-0 opacity-0 pointer-events-none z-0 scale-95'}`}>

                            <div className="w-full max-w-sm mx-auto">
                                <h3 className="text-3xl font-extrabold text-gray-900 mb-8">Admin Login</h3>

                                <form className="space-y-6" onSubmit={handleLogin}>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Email</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600">
                                                <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500" />
                                            </div>
                                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="pl-12 w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-white transition-all outline-none font-medium text-gray-900 placeholder-gray-400" placeholder="info.zentro.solutions@gmail.com" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-violet-600">
                                                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-violet-500" />
                                            </div>
                                            <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="pl-12 pr-12 w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 focus:bg-white transition-all outline-none font-medium text-gray-900 placeholder-gray-400" placeholder="••••••••" />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600">
                                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            </button>
                                        </div>
                                        <div className="flex justify-end mt-3">
                                            <a href="#" className="text-sm font-semibold text-violet-600 hover:text-violet-800 transition-colors">Forgot password?</a>
                                        </div>
                                    </div>
                                    <button type="submit" disabled={loading} className="w-full py-4 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-slate-900/20 flex justify-center items-center disabled:opacity-70 disabled:transform-none mt-2">
                                        {loading ? 'Logging in...' : 'Login as Admin'}
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </button>
                                </form>

                                <div className="mt-10 text-center">
                                    <button onClick={() => setIsStudentMode(true)} className="text-sm font-semibold text-gray-500 hover:text-violet-600 transition-colors inline-block pb-1 border-b border-transparent hover:border-violet-600">
                                        Are you a Student? Switch to Student Login
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
