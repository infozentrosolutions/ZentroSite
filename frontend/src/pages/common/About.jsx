import { Target, Eye, Code, Calendar, CheckCircle, GraduationCap, Users, LayoutDashboard, Award, Settings } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import ScrollReveal from '../../components/ScrollReveal';

const About = () => {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>About Zentro Solutions | Experts in Web Development & Training</title>
                <meta name="description" content="Learn more about Zentro Solutions, a technology-driven startup providing real-world software development skills, internships, and industrial training." />
                <meta name="keywords" content="about zentro solutions, software development startup, tech training india, student internships" />
                <link rel="canonical" href="https://zentrosolution.fun/about" />

                {/* Open Graph / Social Media */}
                <meta property="og:title" content="About Zentro Solutions" />
                <meta property="og:description" content="Learn how Zentro Solutions is bridging the gap between academics and industry through hands-on training." />
                <meta property="og:url" content="https://zentrosolution.fun/about" />
                <meta property="og:type" content="website" />
            </Helmet>
            <div className="max-w-6xl mx-auto">
                {/* Hero Section */}
                <ScrollReveal className="text-center mb-16 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About Zentro Solutions</h1>
                    <p className="text-lg text-gray-600 leading-relaxed mb-4">
                        Zentro Solutions is a technology-driven startup focused on empowering students with real-world software development skills. We believe that true learning happens through hands-on experience, practical implementation, and real project building.
                    </p>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        Our mission is to bridge the gap between academic knowledge and industry expectations by providing structured internship programs designed to build confident, skilled, and job-ready developers.
                    </p>
                </ScrollReveal>

                {/* What students build */}
                <ScrollReveal delay={0.1} className="mb-20">
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 md:p-12 text-center shadow-sm">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Real-World Applications</h2>
                        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                            At Zentro Solutions, students don't just learn theory — they build real-world applications in:
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            {['Java Development', 'Python Programming', 'Web Development (HTML, CSS, JS)', 'MERN Stack Development', 'Software Project Engineering'].map(skill => (
                                <span key={skill} className="px-5 py-2.5 bg-white text-primary font-semibold rounded-xl shadow-sm border border-gray-100 flex items-center">
                                    <Code size={18} className="mr-2 opacity-70" /> {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </ScrollReveal>

                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <ScrollReveal delay={0.1} className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10 border-t-4 border-t-primary transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mr-4">
                                <Target className="text-primary w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            To create industry-ready developers by delivering affordable, high-quality internship programs that focus on practical learning and professional growth.
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={0.2} className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 md:p-10 border-t-4 border-t-accent transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-center mb-6">
                            <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mr-4">
                                <Eye className="text-accent w-6 h-6" />
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900">Our Vision</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg">
                            To become a trusted technology training platform that nurtures innovation, builds confidence, and shapes the next generation of software professionals.
                        </p>
                    </ScrollReveal>
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
                            <ScrollReveal key={idx} delay={idx * 0.05} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                <Feature.icon className="w-8 h-8 text-indigo-400 mb-4" />
                                <span className="font-semibold text-gray-800">{Feature.text}</span>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>

                {/* Commitment */}
                <ScrollReveal delay={0.2} className="bg-gray-900 rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden shadow-xl">
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
