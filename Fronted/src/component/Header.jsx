import { NavLink, useLocation } from "react-router-dom";

const Header = () => {
    const location = useLocation(); // Get the current route

    // Check if the current path is "/about" or "/login" (or any other route where "Features" shouldn't be shown)
    const hideFeatures = ["/about", "/login", "/contact" , "/registration"].includes(location.pathname);

    return (
        <header className="bg-gray-800 shadow-md py-2">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
                {/* Logo */}
                <h1 className="text-2xl font-bold text-white">RRR</h1>

                {/* Navigation Menu */}
                <nav className="hidden md:flex items-center space-x-6">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `font-medium py-2 px-4 rounded-lg ${isActive
                                ? "text-white bg-indigo-600 shadow-md"
                                : "text-gray-400 hover:text-white hover:bg-indigo-500 transition"
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
                    <NavLink
                        to="/login"
                        className={({ isActive }) =>
                            `py-2 px-4 rounded-md ${isActive
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-indigo-500 text-white hover:bg-indigo-600 transition"
                            }`
                        }
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/registration"
                        className={({ isActive }) =>
                            `py-2 px-4 rounded-md ${isActive
                                ? "bg-green-600 text-white shadow-md"
                                : "bg-green-500 text-white hover:bg-green-600 transition"
                            }`
                        }
                    >
                        Register
                    </NavLink>
                </div>
            </div>
        </header>
    );
};

export default Header;
