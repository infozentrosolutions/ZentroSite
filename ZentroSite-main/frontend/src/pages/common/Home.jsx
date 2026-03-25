import { useRef, useLayoutEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Code, Users, Award, Briefcase, ArrowDown, XCircle, CheckCircle, GraduationCap, Rocket, Star, Handshake } from 'lucide-react';
import './Home.css';
import Footer from '../../components/Footer';
import api from '../../utils/api';
import logo from '../../assets/logo.png';

import moonImg from '../../assets/images (2).jpeg';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const comp = useRef(null);
    const problemRef = useRef(null);
    const gapRef = useRef(null);
    const galleryContainerRef = useRef(null);
    const galleryScrollRef = useRef(null);
    const solutionRef = useRef(null);
    const transformRef = useRef(null);
    const statsRef = useRef(null);
    const ctaRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Hero Animation
            const t1 = gsap.timeline();
            t1.fromTo('.hero-text', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" })
                .fromTo('.hero-btn', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.5, stagger: 0.2, ease: "back.out(1.7)" }, "-=0.4")
                .fromTo('.scroll-indicator', { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1, ease: "bounce.out" }, "-=0.2");

            // Hero Parallax
            gsap.to('.hero-bg', {
                yPercent: 30,
                ease: "none",
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                }
            });

            // Problem Section
            gsap.fromTo('.problem-text',
                { opacity: 0, y: 50 },
                {
                    opacity: 1, y: 0, duration: 1, stagger: 0.4, ease: "power2.out",
                    scrollTrigger: { trigger: problemRef.current, start: "top 70%" }
                }
            );

            // Gap Section
            gsap.fromTo('.gap-text',
                { opacity: 0, scale: 0.95, y: 30 },
                {
                    opacity: 1, scale: 1, y: 0, duration: 1.2, stagger: 0.3, ease: "power3.out",
                    scrollTrigger: { trigger: gapRef.current, start: "top 75%" }
                }
            );

            // Horizontal Scroll Gallery
            let galleryCards = gsap.utils.toArray('.gallery-card');
            if (galleryContainerRef.current && galleryScrollRef.current) {
                gsap.to(galleryCards, {
                    xPercent: -100 * (galleryCards.length - 1),
                    ease: "none",
                    scrollTrigger: {
                        trigger: galleryContainerRef.current,
                        pin: true,
                        scrub: 1, // Smooth scrubbing
                        snap: 1 / (galleryCards.length - 1),
                        end: () => "+=" + galleryScrollRef.current.offsetWidth
                    }
                });
            }

            // Solution Section (Cards)
            gsap.fromTo('.solution-card',
                { opacity: 0, y: 80 },
                {
                    opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.2)",
                    scrollTrigger: { trigger: solutionRef.current, start: "top 75%" }
                }
            );

            // Transformation Section (Left / Right slide)
            gsap.fromTo('.transform-left',
                { opacity: 0, x: -100 },
                { opacity: 1, x: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: transformRef.current, start: "top 75%" } }
            );
            gsap.fromTo('.transform-right',
                { opacity: 0, x: 100 },
                { opacity: 1, x: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: transformRef.current, start: "top 75%" } }
            );

            // Stats Counter
            const stats = gsap.utils.toArray('.stat-num');
            stats.forEach(stat => {
                const dataTarget = stat.getAttribute('data-target');
                if (!dataTarget) return;

                const target = parseFloat(dataTarget);
                const isFloat = dataTarget.includes('.');
                const zero = { val: 0 };

                gsap.to(zero, {
                    val: target,
                    duration: 2.5,
                    ease: "power2.out",
                    scrollTrigger: { trigger: statsRef.current, start: "top 80%" },
                    onUpdate: function () {
                        stat.innerText = isFloat ? zero.val.toFixed(1) : Math.floor(zero.val);
                    }
                });
            });

            // CTA Section
            gsap.fromTo('.cta-content',
                { opacity: 0, y: 50, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ctaRef.current, start: "top 80%" } }
            );

        }, comp);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={comp} className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans overflow-hidden">
            <Helmet>
                <title>Zentro Solutions | Web Development, Internships & Final Year Projects</title>

                <meta
                    name="description"
                    content="Zentro Solutions offers web development services, internships, and final year projects for CSE students. Build real-world skills with expert mentorship."
                />

                <meta
                    name="keywords"
                    content="zentro solutions, web development, internships, final year projects, CSE projects, software training"
                />

                <link rel="canonical" href="https://zentrosolution.fun/" />

                {/* Open Graph / Social Media */}
                <meta property="og:title" content="Zentro Solutions | Web Development & Internships" />
                <meta property="og:description" content="Build real-world skills with expert mentorship in web development and internship programs." />
                <meta property="og:url" content="https://zentrosolution.fun/" />
                <meta property="og:type" content="website" />
            </Helmet>

            {/* 1. Hero Section */}
            <section className="hero-section-custom relative w-full min-h-screen flex flex-col justify-center items-center text-left md:text-left px-4 pt-20 pb-20 border-b border-gray-100/10">
                {/* Blinking Stars Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full blinking-star"
                            style={{
                                top: `${Math.random() * 100}%`,
                                left: `${Math.random() * 100}%`,
                                width: `${Math.random() * 2 + 1}px`,
                                height: `${Math.random() * 2 + 1}px`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${Math.random() * 3 + 2}s`
                            }}
                        />
                    ))}
                </div>

                <div className="relative z-10 max-w-full px-4 md:px-8 lg:px-12 mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-12 items-center">

                    {/* Left Column Text Content */}
                    <div className="hero-text-container z-20 text-center md:text-left flex flex-col items-center md:items-start">
                        <h1 className="hero-text text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight text-white">
                            Zentro Solutions – From College Student to <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                                Industry-Ready Developer
                            </span>
                        </h1>

                        <p className="hero-text text-sm md:text-base text-indigo-100/80 mb-10 max-w-lg font-medium leading-relaxed">
                            Master real-world tech skills with live internship programs. Bridge the gap between academic theory and what top companies actually demand.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mb-10">
                            <a href="https://forms.gle/gnFNyf6JbciYNSqy8" target="_blank" rel="noreferrer" className="hero-btn w-full sm:w-auto px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-500 transition-all duration-300 shadow-xl shadow-indigo-600/20 flex items-center justify-center text-lg transform hover:-translate-y-1">
                                Apply for Internship <ArrowRight className="ml-2 w-5 h-5" />
                            </a>
                            <Link to="/programs" className="hero-btn w-full sm:w-auto px-8 py-3.5 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all duration-300 flex items-center justify-center text-lg shadow-sm">
                                Browse Programs
                            </Link>
                        </div>

                        {/* Trust Score block */}
                        <div className="flex items-center gap-4 mt-8">
                            <div className="hero-trust-avatars flex -space-x-2">
                                <div className="hero-trust-avatar" style={{ background: '#3b82f6', zIndex: 4 }}>R</div>
                                <div className="hero-trust-avatar" style={{ background: '#10b981', zIndex: 3 }}>P</div>
                                <div className="hero-trust-avatar" style={{ background: '#f59e0b', zIndex: 2 }}>A</div>
                                <div className="hero-trust-avatar" style={{ background: '#8b5cf6', zIndex: 1 }}>S</div>
                            </div>
                            <div className="text-white text-sm">
                                <div className="font-bold flex items-center gap-1">5000+ <span className="font-normal text-indigo-100">students trained</span></div>
                                <div className="flex items-center gap-1 mt-0.5 text-yellow-400">
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <Star className="w-3 h-3 fill-current" />
                                    <span className="text-indigo-200 text-xs ml-1 font-normal">4.9/5 rating</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column Animations - always visible */}
                    <div className="hidden md:flex justify-center items-center h-full relative z-20">
                        {/* Floating Cards */}
                        <div className="hero-float-card card-1 z-30">
                            <div className="hfc-icon bg-primary"><Briefcase size={20} /></div>
                            <div>
                                <div className="hfc-label">New Openings</div>
                                <div className="hfc-value">200+ Jobs</div>
                            </div>
                        </div>

                        <div className="hero-float-card card-2 z-30">
                            <div className="hfc-icon bg-success"><CheckCircle size={20} /></div>
                            <div>
                                <div className="hfc-label">Placement Rate</div>
                                <div className="hfc-value">95%</div>
                            </div>
                        </div>

                        <div className="hero-float-card card-3 z-30">
                            <div className="hfc-icon bg-warning"><Handshake size={20} /></div>
                            <div>
                                <div className="hfc-label">Partner Companies</div>
                                <div className="hfc-value">50+</div>
                            </div>
                        </div>

                        {/* Center Orb Graphic */}
                        <div className="hero-center-orb">
                            <div className="hero-orbit orbit-1">
                                <div className="hero-orbit-icon"><GraduationCap size={16} /></div>
                            </div>
                            <div className="hero-orbit orbit-2">
                                <div className="hero-orbit-icon"><Briefcase size={16} /></div>
                            </div>
                            <div className="hero-orbit orbit-3">
                                <div className="hero-orbit-icon"><Rocket size={16} /></div>
                            </div>
                            <div className="hero-orbit orbit-4">
                                <div className="hero-orbit-icon" style={{ animationDelay: '-10s' }}><Star size={16} /></div>
                            </div>

                            <div className="hero-core">
                                <div className="hero-core-inner overflow-hidden border-2 border-indigo-400 relative flex items-center justify-center">
                                    <img src={moonImg} alt="Zentro Solutions Technology Background" className="absolute inset-0 w-full h-full object-cover z-0" />
                                    <div className="relative z-10 w-20 h-20 shimmer-effect drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
                                        <img src={logo} alt="Zentro Solutions Logo - Web Development Company" className="w-full h-full object-contain mix-blend-screen" />
                                    </div>
                                </div>
                                <div className="hero-core-glow" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optional Wave Divider (If Needed) */}
                <div className="absolute bottom-0 inset-x-0 w-full z-10 pointer-events-none opacity-20 hidden">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="w-full h-12">
                        <path d="M0,64 C360,120 720,0 1080,64 C1260,96 1380,80 1440,64 L1440,120 L0,120 Z" fill="#FDFBF7" />
                    </svg>
                </div>
                <p style={{ display: "none" }}>
                    Zentro Solutions is a leading web development company offering internships,
                    software training, and final year projects for CSE students. We help students
                    become industry-ready developers with real-world experience.
                </p>
            </section>

            {/* 2. Problem Section */}
            <section ref={problemRef} className="pt-32 pb-16 px-4 bg-slate-50 relative overflow-hidden border-b border-gray-100">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col gap-4">
                    <h2 className="problem-text text-3xl md:text-5xl font-bold text-gray-400">
                        College teaches theory.
                    </h2>
                    <h2 className="problem-text text-3xl md:text-5xl font-extrabold text-slate-900">
                        Companies demand experience.
                    </h2>
                </div>
            </section>

            {/* 3. The Gap Section */}
            <section ref={gapRef} className="pt-16 pb-12 px-4 relative bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="gap-text text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
                        There's a gap between <br className="hidden md:block" /> <span className="text-indigo-600">learning and earning.</span>
                    </h2>
                    <p className="gap-text text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                        You've watched the tutorials. You've passed the exams. But when it comes to technical interviews and building production-grade software, you feel stuck. Zentro Solutions was built to bridge that exact gap.
                    </p>
                </div>
            </section>


            {/* 4. Solution Section */}
            <section ref={solutionRef} className="pt-8 pb-24 px-4 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="solution-card bg-[#FDFBF7] p-10 rounded-3xl shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 transform hover:-translate-y-2 group">
                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <Code size={30} className="text-indigo-600" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Industry Projects</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">Build actual SaaS applications, scalable backends, and full-stack platforms instead of just basic to-do apps.</p>
                        </div>

                        <div className="solution-card bg-[#FDFBF7] p-10 rounded-3xl shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/80 rounded-bl-[100px] -z-0"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <Users size={30} className="text-violet-600" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Expert Mentorship</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">Don't guess. Let senior software engineers review your code, guide your architecture, and unstuck you daily.</p>
                            </div>
                        </div>

                        <div className="solution-card bg-[#FDFBF7] p-10 rounded-3xl shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 transform hover:-translate-y-2 group">
                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <Award size={30} className="text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Verified Certification</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">Earn a completion certificate that actually proves your capability to employers. verifiable online.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Transformation Section */}
            <section ref={transformRef} className="py-32 px-4 bg-slate-900 text-white overflow-hidden relative">
                {/* Background lighting */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full filter blur-[100px] -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full filter blur-[100px] translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6">The Zentro Transformation</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">See the difference 15 days of intensive, focused, real-world development makes.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 relative">
                        {/* VS Badge */}
                        <div className="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-slate-800 border-4 border-slate-900 rounded-full items-center justify-center font-black text-xl text-slate-400 z-10 shadow-xl">
                            VS
                        </div>

                        <div className="transform-left w-full md:w-[45%] bg-white/5 backdrop-blur-lg border border-white/10 p-10 md:p-14 rounded-3xl md:rounded-r-none relative">
                            <h3 className="text-xl font-bold text-slate-300 mb-8 border-b border-white/10 pb-4">Confused Student</h3>
                            <ul className="space-y-6">
                                <li className="flex items-center text-base text-slate-400 font-medium"><XCircle className="w-5 h-5 mr-4 text-red-400/70 shrink-0" /> No real-world portfolio</li>
                                <li className="flex items-center text-base text-slate-400 font-medium"><XCircle className="w-5 h-5 mr-4 text-red-400/70 shrink-0" /> Fails technical interviews</li>
                                <li className="flex items-center text-base text-slate-400 font-medium"><XCircle className="w-5 h-5 mr-4 text-red-400/70 shrink-0" /> Stuck in tutorial hell</li>
                                <li className="flex items-center text-base text-slate-400 font-medium"><XCircle className="w-5 h-5 mr-4 text-red-400/70 shrink-0" /> Lacks system design knowledge</li>
                            </ul>
                        </div>

                        <div className="transform-right w-full md:w-[55%] bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 p-10 md:p-14 rounded-3xl relative shadow-2xl shadow-indigo-500/10 z-0 md:z-20">
                            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-3xl"></div>
                            <h3 className="text-2xl font-extrabold text-white mb-8 border-b border-white/10 pb-4">Industry-Ready Developer</h3>
                            <ul className="space-y-6">
                                <li className="flex items-center text-base lg:text-lg text-indigo-50 font-semibold"><CheckCircle className="w-6 h-6 mr-4 text-emerald-400 shrink-0" /> Production-grade portfolio</li>
                                <li className="flex items-center text-base lg:text-lg text-indigo-50 font-semibold"><CheckCircle className="w-6 h-6 mr-4 text-emerald-400 shrink-0" /> Confident in interviews</li>
                                <li className="flex items-center text-base lg:text-lg text-indigo-50 font-semibold"><CheckCircle className="w-6 h-6 mr-4 text-emerald-400 shrink-0" /> Can build apps from scratch</li>
                                <li className="flex items-center text-base lg:text-lg text-indigo-50 font-semibold"><CheckCircle className="w-6 h-6 mr-4 text-emerald-400 shrink-0" /> Understands scalable architecture</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Extra Keyword Heading */}
            <h2 className="text-center text-2xl font-bold text-gray-800 mb-6 mt-12">
                Zentro Solutions Training & Development Programs
            </h2>

            {/* 6. Proof Section (Stats) */}
            <section ref={statsRef} className="pt-24 pb-12 px-4 bg-[#FDFBF7] border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-indigo-900 mb-3 font-mono tracking-tight">
                                <span className="stat-num" data-target="5000">0</span>+
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Students Trained</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-indigo-900 mb-3 font-mono tracking-tight">
                                <span className="stat-num" data-target="100">0</span>+
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Tech Projects</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-indigo-900 mb-3 font-mono tracking-tight">
                                <span className="stat-num" data-target="50">0</span>+
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Expert Mentors</div>
                        </div>
                        <div>
                            <div className="text-4xl md:text-5xl font-black text-indigo-900 mb-3 font-mono tracking-tight">
                                <span className="stat-num" data-target="4.9">0</span>
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Average Rating</div>
                        </div>
                    </div>
                </div>
            </section>


        </div>
    );
};

export default Home;

