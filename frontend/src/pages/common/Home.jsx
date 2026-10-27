import { useState, useLayoutEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Code, Users, Award, Briefcase, ArrowDown, XCircle, CheckCircle, GraduationCap, Rocket, Star, Handshake, Mail, Phone, MapPin, ExternalLink, MoreVertical, Building2, BookOpen, Layers } from 'lucide-react';
import './Home.css';
import Footer from '../../components/Footer';

import logo from '../../assets/logo.png';

import moonImg from '../../assets/images (2).jpeg';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const comp = useRef(null);
    const heroRef = useRef(null);
    const problemRef = useRef(null);
    const gapRef = useRef(null);
    const galleryContainerRef = useRef(null);
    const galleryScrollRef = useRef(null);
    const solutionRef = useRef(null);
    const transformRef = useRef(null);
    const statsRef = useRef(null);
    const ctaRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ['start start', 'end start'],
    });

    const heroVideoY = useTransform(scrollYProgress, [0, 1], [0, -40]);
    const heroVideoScale = useTransform(scrollYProgress, [0, 1], [1, 1.03]);
    const heroContentY = useTransform(scrollYProgress, [0, 1], [0, -90]);
    const heroContentOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);

    const services = [
        {
            title: 'Client Project Delivery',
            desc: 'We take your business requirements and build production-grade software — web apps, portals, and platforms delivered on time.',
            icon: Building2,
            accent: 'from-violet-500 to-purple-600'
        },
        {
            title: 'Web & Software Development',
            desc: 'Modern, responsive websites and custom software built with React, Node.js, and cloud-ready architecture.',
            icon: Code,
            accent: 'from-indigo-500 to-blue-600'
        },
        {
            title: 'Student Training Programs',
            desc: 'Hands-on internship programs that turn students into industry-ready developers through real project experience.',
            icon: GraduationCap,
            accent: 'from-amber-500 to-orange-500'
        }
    ];

    const programs = [
        'MERN Stack Development',
        'Python Programming',
        'Java Development',
        'Web Development Basics'
    ];

    const projects = [
        'Chat Application',
        'E-commerce Platform',
        'Learning Management System',
        'Student Portal'
    ];

    const contactPoints = [
        { label: 'Email', value: 'info.zentro.solutions@gmail.com', icon: Mail },
        { label: 'Phone', value: '+91 9597504603', icon: Phone },
        { label: 'Location', value: 'Attur, Salem District, Tamil Nadu - 636107', icon: MapPin }
    ];

    const sectionVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.12 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } }
    };

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
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
        <div ref={comp} className="min-h-screen bg-[#FDFBF7] text-gray-900 font-sans overflow-x-hidden">
            <Helmet>
                <title>Zentro Solutions | Web Development, Software Solutions and Digital Transformation</title>
                <meta name="description" content="Zentro Solutions delivers innovative IT services, specializing in web development, software solutions, and digital transformation to help businesses scale efficiently." />
                <meta name="keywords" content="zentro solutions, zentro solution, zentro solutions attur, web development, software solutions, digital transformation" />
                <link rel="canonical" href="https://zentrosolution.fun/" />

                {/* Open Graph / Social Media */}
                <meta property="og:title" content="Zentro Solutions | Web Development, Software Solutions and Digital Transformation" />
                <meta property="og:description" content="Zentro Solutions delivers innovative IT services, specializing in web development, software solutions, and digital transformation to help businesses scale efficiently." />
                <meta property="og:image" content="https://zentrosolution.fun/logo.png" />
                <meta property="og:url" content="https://zentrosolution.fun/" />
                <meta property="og:type" content="website" />

                {/* Twitter Meta Tags */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Zentro Solutions | IT Services in Attur" />
                <meta name="twitter:description" content="Web development, software solutions, and digital transformation by Zentro Solutions." />
                <meta name="twitter:image" content="https://zentrosolution.fun/logo.png" />

                {/* Structured Data (Advanced SEO) */}
                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Zentro Solutions",
  "alternateName": ["Zentro Solution", "Zentro Solutions Attur"],
  "url": "https://zentrosolution.fun",
  "logo": {
    "@type": "ImageObject",
    "url": "https://zentrosolution.fun/logo.png",
    "width": 512,
    "height": 512
  },
  "description": "Zentro Solutions is a service-based software company and student training institute based in Attur, Salem District, Tamil Nadu. We deliver production-grade software for clients and provide hands-on internship training programs to bridge the gap between academics and industry.",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Attur",
    "addressRegion": "Tamil Nadu",
    "postalCode": "636107",
    "addressCountry": "IN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+91-9597504603",
    "email": "info.zentro.solutions@gmail.com",
    "contactType": "customer support",
    "areaServed": "IN",
    "availableLanguage": ["English", "Tamil"]
  },
  "founder": {
    "@type": "Person",
    "name": "Boopathi P",
    "jobTitle": "Founder",
    "worksFor": {
      "@type": "Organization",
      "name": "Zentro Solutions"
    }
  },
  "employee": [
    {
      "@type": "Person",
      "name": "Mukesh A",
      "jobTitle": "Chief Executive Officer",
      "worksFor": {
        "@type": "Organization",
        "name": "Zentro Solutions"
      }
    }
  ],
  "knowsAbout": [
    "Web Development",
    "Software Development",
    "MERN Stack",
    "React",
    "Node.js",
    "Python Programming",
    "Java Development",
    "Student Internship Training",
    "Digital Transformation"
  ],
  "sameAs": [
    "https://www.linkedin.com/company/zentrosolutions",
    "https://github.com/infozentrosolutions"
  ],
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://zentrosolution.fun/programs?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
`}
                </script>
            </Helmet>

            <header className="fixed top-0 left-0 w-full z-50 bg-[#0A0B1A]/85 backdrop-blur-md border-b border-white/10 py-3.5 shadow-2xl">
                <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between relative">
                    <Link to="/" className="flex items-center gap-3 shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                            <img src={logo} alt="Zentro Solutions" className="h-8 w-8 object-contain" />
                        </div>
                        <span className="text-sm sm:text-lg md:text-xl font-bold text-white tracking-tight">Zentro Solutions</span>
                    </Link>

                    <div className="hidden lg:flex items-center justify-center flex-1">
                        <div className="bg-black/80 rounded-full px-1.5 py-1 flex items-center space-x-1 shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-gray-800">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About', path: '/about' },
                                { name: 'Services', path: '/services' },
                                { name: 'Programs', path: '/programs' },
                                { name: 'Projects', path: '/projects' },
                                { name: 'Contact', path: '/contact' }
                            ].map((link) => {
                                const isActive = link.path === '/';
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`text-sm font-medium transition-all px-4 py-1.5 rounded-full ${isActive ? 'bg-purple-600 text-white shadow-md' : 'text-gray-300 hover:text-white hover:bg-white/10'}`}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        <Link to="/login" className="hidden lg:flex items-center bg-white px-6 py-2 rounded-full text-sm font-bold text-black border-2 border-transparent hover:border-purple-600 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all">
                            Login
                        </Link>
                        <button
                            type="button"
                            className="lg:hidden text-white hover:text-gray-300 p-2 rounded-full transition-colors"
                            aria-label="Toggle menu"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <XCircle size={24} /> : <MoreVertical size={24} />}
                        </button>
                    </div>

                    {/* Mobile Menu Dropdown */}
                    {mobileMenuOpen && (
                        <div className="absolute top-full mt-3 right-0 w-[240px] bg-black/95 backdrop-blur-md rounded-3xl p-4 shadow-2xl border border-gray-800 lg:hidden flex flex-col space-y-2 origin-top-right z-50">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'About', path: '/about' },
                                { name: 'Services', path: '/services' },
                                { name: 'Programs', path: '/programs' },
                                { name: 'Projects', path: '/projects' },
                                { name: 'Contact', path: '/contact' }
                            ].map((link) => {
                                const isActive = link.path === '/';
                                return (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`p-3 font-medium transition-colors rounded-xl text-center ${isActive
                                            ? 'bg-purple-600 text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-white/10'
                                            }`}
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                );
                            })}
                            <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="bg-white text-black px-6 py-3 rounded-xl text-center font-bold mt-2 hover:bg-gray-200 shadow-sm">
                                Login
                            </Link>
                        </div>
                    )}
                </nav>
            </header>

            {/* 1. Hero Section */}
            <section ref={heroRef} className="hero-section-custom relative flex min-h-screen flex-col justify-center overflow-hidden text-white">
                <motion.video
                    style={{ y: heroVideoY, scale: heroVideoScale }}
                    className="absolute inset-0 z-0 h-full w-full object-cover object-bottom"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                >
                    <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4" type="video/mp4" />
                </motion.video>
                {/* subtle dark overlay so hero text remains readable across videos */}
                <div className="absolute inset-0 z-[5] pointer-events-none bg-black/30" />

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

                <motion.div
                    style={{ y: heroContentY, opacity: heroContentOpacity }}
                    className="relative z-10 mx-auto flex w-full max-w-full flex-1 items-center px-4 pb-20 pt-20 sm:px-6 lg:px-12"
                >
                    <div className="grid w-full grid-cols-1 items-center gap-12 md:grid-cols-2 md:gap-16">
                        <div className="flex flex-col items-center text-center md:items-start md:text-left">
                            <h1 className="hero-text text-4xl font-extrabold tracking-tight leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                                We Build Software.
                                <br className="hidden md:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                                    We Build Developers.
                                </span>
                            </h1>

                            <p className="hero-text mt-6 max-w-xl text-sm leading-relaxed text-indigo-100/80 sm:text-base">
                                Zentro Solutions is a service-based software company <em>and</em> a student training institute in Attur, Salem. We deliver client projects and shape the next generation of developers — both under one roof.
                            </p>

                            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row md:items-start">
                                <Link to="/contact" className="hero-btn liquid-glass inline-flex w-full items-center justify-center rounded-xl bg-indigo-600 px-8 py-3.5 text-lg font-bold text-white shadow-xl shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-500 sm:w-auto">
                                    Hire Us for Your Project <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <a href="https://forms.gle/VfspwyCfBU6FESDn6" target="_blank" rel="noreferrer" className="hero-btn liquid-glass inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-lg font-bold text-white shadow-sm transition-all duration-300 hover:bg-white/10 sm:w-auto">
                                    Join Training Program
                                </a>
                            </div>

                            <div className="mt-10 flex items-center gap-4">
                                <div className="hero-trust-avatars flex -space-x-2">
                                    <div className="hero-trust-avatar" style={{ background: '#3b82f6', zIndex: 4 }}>R</div>
                                    <div className="hero-trust-avatar" style={{ background: '#10b981', zIndex: 3 }}>P</div>
                                    <div className="hero-trust-avatar" style={{ background: '#f59e0b', zIndex: 2 }}>A</div>
                                    <div className="hero-trust-avatar" style={{ background: '#8b5cf6', zIndex: 1 }}>S</div>
                                </div>
                                <div className="text-white text-sm">
                                    <div className="font-bold flex items-center gap-1">100+ <span className="font-normal text-indigo-100">projects delivered &amp; students trained</span></div>
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

                        <div className="hidden md:flex justify-center items-center h-full relative z-20 min-h-[520px]">
                            <div className="hero-float-card card-1 z-30">
                                <div className="hfc-icon bg-primary"><Building2 size={20} /></div>
                                <div>
                                    <div className="hfc-label">Client Projects</div>
                                    <div className="hfc-value">100+ Done</div>
                                </div>
                            </div>

                            <div className="hero-float-card card-2 z-30">
                                <div className="hfc-icon bg-success"><GraduationCap size={20} /></div>
                                <div>
                                    <div className="hfc-label">Students Trained</div>
                                    <div className="hfc-value">5000+</div>
                                </div>
                            </div>

                            <div className="hero-float-card card-3 z-30">
                                <div className="hfc-icon bg-warning"><Handshake size={20} /></div>
                                <div>
                                    <div className="hfc-label">Happy Clients</div>
                                    <div className="hfc-value">50+</div>
                                </div>
                            </div>

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
                                        <img src={moonImg} alt="Zentro Solutions Web Development Background" className="absolute inset-0 w-full h-full object-cover z-0" />
                                        <div className="relative z-10 w-20 h-20 shimmer-effect drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] flex items-center justify-center">
                                            <img src={logo} alt="Zentro Solutions Logo" className="w-full h-full object-contain mix-blend-screen" />
                                        </div>
                                    </div>
                                    <div className="hero-core-glow" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* 2. Two Ways We Serve — Dual Identity Split */}
            <section className="py-24 px-4 bg-slate-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold tracking-wider text-indigo-700 uppercase">Who We Serve</span>
                        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900">Two Ways Zentro Solutions Works</h2>
                        <p className="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Whether you're a business needing software built, or a student wanting real skills — Zentro is your partner.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* For Clients */}
                        <div className="group relative rounded-3xl bg-gradient-to-br from-slate-900 to-indigo-950 p-10 text-white shadow-2xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-bl-full" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/20 border border-indigo-400/30 px-4 py-1.5 text-sm font-bold text-indigo-300 uppercase tracking-wider mb-6">
                                    <Building2 size={14} /> For Businesses &amp; Clients
                                </div>
                                <h3 className="text-3xl font-extrabold text-white leading-tight">Need Software Built?<br /><span className="text-indigo-400">We Deliver It.</span></h3>
                                <p className="mt-5 text-indigo-100/80 text-lg leading-relaxed">
                                    Zentro Solutions is a service-based IT company. We take your project requirements — websites, web apps, portals, or custom tools — and build production-ready software under expert supervision.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    {['Custom web &amp; software development', 'End-to-end project delivery', 'Dedicated team for your project', 'Competitive pricing, quality output'].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-indigo-100">
                                            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                                            <span dangerouslySetInnerHTML={{ __html: item }} />
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition-all hover:bg-indigo-500 hover:-translate-y-0.5">
                                    Get a Quote <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>

                        {/* For Students */}
                        <div className="group relative rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-10 shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-200/30 rounded-bl-full" />
                            <div className="relative z-10">
                                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 border border-amber-200 px-4 py-1.5 text-sm font-bold text-amber-700 uppercase tracking-wider mb-6">
                                    <BookOpen size={14} /> For Students &amp; Freshers
                                </div>
                                <h3 className="text-3xl font-extrabold text-slate-900 leading-tight">Want Real Skills?<br /><span className="text-amber-600">We Teach Them.</span></h3>
                                <p className="mt-5 text-slate-600 text-lg leading-relaxed">
                                    We run internship training programs where students work on actual projects, guided by industry experts. Build a portfolio, earn a certificate, and become job-ready.
                                </p>
                                <ul className="mt-6 space-y-3">
                                    {['Hands-on project-based learning', 'Expert mentorship &amp; code reviews', 'MERN, Python, Java, Web Dev tracks', 'Verified completion certificate'].map((item) => (
                                        <li key={item} className="flex items-center gap-3 text-slate-700">
                                            <CheckCircle size={18} className="text-amber-500 shrink-0" />
                                            <span dangerouslySetInnerHTML={{ __html: item }} />
                                        </li>
                                    ))}
                                </ul>
                                <a href="https://forms.gle/VfspwyCfBU6FESDn6" target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 font-bold text-white transition-all hover:bg-amber-400 hover:-translate-y-0.5">
                                    Apply for Internship <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Problem Section */}
            <section ref={problemRef} className="pt-32 pb-16 px-4 bg-white relative overflow-hidden border-b border-gray-100">
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col gap-4">
                    <h2 className="problem-text text-3xl md:text-5xl font-bold text-gray-400">
                        College teaches theory.
                    </h2>
                    <h2 className="problem-text text-3xl md:text-5xl font-extrabold text-slate-900">
                        Companies demand experience.
                    </h2>
                    <h2 className="problem-text text-2xl md:text-3xl font-bold text-gray-400 mt-4">
                        And businesses struggle to find
                    </h2>
                    <h2 className="problem-text text-2xl md:text-3xl font-extrabold text-slate-900">
                        reliable tech teams to build their software.
                    </h2>
                </div>
            </section>

            {/* 4. The Gap Section */}
            <section ref={gapRef} className="pt-16 pb-12 px-4 relative bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="gap-text text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 leading-tight">
                        Zentro closes both gaps — <br className="hidden md:block" /> <span className="text-indigo-600">for clients and students.</span>
                    </h2>
                    <p className="gap-text text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
                        We are a service company that delivers software for clients, and a training institute that prepares students for the industry — both powered by real projects and real mentorship. One team. Two missions.
                    </p>
                </div>
            </section>


            {/* 5. Solution Section */}
            <section ref={solutionRef} className="pt-8 pb-24 px-4 bg-white relative">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold tracking-wider text-indigo-700 uppercase">Why Zentro Works</span>
                        <h2 className="mt-4 text-3xl md:text-5xl font-extrabold text-slate-900">What Makes Us Different</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="solution-card bg-[#FDFBF7] p-10 rounded-3xl shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 transform hover:-translate-y-2 group">
                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <Layers size={30} className="text-violet-600" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Real Project Experience</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">Our students don't just learn — they build actual client deliverables. Real code, real deadlines, real impact.</p>
                        </div>

                        <div className="solution-card bg-[#FDFBF7] p-10 rounded-3xl shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 transform hover:-translate-y-2 group relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/80 rounded-bl-[100px] -z-0"></div>
                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                    <Users size={30} className="text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Expert-Led Delivery</h3>
                                <p className="text-slate-600 text-lg leading-relaxed">Every client project is overseen by senior engineers. Clients get quality. Students get experience. Win-win.</p>
                            </div>
                        </div>

                        <div className="solution-card bg-[#FDFBF7] p-10 rounded-3xl shadow-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 transform hover:-translate-y-2 group">
                            <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500">
                                <Award size={30} className="text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">Certified Outcomes</h3>
                            <p className="text-slate-600 text-lg leading-relaxed">Students earn verified certificates. Clients receive deployed, production-ready software. Results you can show.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. Transformation Section */}
            <section ref={transformRef} className="py-20 px-4 bg-slate-900 text-white overflow-hidden relative">
                {/* Background lighting */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full filter blur-[100px] -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full filter blur-[100px] translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">Why Choose Zentro?</h2>
                        <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">The difference Zentro makes — for businesses that need software built, and students who need real skills.</p>
                    </div>

                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-0 relative">
                        {/* VS Badge */}
                        <div className="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-slate-800 border-4 border-slate-900 rounded-full items-center justify-center font-black text-base text-slate-400 z-10 shadow-xl">
                            VS
                        </div>

                        {/* Without Zentro */}
                        <div className="transform-left w-full md:w-[45%] bg-white/5 backdrop-blur-lg border border-white/10 p-8 md:p-12 rounded-3xl md:rounded-r-none relative">
                            <h3 className="text-lg font-bold text-slate-300 mb-6 border-b border-white/10 pb-4">Without Zentro</h3>
                            <div className="mb-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-red-400/70 mb-3">For Clients</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-400 font-medium"><XCircle className="w-4 h-4 mt-0.5 text-red-400/60 shrink-0" /> Hard to find reliable dev teams</li>
                                    <li className="flex items-start gap-3 text-sm text-slate-400 font-medium"><XCircle className="w-4 h-4 mt-0.5 text-red-400/60 shrink-0" /> Expensive freelancers, delayed delivery</li>
                                    <li className="flex items-start gap-3 text-sm text-slate-400 font-medium"><XCircle className="w-4 h-4 mt-0.5 text-red-400/60 shrink-0" /> No quality control or oversight</li>
                                </ul>
                            </div>
                            <div className="border-t border-white/5 pt-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-red-400/70 mb-3">For Students</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-slate-400 font-medium"><XCircle className="w-4 h-4 mt-0.5 text-red-400/60 shrink-0" /> Only theory, no real project experience</li>
                                    <li className="flex items-start gap-3 text-sm text-slate-400 font-medium"><XCircle className="w-4 h-4 mt-0.5 text-red-400/60 shrink-0" /> Stuck in tutorial hell</li>
                                    <li className="flex items-start gap-3 text-sm text-slate-400 font-medium"><XCircle className="w-4 h-4 mt-0.5 text-red-400/60 shrink-0" /> Fails technical interviews</li>
                                </ul>
                            </div>
                        </div>

                        {/* With Zentro */}
                        <div className="transform-right w-full md:w-[55%] bg-gradient-to-br from-indigo-900 to-slate-900 border border-indigo-500/30 p-8 md:p-12 rounded-3xl relative shadow-2xl shadow-indigo-500/10 z-0 md:z-20">
                            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-t-3xl"></div>
                            <h3 className="text-xl font-extrabold text-white mb-6 border-b border-white/10 pb-4">With Zentro ✓</h3>
                            <div className="mb-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400/80 mb-3">For Clients</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-indigo-50 font-semibold"><CheckCircle className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" /> Expert team, on-time delivery</li>
                                    <li className="flex items-start gap-3 text-sm text-indigo-50 font-semibold"><CheckCircle className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" /> Production-ready software, affordable</li>
                                    <li className="flex items-start gap-3 text-sm text-indigo-50 font-semibold"><CheckCircle className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" /> Senior engineer oversight on every project</li>
                                </ul>
                            </div>
                            <div className="border-t border-white/10 pt-5">
                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-400/80 mb-3">For Students</p>
                                <ul className="space-y-3">
                                    <li className="flex items-start gap-3 text-sm text-indigo-50 font-semibold"><CheckCircle className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" /> Real client project experience</li>
                                    <li className="flex items-start gap-3 text-sm text-indigo-50 font-semibold"><CheckCircle className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" /> Mentorship + verified certificate</li>
                                    <li className="flex items-start gap-3 text-sm text-indigo-50 font-semibold"><CheckCircle className="w-4 h-4 mt-0.5 text-emerald-400 shrink-0" /> Job-ready, confident developer</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Proof Section (Stats) */}
            <motion.section
                ref={statsRef}
                className="pt-24 pb-12 px-4 bg-[#FDFBF7] border-b border-gray-100"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <motion.div variants={itemVariants}>
                            <div className="text-4xl md:text-5xl font-black text-indigo-900 mb-3 font-mono tracking-tight">
                                <span className="stat-num" data-target="5000">0</span>+
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Students Trained</div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <div className="text-4xl md:text-5xl font-black text-indigo-900 mb-3 font-mono tracking-tight">
                                <span className="stat-num" data-target="100">0</span>+
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Client Projects Delivered</div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <div className="text-4xl md:text-5xl font-black text-indigo-900 mb-3 font-mono tracking-tight">
                                <span className="stat-num" data-target="50">0</span>+
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Happy Clients</div>
                        </motion.div>
                        <motion.div variants={itemVariants}>
                            <div className="text-4xl md:text-5xl font-black text-indigo-900 mb-3 font-mono tracking-tight">
                                <span className="stat-num" data-target="4.9">0</span>
                            </div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">Average Rating</div>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                id="about"
                className="py-24 px-4 bg-white border-b border-gray-100"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.22 }}
            >
                <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
                    <motion.div variants={itemVariants}>
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold tracking-wider text-indigo-700 uppercase">About</span>
                        <h2 className="mt-5 text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight">About Zentro Solutions</h2>
                        <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                            Zentro Solutions is a <strong>service-based software company and a student training institute</strong> based in Attur, Salem District, Tamil Nadu. We build software for clients and build skills in students — both with the same passion for quality.
                        </p>
                        <p className="mt-4 text-lg text-slate-600 leading-relaxed">
                            Our client projects are delivered by a team of trained developers under senior engineer supervision. Our training programs turn freshers into job-ready developers through real, production-style project experience.
                        </p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/about" className="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5">
                                Full About Page <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                            <Link to="/services" className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-800 transition-transform hover:-translate-y-0.5">
                                Our Services
                            </Link>
                        </div>
                    </motion.div>

                    <motion.div variants={sectionVariants} className="grid sm:grid-cols-2 gap-4">
                        {[
                            { title: 'Service Company', text: 'We take client projects and deliver production-grade software.' },
                            { title: 'Training Institute', text: 'We teach students through real projects and expert mentorship.' },
                            { title: 'Practical Exposure', text: 'Students work on live client deliverables — not just exercises.' },
                            { title: 'Quality First', text: 'Every line of code reviewed by senior engineers before delivery.' }
                        ].map((item) => (
                            <motion.div key={item.title} variants={itemVariants} whileHover={{ y: -6, scale: 1.02 }} className="rounded-3xl border border-gray-100 bg-[#FDFBF7] p-6 shadow-sm">
                                <div className="text-sm font-bold uppercase tracking-wider text-indigo-600">{item.title}</div>
                                <p className="mt-3 text-slate-600 leading-relaxed">{item.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                id="services"
                className="py-24 px-4 bg-slate-50 border-b border-gray-100"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.22 }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold tracking-wider text-indigo-700 uppercase">Services</span>
                        <h2 className="mt-5 text-3xl md:text-5xl font-extrabold text-slate-900">What We Offer</h2>
                        <p className="mt-4 text-lg text-slate-600">We serve both businesses needing software built and students wanting to grow their technical skills.</p>
                    </motion.div>

                    <motion.div variants={sectionVariants} className="mt-12 grid gap-6 md:grid-cols-3">
                        {services.map((service) => {
                            const ServiceIcon = service.icon;
                            return (
                                <motion.div key={service.title} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} className="rounded-3xl border border-white/70 bg-white p-8 shadow-[0_10px_40px_rgba(15,23,42,0.06)]">
                                    <div className={`mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${service.accent} text-white`}>
                                        <ServiceIcon size={28} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900">{service.title}</h3>
                                    <p className="mt-4 text-slate-600 leading-relaxed">{service.desc}</p>
                                </motion.div>
                            );
                        })}
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-8 text-center">
                        <Link to="/services" className="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5">
                            Full Services Page <ArrowRight className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                id="programs"
                className="py-24 px-4 bg-[#0B0F19] text-white border-b border-white/10"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.22 }}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] items-start">
                        <motion.div variants={itemVariants}>
                            <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold tracking-wider text-indigo-200 uppercase">Training Programs</span>
                            <h2 className="mt-5 text-3xl md:text-5xl font-extrabold leading-tight">Student Training Tracks at Zentro</h2>
                            <p className="mt-4 text-lg text-indigo-100/80 leading-relaxed">
                                Learn by building — our programs put students on real projects from day one, guided by industry mentors.
                            </p>
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link to="/programs" className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5">
                                    Explore All Programs <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                                <a href="https://forms.gle/VfspwyCfBU6FESDn6" target="_blank" rel="noreferrer" className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5">
                                    Apply Now
                                </a>
                            </div>
                        </motion.div>

                        <motion.div variants={sectionVariants} className="grid gap-4 sm:grid-cols-2">
                            {programs.map((program, index) => (
                                <motion.div key={program} variants={itemVariants} whileHover={{ y: -6, scale: 1.02 }} className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-indigo-200 font-black">0{index + 1}</div>
                                        <GraduationCap className="h-5 w-5 text-indigo-300" />
                                    </div>
                                    <h3 className="mt-5 text-xl font-bold">{program}</h3>
                                    <p className="mt-3 text-sm leading-relaxed text-indigo-100/75">Practical training with project work, tasks, and guided development sessions.</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                id="projects"
                className="py-24 px-4 bg-white border-b border-gray-100"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.22 }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.div variants={itemVariants} className="text-center max-w-3xl mx-auto">
                        <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-bold tracking-wider text-indigo-700 uppercase">Projects</span>
                        <h2 className="mt-5 text-3xl md:text-5xl font-extrabold text-slate-900">Projects We Build</h2>
                        <p className="mt-4 text-lg text-slate-600">A sample of the software we deliver for clients and build with students during training programs.</p>
                    </motion.div>

                    <motion.div variants={sectionVariants} className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {projects.map((project, index) => (
                            <motion.div key={project} variants={itemVariants} whileHover={{ y: -8, scale: 1.02 }} className="rounded-3xl border border-gray-100 bg-[#FDFBF7] p-6 shadow-sm">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold">{index + 1}</div>
                                <h3 className="mt-5 text-xl font-bold text-slate-900">{project}</h3>
                                <p className="mt-3 text-sm leading-relaxed text-slate-600">Portfolio-ready work that shows practical skills and problem-solving ability.</p>
                            </motion.div>
                        ))}
                    </motion.div>

                    <motion.div variants={itemVariants} className="mt-8 text-center">
                        <Link to="/projects" className="inline-flex items-center rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5">
                            Full Projects Page <ExternalLink className="ml-2 w-4 h-4" />
                        </Link>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                id="contact"
                className="py-24 px-4 bg-slate-50"
                variants={sectionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.22 }}
            >
                <div className="max-w-7xl mx-auto grid gap-8 lg:grid-cols-[1fr_0.9fr] items-stretch">
                    <motion.div variants={itemVariants} className="rounded-3xl bg-slate-900 p-6 sm:p-8 md:p-12 text-white shadow-2xl overflow-hidden">
                        <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-1.5 text-sm font-bold tracking-wider text-indigo-200 uppercase">Contact</span>
                        <h2 className="mt-5 text-3xl md:text-5xl font-extrabold">Let's Work Together</h2>
                        <p className="mt-4 text-lg text-indigo-100/80 leading-relaxed">Whether you're a business looking to build software or a student looking to grow — reach out and let's start the conversation.</p>

                        <div className="mt-10 space-y-4">
                            {contactPoints.map((point) => {
                                const PointIcon = point.icon;
                                return (
                                    <motion.div key={point.label} variants={itemVariants} whileHover={{ x: 4 }} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                                        <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-indigo-200">
                                            <PointIcon size={18} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-sm font-bold uppercase tracking-wider text-indigo-200">{point.label}</div>
                                            <div className="mt-1 text-white/90 leading-relaxed break-words">{point.value}</div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>

                    <motion.div variants={itemVariants} whileHover={{ y: -6 }} className="rounded-3xl border border-gray-100 bg-white p-8 md:p-12 shadow-[0_10px_40px_rgba(15,23,42,0.08)] flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">Have a project in mind or want to join our program?</h3>
                            <p className="mt-4 text-slate-600 leading-relaxed">Tell us about your project requirement or training inquiry — we respond fast. Use the contact page or drop us a mail.</p>
                        </div>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link to="/contact" className="inline-flex items-center rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5">
                                Contact Us <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                            <a href="mailto:info.zentro.solutions@gmail.com" className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3 font-semibold text-slate-800 transition-transform hover:-translate-y-0.5">
                                Mail Us
                            </a>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <Footer />


        </div>
    );
};

export default Home;

