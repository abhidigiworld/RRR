import React, { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        ageCategory: "",
        password: "",
        confirmPassword: "",
    });

    const [emailError, setEmailError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name === "email") {
            validateEmail(value);
        }
    };

    const validateEmail = (email) => {
        // Regular expression for validating an email address
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setEmailError("Please enter a valid email address.");
        } else {
            setEmailError("");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (emailError) {
            alert("Please fix the errors in the form.");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            
            if (response.ok) {
                setShowSuccessModal(true);
                setTimeout(() => {
                    setShowSuccessModal(false);
                    navigate('/login');
                }, 2000);
            } else {
                console.error("Registration error response:", data);
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration error:", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
                <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg relative">
                    {/* Success Modal */}
                    <AnimatePresence>
                        {showSuccessModal && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50"
                            >
                                <motion.div
                                    initial={{ y: -50 }}
                                    animate={{ y: 0 }}
                                    className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center"
                                >
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <svg
                                            className="w-8 h-8 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        Registration Successful!
                                    </h2>
                                    <p className="text-gray-600 text-center mb-4">
                                        Redirecting you to login...
                                    </p>
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
                        Create an Account
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Email */}
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {emailError && (
                            <p className="text-red-500 text-sm mt-2">{emailError}</p>
                        )}

                        {/* Age Category */}
                        <select
                            name="ageCategory"
                            value={formData.ageCategory}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>
                                Select Age Category
                            </option>
                            <option value="Student">Student</option>
                            <option value="Professional">Professional</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Password */}
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Confirm Password */}
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={!isLoading && { scale: 1.02 }}
                            whileTap={!isLoading && { scale: 0.98 }}
                            className={`w-full relative ${
                                isLoading
                                    ? 'bg-blue-400 cursor-wait'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            } text-white py-3 px-6 rounded-md shadow-md transition-all duration-300`}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Registering...
                                </div>
                            ) : (
                                'Register'
                            )}
                        </motion.button>

                        <div className="mt-4 text-center text-gray-400">
                            <p>
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-500 hover:text-blue-700">
                                    Login here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default RegistrationPage;
