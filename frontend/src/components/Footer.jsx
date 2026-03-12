import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Twitter, Github } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="text-2xl font-bold text-primary mb-4 block">
                            Zentro<span className="text-accent">Solutions</span>
                        </Link>
                        <p className="text-gray-500 mb-6 text-sm">
                            Empowering students with industry-standard internship programs and real-world project experience.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors"><Twitter size={20} /></a>
                            <a href="https://www.linkedin.com/feed/update/urn:li:activity:7437873064358526976" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Linkedin size={20} /></a>
                            <a href="https://github.com/infozentrosolutions" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Github size={20} /></a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Programs</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link to="/internships" className="hover:text-primary transition-colors">Python Development</Link></li>
                            <li><Link to="/internships" className="hover:text-primary transition-colors">MERN Stack</Link></li>
                            <li><Link to="/internships" className="hover:text-primary transition-colors">Java Programming</Link></li>
                            <li><Link to="/internships" className="hover:text-primary transition-colors">Web Development</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Company</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
                            <li><Link to="/projects" className="hover:text-primary transition-colors">Projects</Link></li>
                            <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
                        <ul className="space-y-3 text-sm text-gray-500">
                            <li className="flex items-center space-x-3">
                                <Mail size={16} className="text-primary" /> <span>info.zentro.solutions@gmail.com</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={16} className="text-primary" /> <span>+91 9597504603</span>
                            </li>
                            <li className="flex items-start space-x-3">
                                <MapPin size={16} className="text-primary mt-1" /> <span>435, Kanthasami Puthur, Malliyakarai, Attur, Salem District, Tamil Nadu - 636107</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Zentro Solutions. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
                        <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
