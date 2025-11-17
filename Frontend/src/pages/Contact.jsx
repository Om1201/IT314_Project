import { Code, MapPin, Mail, Linkedin, Instagram, Loader2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function ContactUs() {
    const [isSending, setIsSending] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

    const navigate = useNavigate();
    const handleSubmit = async e => {
        e.preventDefault();
        setIsSending(true);

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('email', form.email);
        formData.append('subject', form.subject);
        formData.append('message', form.message);
        formData.append('access_key', import.meta.env.VITE_WEB_API);

        const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData,
        });

        toast.success('Message sent successfully!');
        setForm({ name: '', email: '', subject: '', message: '' });

        setIsSending(false);
    };

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="bg-gradient-to-tr from-slate-800 via-cyan-900 to-slate-600 flex flex-col items-center justify-center">
            <Navbar />
            <div className="w-full max-w-5xl py-12">
                <div className="space-y-3 text-center mb-10">
                    <div
                        onClick={() => {
                            navigate('/');
                        }}
                        className="flex cursor-pointer items-center justify-center space-x-2 mb-6"
                    >
                        <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg">
                            <Code className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-white tracking-tight">
                            CodeLearn
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold text-white leading-tight">Get in Touch</h1>
                    <p className="text-sm text-gray-400 max-w-xl mx-auto">
                        Have a question or want to work together? Fill out the form below or reach
                        out directly.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-950/50 border border-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6">
                        <h2 className="text-xl font-bold text-white">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label
                                    htmlFor="name"
                                    className="block text-xs font-semibold text-gray-200 uppercase tracking-wide"
                                >
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={e => handleChange(e)}
                                    placeholder="Your name"
                                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 hover:border-slate-600/50 text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="block text-xs font-semibold text-gray-200 uppercase tracking-wide"
                                >
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    onChange={e => handleChange(e)}
                                    value={form.email}
                                    placeholder="your.email@example.com"
                                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 hover:border-slate-600/50 text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="subject"
                                    className="block text-xs font-semibold text-gray-200 uppercase tracking-wide"
                                >
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    name="subject"
                                    onChange={e => handleChange(e)}
                                    value={form.subject}
                                    placeholder="What is this regarding?"
                                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 hover:border-slate-600/50 text-sm"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label
                                    htmlFor="message"
                                    className="block text-xs font-semibold text-gray-200 uppercase tracking-wide"
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows="4"
                                    name="message"
                                    onChange={e => handleChange(e)}
                                    value={form.message}
                                    placeholder="Your message here..."
                                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/50 rounded-lg text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all duration-200 hover:border-slate-600/50 text-sm resize-none"
                                    required
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSending}
                                className="w-full cursor-pointer px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 transform active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:shadow-none"
                            >
                                {isSending ? (
                                    <div className="flex justify-center items-center gap-1">
                                        <Loader2 className="h-5 w-5 animate-spin" /> Sending...
                                    </div>
                                ) : (
                                    <>Send Message</>
                                )}
                            </button>
                        </form>
                    </div>

                    <div className="bg-slate-950/50 border border-slate-800/50 backdrop-blur-sm rounded-2xl shadow-2xl p-8 space-y-8">
                        <h2 className="text-xl font-bold text-white">Contact Information</h2>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <Mail className="h-5 w-5 text-blue-400" />
                                <span className="block text-xs font-semibold text-gray-200 uppercase tracking-wide">
                                    Email
                                </span>
                            </div>
                            <a
                                href="mailto:202301177@dau.ac.in"
                                className="text-base text-white hover:text-blue-400 transition-colors duration-200 pl-8 block"
                            >
                                202301177@dau.ac.in
                            </a>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-3">
                                <MapPin className="h-5 w-5 text-blue-400" />
                                <span className="block text-xs font-semibold text-gray-200 uppercase tracking-wide">
                                    Address
                                </span>
                            </div>
                            <div className="text-base text-gray-300 pl-8 space-y-1">
                                <p>DAIICT - campus</p>
                                <p>near, Reliance Cross Rd</p>
                                <p>Gandhinagar, Gujarat, India, 382007</p>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4">
                            <span className="block text-xs font-semibold text-gray-200 uppercase tracking-wide">
                                Connect With Me
                            </span>
                            <div className="flex space-x-4">
                                <a
                                    href="https://www.linkedin.com/in/om-chavda-06a390302/"
                                    aria-label="LinkedIn"
                                    target="_blank"
                                    className="p-2 border border-slate-700/50 rounded-lg text-gray-300 hover:text-blue-400 hover:border-blue-400 transition-colors duration-200"
                                >
                                    <Linkedin className="h-6 w-6" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}
