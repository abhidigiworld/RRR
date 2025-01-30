import React, { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";

const RegistrationPage = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        ageCategory: "",
        password: "",
        confirmPassword: "",
    });

    const [emailError, setEmailError] = useState("");

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (emailError) {
            alert("Please fix the errors in the form.");
            return;
        }

        // Handle form submission logic
        console.log("Form Submitted", formData);

        // Reset form after submission (optional)
        setFormData({
            fullName: "",
            email: "",
            ageCategory: "",
            password: "",
            confirmPassword: "",
        });
    };

    return (
        <>
            <Header />
            <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-100 via-blue-200 to-blue-300">
                <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-lg">
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
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-300"
                        >
                            Register
                        </button>
                    </form>
                    <div className="mt-4 text-center text-gray-400">
                        <p>
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-500 hover:text-blue-700">
                                Login here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
};

export default RegistrationPage;
