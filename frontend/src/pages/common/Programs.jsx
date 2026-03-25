import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import api from '../../utils/api';
import { Briefcase, Calendar, Clock, ArrowRight, BookOpen, CheckCircle, GraduationCap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Quiz from './Quiz';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Programs = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('programs');
    const comp = useRef(null);
    const pinTriggerRef = useRef(null);
    const trackWrapperRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const res = await api.get('/internships');
                setPrograms(res.data.data || []);
            } catch (err) {
                console.error('Failed to load programs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrograms();
    }, []);

    useLayoutEffect(() => {
        if (loading || programs.length === 0 || activeTab !== 'programs') return;

        let ctx = gsap.context(() => {
            // Give layout a tick to settle before triggering ScrollTrigger calculations
            setTimeout(() => {
                let track = trackRef.current;
                let wrapper = trackWrapperRef.current;
                let trigger = pinTriggerRef.current;

                if (track && wrapper && trigger) {

                    // Get the true scrolling width needed
                    let maxScroll = track.scrollWidth - wrapper.offsetWidth;

                    if (maxScroll > 0) {
                        gsap.to(track, {
                            x: -maxScroll,
                            ease: "none",
                            scrollTrigger: {
                                trigger: trigger,
                                start: "top 20px", // Pin slightly down from the top header
                                pin: true,
                                scrub: 1, // Smooth scrubbing
                                end: () => `+=${maxScroll}`,
                                invalidateOnRefresh: true, // Recalculates on resize
                            }
                        });
                    }
                }
            }, 100);
        }, comp);

        return () => ctx.revert();
    }, [loading, programs.length, activeTab]);

    return (
        <div ref={comp} className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#0B0F19]">
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                    opacity: 0;
                }
                @keyframes badgePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-badge-pulse {
                    animation: badgePulse 2s infinite ease-in-out;
                }
                @keyframes fadeTextIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .animate-fade-text {
                    animation: fadeTextIn 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
                    opacity: 0;
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
            <div ref={pinTriggerRef} className="max-w-7xl mx-auto relative z-10 pt-8 flex flex-col">
                <div className="text-center mb-8 flex-shrink-0">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Available Programs</h1>
                    <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
                        Explore our hands-on, industry-aligned internship programs designed to kickstart your tech career.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 md:gap-8 flex-grow overflow-hidden pb-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0 z-20">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-sm border border-white/10 p-4">
                            <nav className="relative space-y-1">
                                {/* Animated background pill */}
                                <div
                                    className={`absolute left-0 w-full h-[44px] bg-indigo-600/30 rounded-xl transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] z-0 ${activeTab === 'programs' ? 'top-0' : 'top-[52px]'}`}
                                />
                                <button
                                    onClick={() => setActiveTab('programs')}
                                    className={`relative z-10 flex items-center w-full px-3 py-2.5 rounded-xl font-medium transition-colors ${activeTab === 'programs' ? 'text-white' : 'text-indigo-200 hover:text-white'}`}
                                >
                                    <GraduationCap size={18} className="mr-3" />
                                    All Programs
                                </button>
                                <button
                                    onClick={() => setActiveTab('quiz')}
                                    className={`relative z-10 flex items-center w-full px-3 py-2.5 rounded-xl font-medium transition-colors mt-2 ${activeTab === 'quiz' ? 'text-white' : 'text-indigo-200 hover:text-white'}`}
                                >
                                    <CheckCircle size={18} className="mr-3" />
                                    Skill Quiz
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {activeTab === 'programs' ? (
                            loading ? (
                                <div className="flex flex-col items-center justify-center py-20">
                                    <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                                    <p className="text-gray-500 text-lg font-medium">Loading programs...</p>
                                </div>
                            ) : programs.length === 0 ? (
                                <div className="text-center py-20 bg-white/5 backdrop-blur-xl rounded-3xl shadow-sm border border-white/10 w-full">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl">📭</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">No programs currently open</h3>
                                    <p className="text-indigo-200 text-lg">We are preparing our next batch of internship programs. Please check back later!</p>
                                </div>
                            ) : (
                                <div ref={trackWrapperRef} className="relative py-8 flex items-center overflow-hidden w-full pl-4 rounded-3xl bg-white/5 border border-white/10 shadow-2xl h-full">
                                    {/* Background Gradient Blobs */}
                                    <div className="absolute top-0 -left-10 w-96 h-96 bg-indigo-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none"></div>
                                    <div className="absolute top-0 -right-10 w-96 h-96 bg-violet-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none"></div>
                                    <div className="absolute -bottom-8 left-20 w-96 h-96 bg-purple-500/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000 pointer-events-none"></div>

                                    <div ref={trackRef} className="flex gap-8 items-center relative z-10 w-max pr-[50vw]">
                                        {programs.map((prog, index) => (
                                            <div
                                                key={prog._id}
                                                className="program-card-gsap w-[85vw] sm:w-[400px] md:w-[450px] bg-white/5 backdrop-blur-xl rounded-2xl shadow-[0_4px_30px_rgb(0,0,0,0.1)] border border-white/10 overflow-hidden hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] hover:bg-white/10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] transform hover:-translate-y-2 flex flex-col h-[500px] animate-fade-in-up"
                                                style={{ animationDelay: `${index * 0.1}s` }}
                                            >
                                                <div className="p-8 flex-grow relative z-20">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider rounded-full animate-badge-pulse origin-center border border-indigo-500/30">
                                                            Open Now
                                                        </div>
                                                    </div>
                                                    <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">{prog.title}</h2>
                                                    <p className="text-indigo-100/70 mb-8 leading-relaxed line-clamp-3 text-lg">{prog.description}</p>

                                                    <div
                                                        className="space-y-4 mb-6 flex-grow flex flex-col justify-end h-full animate-fade-text"
                                                        style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                                                    >
                                                        {prog.duration && (
                                                            <div className="flex items-center text-indigo-200 text-base font-medium">
                                                                <Clock size={18} className="mr-3 text-indigo-400" />
                                                                <span>Duration: {prog.duration}</span>
                                                            </div>
                                                        )}
                                                        {prog.startDate && (
                                                            <div className="flex items-center text-indigo-200 text-base font-medium">
                                                                <Calendar size={18} className="mr-3 text-indigo-400" />
                                                                <span>Starts: {new Date(prog.startDate).toLocaleDateString()}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="p-6 bg-black/20 border-t border-white/5 flex items-center justify-between mt-auto relative z-20 rounded-b-2xl backdrop-blur-md">
                                                    <div
                                                        className="animate-fade-text"
                                                        style={{ animationDelay: `${index * 0.1 + 0.3}s` }}
                                                    >
                                                        <p className="text-[11px] tracking-widest text-indigo-300/70 uppercase font-bold mb-1">Fee</p>
                                                        <p className="text-2xl font-black text-white">₹{prog.fee}</p>
                                                    </div>
                                                    <a href="https://forms.gle/gnFNyf6JbciYNSqy8" target="_blank" rel="noopener noreferrer" className="group px-6 py-3 bg-indigo-600 text-white text-base font-bold rounded-xl hover:bg-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.6)] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 focus:ring-offset-[#0B0F19] flex items-center hover:scale-[1.05]">
                                                        <span>Apply Now</span>
                                                        <ArrowRight size={18} className="ml-2 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-1.5" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ) : (
                            <Quiz isEmbedded={true} onViewPrograms={() => setActiveTab('programs')} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Programs;
