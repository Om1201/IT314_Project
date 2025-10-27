import React from 'react'
import { Code, Menu, X } from "lucide-react"
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../features/userSlicer'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const navLinks = [
  { name: "Home", href: "/home" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

// const handleLogout = () => {
// }

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { username, email, isLoggedin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  
  const handleLogout = async () => {
    try {
      let response = await dispatch(logoutUser());
      response = response.payload;
      if (response.success) {
        toast.success("Logout successful");
        navigate('/', { replace: true })
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-xl bg-slate-900/80 shadow-xl border-b border-slate-700/60 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-4">
          
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <Code className="h-9 w-9 text-blue-300 drop-shadow-xl transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 h-9 w-9 bg-blue-400/30 rounded-lg blur-xl animate-pulse-slow opacity-70"></div>
            </div>
            <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-300 to-white bg-clip-text text-transparent transition-colors duration-300 group-hover:from-blue-200">
              CodingLearning
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-slate-300 text-md hover:text-blue-400 transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
            
            {!isLoggedin && <Link
              to="/signin"
              className="px-6 py-2 border border-blue-600 text-blue-400 rounded-xl hover:bg-blue-900/50 transition-all duration-300 font-medium text-md hover:scale-[1.03]"
            >
              Sign In
            </Link>}

            {!isLoggedin && <Link
              to="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-semibold text-md hover:scale-[1.03]"
            >
              Sign Up
            </Link>}
            {isLoggedin && <button
              className="px-6 py-2.5 cursor-pointer bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-semibold text-md hover:scale-[1.03]"
              onClick={handleLogout}
            >
              Logout
            </button>}
          </div>

          <button
            className="md:hidden text-slate-200 hover:text-blue-400 p-2 rounded-lg transition-colors duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-4 border-t border-slate-700/50 animate-slide-down">
            {[...navLinks].map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)} // Close menu on click
                className="block text-xl text-slate-300 hover:text-blue-400 transition-colors py-2 px-4 rounded-lg hover:bg-slate-800/50"
              >
                {link.name}
              </Link>
            ))}
            
            <div className="pt-4 border-t border-slate-800">
              {!isLoggedin && <Link
              to="/signin"
              className="block w-full px-6 py-2.5 border text-center border-blue-600 text-blue-400 rounded-xl hover:bg-blue-900/50 transition-all duration-300 font-medium text-md hover:scale-[1.03]"
            >
              Sign In
            </Link>}

            {!isLoggedin && <Link
              to="/signup"
              className="block w-full text-center mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-semibold text-md hover:scale-[1.03]"
            >
              Sign Up
            </Link>}
            {isLoggedin && <button
              className="block w-full text-center mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 font-semibold text-md hover:scale-[1.03]"
              onClick={handleLogout}
            >
              Logout
            </button>}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
