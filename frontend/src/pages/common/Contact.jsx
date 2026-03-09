import { useState, useRef } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
            <ToastContainer position="top-right" autoClose={4000} />
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">Have questions about our internship programs? We're here to help.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 bg-white rounded-2xl shadow-soft overflow-hidden">
                    {/* Contact Info */}
                    <div className="bg-primary p-10 text-white flex flex-col justify-between">
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
                                    <span className="text-lg">+91 98765 43210</span>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <MapPin className="w-6 h-6 text-indigo-300 mt-1" />
                                    <span className="text-lg">123 Startup Hub,<br />Innovation Park<br />Tech City 560001</span>
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
                    </div>

                    {/* Form */}
                    <div className="p-10">
                        <form ref={formRef} className="space-y-6" onSubmit={sendEmail}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name" // Matches {{name}} in EmailJS template
                                    value={formData.name}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // Also update user_name for the Subject line {{user_name}}
                                        setFormData(prev => ({ ...prev, name: e.target.value, user_name: e.target.value }));
                                    }}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder-gray-500 text-gray-900"
                                    placeholder="John Doe"
                                />
                                {/* Hidden input to send user_name to EmailJS for the subject line */}
                                <input type="hidden" name="user_name" value={formData.user_name} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="from_email"
                                    value={formData.from_email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all placeholder-gray-500 text-gray-900"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all resize-none placeholder-gray-500 text-gray-900"
                                    placeholder="How can we help you?"
                                ></textarea>
                            </div>
                            <button
                                disabled={loading}
                                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 w-full flex items-center justify-center space-x-2 disabled:bg-indigo-400 disabled:cursor-not-allowed">
                                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                                {!loading && <Send size={18} />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
