import React, { useState } from 'react';
import { Code, Menu, X, Search as SearchIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { logoutUser } from '../features/userSlicer';
import {
    Navbar as UINavbar,
    NavBody,
    MobileNav,
    MobileNavHeader,
    MobileNavMenu,
    NavbarButton,
} from './ui/resizable-navbar';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Roadmaps', href: '/roadmaps' },
];

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

    return (
        <UINavbar className="fixed mt-5 inset-x-0 top-0 z-50">
            <NavBody className="px-4 py-2">
                <Link to="/" className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1">
                    <div className="relative">
                        <Code className="h-8 w-8 text-blue-300" />
                        <div className="absolute inset-0 h-8 w-8 bg-blue-400/30 rounded-lg blur-xl opacity-70"></div>
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent">
                        CodingLearning
                    </span>
                </Link>

                <div className="hidden lg:flex flex-1 items-center justify-center space-x-2 text-sm font-medium">
                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="relative px-4 py-2 text-neutral-300 rounded-full hover:bg-neutral-800 transition"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop search + auth actions */}
                <div className="hidden lg:flex items-center gap-6">
                    {/* Search */}
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            const val = e.currentTarget.elements.search.value.trim();
                            if (val) navigate(`/search?q=${encodeURIComponent(val)}`);
                        }}
                        className="relative"
                    >
                        <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            name="search"
                            type="search"
                            placeholder="Search ( / )"
                            className="w-50 pl-9 pr-3 py-1.5 rounded-3xl bg-[#020618] border border-slate-700 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                            // className="w-50 pl-9 pr-3 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={e => {
                                if (e.key === '/' && e.currentTarget.value === '') {
                                    e.preventDefault();
                                    e.currentTarget.focus();
                                }
                            }}
                        />
                    </form>

                    {!isLoggedin && (
                        <NavbarButton
                            as={Link}
                            to="/signin"
                            variant="secondary"
                            className=""
                        >
                            Sign In
                        </NavbarButton>
                    )}
                    {!isLoggedin && (
                        <NavbarButton as={Link} to="/signup" variant="gradient">
                            Sign Up
                        </NavbarButton>
                    )}
                    {isLoggedin && (
                        <NavbarButton as="button" onClick={handleLogout} variant="dark">
                            Logout
                        </NavbarButton>
                    )}
                </div>
            </NavBody>

            <MobileNav>
                <MobileNavHeader>
                    <Link
                        to="/"
                        className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1"
                    >
                        <Code className="h-7 w-7 text-blue-300" />
                        <span className="text-lg font-semibold">CodingLearning</span>
                    </Link>
                    <button
                        aria-label="Toggle mobile menu"
                        className="p-2 rounded-md"
                        onClick={() => setMobileMenuOpen(prev => !prev)}
                    >
                        {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
                    </button>
                </MobileNavHeader>
                <MobileNavMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)}>
                    {/* Mobile search */}
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            const val = e.currentTarget.elements.search.value.trim();
                            if (val) {
                                setMobileMenuOpen(false);
                                navigate(`/search?q=${encodeURIComponent(val)}`);
                            }
                        }}
                        className="relative w-full mb-2"
                    >
                        <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                            name="search"
                            type="search"
                            placeholder="Search ( / )"
                            className="w-full pl-9 pr-3 py-2  bg-slate-800/60 border border-slate-700 text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={e => {
                                if (e.key === '/' && e.currentTarget.value === '') {
                                    e.preventDefault();
                                    e.currentTarget.focus();
                                }
                            }}
                        />
                    </form>

                    {navLinks.map(link => (
                        <Link
                            key={link.name}
                            to={link.href}
                            className="px-2 py-2 text-lg rounded-md hover:bg-neutral-800 w-full"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="pt-2 w-full">
                        {!isLoggedin && (
                            <NavbarButton
                                as={Link}
                                to="/signin"
                                variant="secondary"
                                className="w-full"
                            >
                                Sign In
                            </NavbarButton>
                        )}
                        {!isLoggedin && (
                            <NavbarButton
                                as={Link}
                                to="/signup"
                                variant="gradient"
                                className="w-full mt-2"
                            >
                                Sign Up
                            </NavbarButton>
                        )}
                        {isLoggedin && (
                            <NavbarButton
                                as="button"
                                onClick={() => {
                                    setMobileMenuOpen(false);
                                    handleLogout();
                                }}
                                variant="dark"
                                className="w-full mt-2"
                            >
                                Logout
                            </NavbarButton>
                        )}
                    </div>
                </MobileNavMenu>
            </MobileNav>
        </UINavbar>
    );
};

export default Navbar;
