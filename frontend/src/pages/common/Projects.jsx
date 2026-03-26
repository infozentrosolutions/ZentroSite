import { ExternalLink, Folder, Code, Brain, Database, Globe, Cpu, Layers } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Projects = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
    }, []);

    const projects = [
        { title: 'Chat Application', stack: 'MERN Stack', desc: 'Real-time messaging with Socket.io', icon: Globe, color: 'from-blue-500 to-indigo-600' },
        { title: 'E-commerce Platform', stack: 'React & Node', desc: 'Full-featured shopping cart & payment integration', icon: Layers, color: 'from-violet-500 to-purple-600' },
        { title: 'Learning Management System', stack: 'MERN Stack', desc: 'Course creation, student enrollment, video streaming', icon: Brain, color: 'from-emerald-500 to-teal-600' },
        { title: 'Developer Portfolio', stack: 'React & Tailwind', desc: 'Modern animated personal portfolio website', icon: Code, color: 'from-pink-500 to-rose-600' },
        { title: 'Task Manager', stack: 'Python Django', desc: 'Kanban board with drag-and-drop functionality', icon: Cpu, color: 'from-orange-500 to-amber-600' },
        { title: 'AI Chatbot Integration', stack: 'Python & React', desc: 'OpenAI API integration for intelligent responses', icon: Brain, color: 'from-sky-500 to-cyan-600' },
        { title: 'Student Portal', stack: 'Java Spring Boot', desc: 'University management system with grade tracking', icon: Database, color: 'from-indigo-500 to-blue-600' },
        { title: 'Browser Code Editor', stack: 'React', desc: 'In-browser IDE with syntax highlighting', icon: Code, color: 'from-fuchsia-500 to-violet-600' },
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: { staggerChildren: 0.08 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
    };

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-indigo-50/40 relative overflow-hidden">
            <Helmet>
                <title>Sample Projects | Zentro Solutions - Student Portfolio</title>
                <meta name="description" content="View sample projects built by Zentro Solutions interns, including MERN stack apps, Python systems, and Java applications." />
                <meta name="keywords" content="student projects, coding portfolio, web development samples, zentro solutions projects" />
                <link rel="canonical" href="https://zentrosolution.fun/projects" />
                <meta property="og:title" content="Internship Projects | Zentro Solutions" />
                <meta property="og:description" content="Take a look at the industry-standard projects our students build." />
                <meta property="og:url" content="https://zentrosolution.fun/projects" />
                <meta property="og:type" content="website" />
                <script type="application/ld+json">{`
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{"@type": "ListItem","position": 1,"name": "Home","item": "https://zentrosolution.fun/"},{"@type": "ListItem","position": 2,"name": "Projects","item": "https://zentrosolution.fun/projects"}]
}
`}</script>
            </Helmet>

            {/* Decorative blobs */}
            <div className="absolute top-20 -left-40 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 -right-40 w-96 h-96 bg-violet-200/30 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full mb-4 tracking-wider uppercase">Our Portfolio</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sample Projects</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Explore the diverse range of industry-standard projects our interns build during their training.</p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {projects.map((proj, idx) => {
                        const Icon = proj.icon;
                        return (
                            <motion.div
                                key={idx}
                                variants={cardVariants}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="bg-white flex flex-col rounded-2xl shadow-md border border-gray-100 p-6 overflow-hidden relative group cursor-pointer"
                            >
                                {/* Top gradient bar */}
                                <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${proj.color} rounded-t-2xl`} />

                                <div className="flex justify-between items-start mb-4 mt-2">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${proj.color} flex items-center justify-center shadow-lg`}>
                                        <Icon className="text-white w-6 h-6" />
                                    </div>
                                    <ExternalLink className="text-gray-300 group-hover:text-indigo-500 transition-colors w-4 h-4" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">{proj.title}</h3>
                                <p className="text-sm font-semibold text-indigo-500 mb-3 uppercase tracking-wider">{proj.stack}</p>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{proj.desc}</p>
                                <a
                                    href="#"
                                    className="mt-auto px-4 py-2.5 bg-indigo-50 text-indigo-700 font-semibold rounded-xl hover:bg-indigo-600 hover:text-white transition-all duration-300 flex items-center justify-center w-full group-hover:bg-indigo-600 group-hover:text-white"
                                >
                                    View Project <ExternalLink size={15} className="ml-2" />
                                </a>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

export default Projects;
