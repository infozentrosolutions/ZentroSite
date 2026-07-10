import { Laptop, Code, GraduationCap, Brush, Rocket, Lock, Users, Building2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ScrollReveal from '../../components/ScrollReveal';

const Services = () => {
    const services = [
        {
            title: 'Client Project Delivery',
            icon: <Building2 className="w-10 h-10 text-primary" />,
            desc: 'We are a service-based IT company that takes your project requirements and delivers production-ready software. Websites, web apps, portals, and custom tools — built on time, under expert supervision.',
            highlight: true
        },
        {
            title: 'Web & Software Development',
            icon: <Code className="w-10 h-10 text-primary" />,
            desc: 'Modern, responsive, and blazing-fast web applications and custom software built using React, Node.js, and Cloud technologies.'
        },
        {
            title: 'Student Training Programs',
            icon: <GraduationCap className="w-10 h-10 text-primary" />,
            desc: 'Intensive hands-on training programs to upskill college students through real project experience, mentorship, and verified certification.'
        }
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <Helmet>
                <title>Services | Zentro Solutions - Web Development & Internship Training</title>
                <meta name="description" content="Discover the services offered by Zentro Solutions, including enterprise software development, modern web apps, and intensive internship training." />
                <meta name="keywords" content="software development services, web design salem, corporate training, zentro solutions services" />
                <link rel="canonical" href="https://zentrosolution.fun/services" />

                <meta property="og:title" content="Zentro Solutions Services" />
                <meta property="og:description" content="Explore our professional software development and training services." />
                <meta property="og:url" content="https://zentrosolution.fun/services" />
                <meta property="og:type" content="website" />

                <script type="application/ld+json">
                    {`
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://zentrosolution.fun/"
  },{
    "@type": "ListItem",
    "position": 2,
    "name": "Services",
    "item": "https://zentrosolution.fun/services"
  }]
}
`}
                </script>
            </Helmet>
            <style>{`
                @keyframes float {
                    0% { transform: translate(0px, 0px) rotate(0deg); }
                    33% { transform: translate(5px, -10px) rotate(5deg); }
                    66% { transform: translate(-5px, 10px) rotate(-5deg); }
                    100% { transform: translate(0px, 0px) rotate(0deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full mb-4 tracking-wider uppercase">What We Offer</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Services</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Zentro Solutions serves two audiences — <strong className="text-gray-700">businesses that need software built</strong> and <strong className="text-gray-700">students who want real skills</strong>. One team, two missions.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((svc, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.15 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className={`rounded-2xl shadow-md border p-8 transition-all duration-300 hover:shadow-xl relative overflow-hidden group ${
                                svc.highlight
                                    ? 'bg-gradient-to-br from-slate-900 to-indigo-950 border-indigo-500/30 text-white'
                                    : 'bg-white border-gray-100'
                            }`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                                svc.highlight ? 'from-indigo-500/10 to-transparent' : 'from-indigo-50/50 to-transparent'
                            }`} />
                            {svc.highlight && (
                                <span className="absolute top-4 right-4 text-xs font-bold bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 px-3 py-1 rounded-full uppercase tracking-wider">For Clients</span>
                            )}
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${
                                svc.highlight ? 'bg-indigo-500/20' : 'bg-indigo-50'
                            }`}>
                                {svc.icon}
                            </div>
                            <h3 className={`text-2xl font-bold mb-4 ${svc.highlight ? 'text-white' : 'text-gray-900'}`}>{svc.title}</h3>
                            <p className={`leading-relaxed ${svc.highlight ? 'text-indigo-100/80' : 'text-gray-600'}`}>{svc.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <ScrollReveal className="mt-28 relative rounded-3xl overflow-hidden bg-[#0A0B1A] border border-white/10 shadow-2xl">
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-900/40 via-[#0A0B1A] to-[#0A0B1A]"></div>
                        <div className="absolute top-10 right-20 w-80 h-80 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
                        <div className="absolute bottom-10 right-60 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-screen filter blur-[100px] pointer-events-none"></div>
                    </div>

                    <div className="relative z-10 px-8 py-16 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12">
                        <div className="w-full md:w-1/2 text-center md:text-left">
                            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight">
                                Have a project? <br />
                                <span className="font-extrabold tracking-wide">We build it for you.</span>
                            </h2>
                            <p className="text-xl text-indigo-100 mb-10 max-w-md opacity-90">
                                Zentro Solutions is a service-based software company. Share your requirements and we'll deliver it — web apps, portals, and custom software.
                            </p>
                            <Link to="/contact" className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)] transition-all transform hover:-translate-y-1">
                                Get a Quote
                            </Link>
                        </div>

                        <div className="w-full md:w-1/2 relative flex justify-center items-center h-[200px] md:h-[300px]">
                            <div className="relative w-64 h-64 flex items-center justify-center translate-x-4">
                                <div className="text-[12rem] font-black text-[#0A0B1A] select-none italic tracking-tighter leading-none"
                                    style={{
                                        fontFamily: 'serif',
                                        WebkitTextStroke: '2px rgba(255,255,255,0.9)',
                                        dropShadow: '0 0 20px rgba(255,255,255,0.5)'
                                    }}>
                                    Z
                                </div>
                                <div className="absolute w-[130%] h-10 bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500 rounded-[100%] z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[80%] -rotate-6 shadow-[0_5px_15px_rgba(56,189,248,0.5)]"></div>
                                <div className="absolute w-[130%] h-8 bg-[#0A0B1A] rounded-[100%] z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[40%] -rotate-6"></div>

                                <div className="absolute -top-4 -left-8 w-14 h-14 bg-[#20B2AA] rounded-xl flex items-center justify-center shadow-lg transform -rotate-12 animate-float z-30 ring-1 ring-white/20">
                                    <Code className="text-white w-7 h-7" />
                                </div>
                                <div className="absolute bottom-12 -left-4 w-12 h-12 bg-[#364BAE] rounded-xl flex items-center justify-center shadow-lg transform rotate-12 animate-float animation-delay-2000 z-30 ring-1 ring-white/20">
                                    <Brush className="text-white w-6 h-6" />
                                </div>
                                <div className="absolute -bottom-6 right-8 w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg transform -rotate-6 animate-float z-30 ring-1 ring-white/20">
                                    <Lock className="text-white w-6 h-6" />
                                </div>
                                <div className="absolute top-1/4 -right-12 w-14 h-14 bg-[#7E57C2] rounded-xl flex items-center justify-center shadow-lg transform rotate-12 animate-float animation-delay-4000 z-30 ring-1 ring-white/20">
                                    <Rocket className="text-white w-7 h-7" />
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                <div className="mt-20 flex justify-center">
                    <Link to="/intern-peoples" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-bold text-slate-950 transition-transform hover:-translate-y-0.5">
                        <Users size={16} /> Open Intern Peoples
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Services;
