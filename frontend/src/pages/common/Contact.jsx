import { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import PremiumVector from '../../assets/Premium_Vector-removebg-preview.png';

const Contact = () => {
    const formRef = useRef();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_name: '',
        name: '',
        from_email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const sendEmail = (e) => {
        e.preventDefault();

        if (!formData.name || !formData.from_email || !formData.message) {
            toast.warning('Please fill out all fields.');
            return;
        }

        setLoading(true);

        // Using the credentials provided by the user
        emailjs.sendForm(
            'service_l1twjhk',
            'template_yozrtga',
            formRef.current,
            'Q8z42G4gxCfzH66AU'
        )
            .then((result) => {
                toast.success('Message sent successfully! We will get back to you soon.');
                setFormData({ user_name: '', name: '', from_email: '', message: '' });
                setLoading(false);
            }, (error) => {
                toast.error('Failed to send message. Please try again later.');
                setLoading(false);
            });
    };
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
            <Helmet>
                <title>Contact Us | Zentro Solutions - Get in Touch</title>
                <meta name="description" content="Have questions about our internship programs or services? Contact Zentro Solutions today for expert guidance and support." />
                <meta name="keywords" content="contact zentro solutions, web development support, internship inquiry, salem tech office" />
                <link rel="canonical" href="https://zentrosolution.fun/contact" />

                {/* Open Graph / Social Media */}
                <meta property="og:title" content="Contact Zentro Solutions" />
                <meta property="og:description" content="Reach out to us for any queries related to our programs and services." />
                <meta property="og:url" content="https://zentrosolution.fun/contact" />
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
    "name": "Contact",
    "item": "https://zentrosolution.fun/contact"
  }]
}
`}
                </script>
            </Helmet>
            <ToastContainer position="top-right" autoClose={4000} />
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <span className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 text-sm font-bold rounded-full mb-4 tracking-wider uppercase">Say Hello</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Have questions about our internship programs? We're here to help.</p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="bg-gradient-to-br from-indigo-700 to-violet-800 p-10 text-white flex flex-col justify-between"
                    >
                        <div>
                            <h3 className="text-3xl font-bold mb-6">Get in Touch</h3>
                            <p className="text-indigo-100 mb-10 leading-relaxed">Fill out the form and our team will get back to you within 24 hours.</p>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <Mail className="w-6 h-6 text-indigo-300" />
                                    <span className="text-lg">info.zentro.solutions@gmail.com</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <Phone className="w-6 h-6 text-indigo-300" />
                                    <span className="text-lg">+91 9597504603</span>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-6 h-6 text-indigo-300 mt-1" />
                                    <span className="text-lg">435, Kanthasami Puthur,<br />Malliyakarai, Attur,<br />Salem District, Tamil Nadu - 636107</span>
                                </div>
                            </div>
                        </div>

                        {/* Illustration — hidden on mobile to keep layout clean */}
                        <div className="hidden md:flex mt-auto justify-center items-end pt-8">
                            <img
                                src={PremiumVector}
                                alt="Support Illustration"
                                className="w-72 h-auto object-contain drop-shadow-2xl transition-transform hover:scale-105 duration-500"
                            />
                        </div>
                    </motion.div>

                    {/* Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="p-10"
                    >
                        <form ref={formRef} className="space-y-6" onSubmit={sendEmail}>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={(e) => {
                                        handleChange(e);
                                        setFormData(prev => ({ ...prev, name: e.target.value, user_name: e.target.value }));
                                    }}
                                    className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900 bg-gray-50 hover:bg-white"
                                    placeholder="John Doe"
                                />
                                <input type="hidden" name="user_name" value={formData.user_name} />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    name="from_email"
                                    value={formData.from_email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder-gray-400 text-gray-900 bg-gray-50 hover:bg-white"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none placeholder-gray-400 text-gray-900 bg-gray-50 hover:bg-white"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.97 }}
                                disabled={loading}
                                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full flex items-center justify-center space-x-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                            >
                                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                                {!loading && <Send size={18} />}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
