import { Target, Eye, Code, Calendar, CheckCircle, GraduationCap, Users, LayoutDashboard, Award, Settings, Building2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import ScrollReveal from '../../components/ScrollReveal';

const About = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>About Zentro Solutions | Experts in Web Development & Training</title>
                <meta name="description" content="Zentro Solutions is a service-based software company and student training institute in Attur, Salem. We build software for clients and train students with real project experience." />
                <meta name="keywords" content="about zentro solutions, software development company, tech training india, student internships, service based company attur" />
                <link rel="canonical" href="https://zentrosolution.fun/about" />

                {/* Open Graph / Social Media */}
                <meta property="og:title" content="About Zentro Solutions" />
                <meta property="og:description" content="Learn how Zentro Solutions is bridging the gap between academics and industry through hands-on training." />
                <meta property="og:url" content="https://zentrosolution.fun/about" />
                <meta property="og:type" content="website" />

                {/* Breadcrumb Schema */}
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
    "name": "About",
    "item": "https://zentrosolution.fun/about"
  }]
}
`}
                </script>
            </Helmet>
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16 max-w-4xl mx-auto"
                >
                    <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full mb-4 tracking-wider uppercase">Who We Are</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Zentro Solutions</h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-4">
                        Zentro Solutions is a <strong>service-based software company</strong> and a <strong>student training institute</strong> based in Attur, Salem District, Tamil Nadu. We build software for clients and build skills in students — both with the same passion for quality and real-world impact.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Our client projects are delivered by a team of trained developers under senior engineer supervision. Our training programs give students hands-on experience on production-style projects, mentorship, and verified certification — turning freshers into job-ready developers.
                    </p>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                            <Building2 size={16} /> Service-Based Company
                        </div>
                        <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-5 py-2.5 rounded-xl text-sm font-semibold">
                            <GraduationCap size={16} /> Student Training Institute
                        </div>
                    </div>
                </motion.div>

                {/* What students build */}
                <ScrollReveal delay={0.1} className="mb-20">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 md:p-12 text-center shadow-sm">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">What We Do &amp; What We Build</h2>
                        <p className="text-gray-600 mb-2 max-w-2xl mx-auto">
                            For clients, we deliver production-grade software. For students, we build real-world skills. Both, on real projects.
                        </p>
                        <p className="text-gray-500 mb-8 max-w-2xl mx-auto text-sm">Student training tracks include:</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {['Java Development', 'Python Programming', 'Web Dev (HTML/CSS/JS)', 'MERN Stack', 'Software Engineering'].map(skill => (
                                <span key={skill} className="px-4 py-2 bg-white text-primary text-sm font-semibold rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
                                    <Code size={15} className="opacity-70 shrink-0" /> {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10 border-t-4 border-t-indigo-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mr-4">
                                <Target className="text-primary w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            To be the go-to technology partner for businesses needing reliable software delivery, and the #1 training institute for students wanting real-world project experience and mentorship.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10 border-t-4 border-t-yellow-500 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                    >
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mr-4">
                                <Eye className="text-accent w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            To become a trusted technology training platform that nurtures innovation, builds confidence, and shapes the next generation of software professionals.
                        </p>
                    </motion.div>
                </div>

                {/* What Makes Us Different */}
                <div className="mb-20">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900">What Makes Us Different</h2>
                        <p className="text-gray-500 mt-2">Our internship programs are designed to simulate real company environments.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { icon: Calendar, text: "15-Day Structured Programs" },
                            { icon: Award, text: "Affordable ₹99 Model" },
                            { icon: CheckCircle, text: "Daily Tasks & Attendance" },
                            { icon: Users, text: "Live Interactive Sessions" },
                            { icon: LayoutDashboard, text: "Batch-Based Learning" },
                            { icon: GraduationCap, text: "Teacher-Issued Certificates" },
                            { icon: Code, text: "Real Project Development" },
                            { icon: Settings, text: "Performance-Based Evaluation" }
                        ].map((Feature, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.06 }}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-default"
                            >
                                <Feature.icon className="w-8 h-8 text-indigo-500 mb-4" />
                                <span className="font-semibold text-gray-800">{Feature.text}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Commitment */}
                <ScrollReveal delay={0.2} className="bg-gray-900 rounded-3xl p-6 sm:p-10 md:p-16 text-center text-white relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary opacity-20 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-accent opacity-20 blur-3xl"></div>

                    <h2 className="text-3xl font-bold mb-8 relative z-10">Our Commitment</h2>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-10 relative z-10 text-gray-300">
                        <div className="flex items-center"><CheckCircle size={18} className="text-primary mr-2" /> Quality technical education</div>
                        <div className="flex items-center"><CheckCircle size={18} className="text-primary mr-2" /> Real-time mentorship</div>
                        <div className="flex items-center"><CheckCircle size={18} className="text-primary mr-2" /> Professional learning environment</div>
                        <div className="flex items-center"><CheckCircle size={18} className="text-primary mr-2" /> Transparent evaluation system</div>
                        <div className="flex items-center"><CheckCircle size={18} className="text-primary mr-2" /> Practical project exposure</div>
                    </div>

                    <p className="text-xl md:text-2xl font-semibold text-indigo-100 relative z-10 mt-8">
                        At Zentro Solutions, we don't just train students — <span className="text-white">we prepare future developers.</span>
                    </p>
                </ScrollReveal>

            </div>
        </div>
    );
};

export default About;
