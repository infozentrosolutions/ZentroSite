import { Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import NotFoundGif from '../../assets/404 error page with cat.gif';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
            {/* Background ambient blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 bg-indigo-300 transition-colors duration-1000"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 bg-blue-300 transition-colors duration-1000"></div>

            <div className="relative w-full max-w-5xl h-[650px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100/50 backdrop-blur-sm">

                {/* Visual Side */}
                <div className="w-full md:w-1/2 h-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 p-12 flex flex-col justify-center text-white relative overflow-hidden">
                    {/* Glassmorphism decorative elements */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                    <div className="absolute bottom-10 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>

                    <div className="relative z-10 transition-all duration-500 transform translate-y-0 opacity-100 delay-300">
                        <img src={NotFoundGif} alt="404 Not Found" className="w-48 h-auto mb-6 rounded-2xl shadow-xl mix-blend-screen" />
                        <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">Page Not<br />Found 🛑</h2>
                        <p className="text-lg text-indigo-100/90 leading-relaxed max-w-sm">
                            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                        </p>
                    </div>
                </div>

                {/* Action Side */}
                <div className="w-full md:w-1/2 h-full flex flex-col justify-center items-center p-12 xl:p-16 relative">
                    <div className="w-full max-w-sm mx-auto text-center flex flex-col items-center">
                        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-8">
                            <AlertCircle className="w-12 h-12 text-indigo-600" />
                        </div>
                        <h3 className="text-3xl font-extrabold text-gray-900 mb-4">Lost in Space?</h3>
                        <p className="text-gray-500 mb-10">Don't worry, even the best developers take a wrong turn sometimes.</p>

                        <Link to="/" className="w-full py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-indigo-600/30 flex justify-center items-center">
                            <ArrowLeft className="mr-2 w-5 h-5" />
                            Back to Homepage
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NotFound;
