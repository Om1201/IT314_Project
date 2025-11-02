import React from 'react';
import { Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="border-t border-slate-700/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <Code className="h-6 w-6 text-blue-400" />
                            <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                                CodingLearning
                            </span>
                        </div>
                        <p className="text-slate-400 text-sm">
                            AI-powered learning roadmaps for everyone
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Product</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li>
                                <Link to="/" className="hover:text-blue-400 transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-blue-400 transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-blue-400 transition-colors">
                                    FAQ
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li>
                                <Link to="/" className="hover:text-blue-400 transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-blue-400 transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-slate-400 text-sm">
                            <li>
                                <Link to="/" className="hover:text-blue-400 transition-colors">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link to="/" className="hover:text-blue-400 transition-colors">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-700/50 pt-8 text-center text-slate-400 text-sm">
                    <p>&copy; 2025 CodingLearning. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
