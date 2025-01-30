import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaRobot } from "react-icons/fa";

const Header = () => {
    const location = useLocation(); // Get the current route

    // Check if the current path is "/about" or "/login" (or any other route where "Features" shouldn't be shown)
    const hideFeatures = ["/about", "/login", "/contact" , "/registration"].includes(location.pathname);

    return (
        <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg py-3">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                {/* Animated Logo */}
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

                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center space-x-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `font-medium py-2 px-4 rounded-lg transition-all duration-300 ${
                                isActive
                                    ? "text-white bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg"
                                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                            }`
                        }
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/about"
                        className={({ isActive }) =>
                            `font-medium py-2 px-4 rounded-lg ${isActive
                                ? "text-white bg-indigo-600 shadow-md"
                                : "text-gray-400 hover:text-white hover:bg-indigo-500 transition"
                            }`
                        }
                    >
                        About
                    </NavLink>

                    {/* Conditionally Render "Features" */}
                    {!hideFeatures && (
                        <a
                            href="#features"
                            className="text-gray-400 font-medium py-2 px-4 rounded-lg hover:text-white hover:bg-indigo-500 transition"
                        >
                            Features
                        </a>
                    )}

                    <NavLink
                        to="/contact"
                        className={({ isActive }) =>
                            `font-medium py-2 px-4 rounded-lg ${isActive
                                ? "text-white bg-indigo-600 shadow-md"
                                : "text-gray-400 hover:text-white hover:bg-indigo-500 transition"
                            }`
                        }
                    >
                        Contact
                    </NavLink>
                </nav>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                `py-2 px-4 rounded-md ${
                                    isActive
                                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                                        : "bg-blue-500 text-white hover:bg-blue-600 transition"
                                }`
                            }
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
                            className={({ isActive }) =>
                                `py-2 px-4 rounded-md ${
                                    isActive
                                        ? "bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg"
                                        : "bg-green-500 text-white hover:bg-green-600 transition"
                                }`
                            }
                        >
                            Register
                        </NavLink>
                    </motion.div>
                </div>
            </div>
        </header>
    );
};

export default Header;
