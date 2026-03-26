import { ExternalLink, Folder } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Projects = () => {
    const projects = [
        { title: 'Chat Application', stack: 'MERN Stack', desc: 'Real-time messaging with Socket.io' },
        { title: 'E-commerce Platform', stack: 'React & Node', desc: 'Full-featured shopping cart & payment integration' },
        { title: 'Learning Management System', stack: 'MERN Stack', desc: 'Course creation, student enrollment, video streaming' },
        { title: 'Developer Portfolio', stack: 'React & Tailwind', desc: 'Modern animated personal portfolio website' },
        { title: 'Task Manager', stack: 'Python Django', desc: 'Kanban board with drag-and-drop functionality' },
        { title: 'AI Chatbot Integration', stack: 'Python & React', desc: 'OpenAI API integration for intelligent responses' },
        { title: 'Student Portal', stack: 'Java Spring Boot', desc: 'University management system with grade tracking' },
        { title: 'Browser Code Editor', stack: 'React', desc: 'In-browser IDE with syntax highlighting' },
    ];

    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Sample Projects | Zentro Solutions - Student Portfolio</title>
                <meta name="description" content="View sample projects built by Zentro Solutions interns, including MERN stack apps, Python systems, and Java applications." />
                <meta name="keywords" content="student projects, coding portfolio, web development samples, zentro solutions projects" />
                <link rel="canonical" href="https://zentrosolution.fun/projects" />

                {/* Open Graph / Social Media */}
                <meta property="og:title" content="Internship Projects | Zentro Solutions" />
                <meta property="og:description" content="Take a look at the industry-standard projects our students build." />
                <meta property="og:url" content="https://zentrosolution.fun/projects" />
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
    "name": "Projects",
    "item": "https://zentrosolution.fun/projects"
  }]
}
`}
                </script>
            </Helmet>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Sample Projects</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Explore the diverse range of industry-standard projects our interns build during their training.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {projects.map((proj, idx) => (
                        <div key={idx} className="bg-white flex flex-col rounded-xl shadow-md border border-gray-100 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 transition-transform group cursor-pointer border-gray-100 shadow-sm hover:shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <Folder className="text-primary w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{proj.title}</h3>
                            <p className="text-sm font-semibold text-accent mb-3">{proj.stack}</p>
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">{proj.desc}</p>
                            <a href="#" className="mt-auto px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-center w-full group-hover:bg-indigo-600 group-hover:text-white">
                                View Project <ExternalLink size={16} className="ml-2" />
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Projects;
