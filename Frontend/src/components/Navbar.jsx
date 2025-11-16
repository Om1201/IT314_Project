import React, { useState } from 'react';
import { Code, Menu, X, SearchIcon, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { logoutUser } from '../features/userSlicer';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Roadmaps', href: '/roadmaps' },
];

const transition = {
    type: "spring",
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
};

const MenuItem = ({ setActive, active, item, children }) => {
    return (
        <div onMouseEnter={() => setActive(item)} className="relative">
            <motion.p
                transition={{ duration: 0.3 }}
                className="cursor-pointer hover:text-blue-300 text-white font-medium px-4 py-2 rounded-lg hover:bg-slate-800/30 transition-all duration-200"
            >
                {item}
            </motion.p>
            {active !== null && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={transition}
                >
                    {active === item && (
                        <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4 z-50">
                            <motion.div
                                transition={transition}
                                layoutId="active"
                                className="bg-slate-900/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-2xl shadow-black/20"
                            >
                                <motion.div layout className="w-max h-full p-4">
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

const Menu2 = ({ setActive, children }) => {
    return (
        <nav
            onMouseLeave={async() => {
                await setTimeout(() => {
                    setActive(null)
                }, 1000);
            }}
            className="relative rounded-2xl w-screen border bg-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl shadow-black/10 flex items-center justify-between px-6 py-3"
        >
            {children}
        </nav>
    );
};

const HoveredLink = ({ children, icon, className = "", href, onClick, ...rest }) => {
    return (
        <Link
            to={href || "#"}
            onClick={onClick}
            className={`flex items-center gap-3 text-gray-300 hover:text-white hover:bg-slate-800/50 px-3 py-2 rounded-lg transition-all duration-200 ${className}`}
            {...rest}
        >
            {icon && <span className="flex-shrink-0">{icon}</span>}
            <span>{children}</span>
        </Link>
    );
};

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [active, setActive] = useState(null);
    const { username, email, isLoggedin } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            let response = await dispatch(logoutUser());
            response = response.payload;
            if (response.success) {
                toast.success('Logout successful');
                navigate('/', { replace: true });
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const val = e.currentTarget.elements.search.value.trim();
        if (val) {
            navigate(`/search?q=${encodeURIComponent(val)}`);
            setMobileMenuOpen(false);
        }
    };

    return (
        <>
            {/* Desktop Navbar */}
            <div className="hidden lg:flex fixed top-6 inset-x-0 max-w-4xl mx-auto z-50 px-4">
                <Menu2 setActive={setActive}>
                    <Link
                        to="/"
                        className="flex cursor-pointer items-center gap-2 mr-8"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                            <Code className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-lg">CodingLearning</span>
                    </Link>

                    <MenuItem setActive={setActive} active={active} item="Navigation">
                        <div className="flex flex-col space-y-3 text-sm min-w-[160px]">
                            {navLinks.map(link => (
                                <HoveredLink key={link.name} href={link.href}>
                                    {link.name}
                                </HoveredLink>
                            ))}
                        </div>
                    </MenuItem>

                    <MenuItem setActive={setActive} active={active} item="Search">
                        <div className="flex flex-col space-y-3 text-sm min-w-[220px]">
                            <form onSubmit={handleSearch} className="relative">
                                <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                                <input
                                    name="search"
                                    type="search"
                                    placeholder="Search roadmaps..."
                                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                                    onKeyDown={e => {
                                        if (e.key === '/' && e.currentTarget.value === '') {
                                            e.preventDefault();
                                            e.currentTarget.focus();
                                        }
                                    }}
                                />
                            </form>
                        </div>
                    </MenuItem>

                    {isLoggedin && (
                        <MenuItem setActive={setActive} active={active} item="Account">
                            <div className="flex flex-col space-y-3 text-sm min-w-[200px]">
                                <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-semibold text-sm">
                                            {username?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-white font-medium text-sm">{username || "User"}</div>
                                        <div className="text-gray-400 text-xs">{email}</div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-700 pt-2">
                                    <HoveredLink 
                                        href={`/profile`}
                                        icon={<User className="w-4 h-4" />}
                                    >
                                        Your Profile
                                    </HoveredLink>
                                    <button
                                        onClick={() => {
                                            setActive(null);
                                            handleLogout();
                                        }}
                                        className="flex items-center gap-3 w-full cursor-pointer hover:text-red-400 text-gray-300 hover:bg-slate-800/50 px-3 py-2 rounded-lg transition-all duration-200 mt-2"
                                    >
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </MenuItem>
                    )}

                    {!isLoggedin && (
                        <MenuItem setActive={setActive} active={active} item="Auth">
                            <div className="flex flex-col space-y-3 text-sm min-w-[220px]">
                                <div className="text-center p-4 bg-gradient-to-br from-blue-900/20 to-blue-900/20 rounded-lg border border-blue-500/20">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Code className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-white font-semibold mb-1">Join Now</div>
                                    <div className="text-gray-400 text-xs">Start learning today</div>
                                </div>

                                <div className="space-y-2">
                                    <HoveredLink
                                        href="/signin"
                                        className="bg-slate-800/30 hover:bg-blue-900/20 rounded-lg px-3 py-2 transition-colors"
                                    >
                                        Sign In
                                    </HoveredLink>
                                    <HoveredLink
                                        href="/signup"
                                        className="bg-gradient-to-r from-blue-600/20 to-blue-600/20 hover:from-blue-600/30 hover:to-blue-600/30 rounded-lg px-3 py-2 transition-colors border border-blue-500/20"
                                    >
                                        Sign Up
                                    </HoveredLink>
                                </div>
                            </div>
                        </MenuItem>
                    )}
                </Menu2>
            </div>

            {/* Mobile Navbar */}
            <div className="lg:hidden fixed top-4 inset-x-0 z-50 px-4">
                <div className="flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl px-4 py-3 shadow-xl">
                    <Link
                        to="/"
                        className="flex items-center gap-2"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Code className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-bold text-sm">CodingLearning</span>
                    </Link>

                    <button
                        aria-label="Toggle mobile menu"
                        className="p-2"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-16 inset-x-4 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-4 space-y-4 shadow-xl"
                    >
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="relative">
                            <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                            <input
                                name="search"
                                type="search"
                                placeholder="Search..."
                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </form>

                        {/* Mobile Navigation Links */}
                        {navLinks.map(link => (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}

                        {/* Mobile Auth Section */}
                        <div className="border-t border-slate-700 pt-4 space-y-2">
                            {isLoggedin ? (
                                <>
                                    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700/50 mb-2">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold text-sm">
                                                {username?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase() || "U"}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-white font-medium text-sm">{username}</div>
                                            <div className="text-gray-400 text-xs">{email}</div>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/profile/${username}`}
                                        className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Your Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            handleLogout();
                                        }}
                                        className="w-full text-left px-3 py-2 text-gray-300 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/signin"
                                        className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/signup"
                                        className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Sign Up
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default Navbar;
