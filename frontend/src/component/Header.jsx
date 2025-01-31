import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRobot, FaUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const hideFeatures = ["/about", "/login", "/contact", "/registration"].includes(location.pathname);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                {/* Logo and Navigation */}
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex items-center space-x-2"
                >
                    <FaRobot className="text-3xl text-blue-400" />
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        RRR
                    </h1>
                </motion.div>

                <nav className="hidden md:flex items-center space-x-6">
                    <NavLink to="/" className={({ isActive }) => `font-medium py-2 px-4 rounded-lg transition-all duration-300 ${isActive ? "text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg" : "text-gray-300 hover:text-white hover:bg-gray-700"}`}>
                        Home
                    </NavLink>
                    <NavLink 
                        to="/about" 
                        className={({ isActive }) => 
                            `font-medium py-2 px-4 rounded-lg ${isActive 
                                ? "text-white bg-indigo-600 shadow-md" 
                                : "text-gray-400 hover:text-white hover:bg-indigo-500 transition"}`
                        }
                    >
                        About
                    </NavLink>
                    {!hideFeatures && (
                        <a href="#features" className="text-gray-400 font-medium py-2 px-4 rounded-lg hover:text-white hover:bg-indigo-500 transition">
                            Features
                        </a>
                    )}
                    <NavLink 
                        to="/contact" 
                        className={({ isActive }) => 
                            `font-medium py-2 px-4 rounded-lg ${isActive 
                                ? "text-white bg-indigo-600 shadow-md" 
                                : "text-gray-400 hover:text-white hover:bg-indigo-500 transition"}`
                        }
                    >
                        Contact
                    </NavLink>
                </nav>

                {/* User Info and Actions */}
                <div className="flex space-x-4 items-center">
                    {user ? (
                        <div className="relative" ref={profileMenuRef}>
                            <button
                                onClick={() => setShowProfileMenu(!showProfileMenu)}
                                className="flex items-center space-x-2 text-gray-300 hover:text-white"
                            >
                                <FaUserCircle className="text-2xl" />
                                <span>{user.fullName}</span>
                            </button>
                            
                            {showProfileMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                                >
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Profile
                                    </Link>
                                    <Link
                                        to="/resume-builder"
                                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                                    >
                                        Resume Builder
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        <>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <NavLink
                                    to="/login"
                                    className={({ isActive }) => `py-2 px-4 rounded-md ${isActive ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" : "bg-blue-500 text-white hover:bg-blue-600 transition"}`}
                                >
                                    Login
                                </NavLink>
                            </motion.div>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <NavLink
                                    to="/registration"
                                    className={({ isActive }) => `py-2 px-4 rounded-md ${isActive ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg" : "bg-green-500 text-white hover:bg-green-600 transition"}`}
                                >
                                    Register
                                </NavLink>
                            </motion.div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
