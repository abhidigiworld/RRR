import React from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

const WelcomePage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <Header/>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-100 via-purple-50 to-blue-100 py-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl font-bold text-gray-800 leading-snug">
                            Transform Your Career with <span className="text-indigo-600">RRR</span>
                        </h2>
                        <p className="mt-4 text-gray-600 text-lg">
                            AI-driven tools to create professional resumes and ace mock interviews.
                            Secure, reliable, and designed for your success.
                        </p>
                        <div className="mt-6 flex justify-center md:justify-start space-x-4">
                            <button className="bg-indigo-500 text-white py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-indigo-600">
                                Get Started
                            </button>
                            <button className="bg-gray-100 text-gray-700 py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-gray-200">
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="flex-1">
                        <img
                            src="https://cdn3d.iconscout.com/3d/premium/thumb/job-interview-3d-illustration-download-in-png-blend-fbx-gltf-file-formats--meeting-business-pack-illustrations-3846823.png?f=webp"
                            alt="Hero Illustration"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold text-gray-800">
                        Why Choose <span className="text-indigo-600">RRR?</span>
                    </h3>
                    <p className="mt-4 text-gray-600 text-lg">
                        RRR provides everything you need to succeed in your career journey.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        {/* Feature 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <img src="data:image/png;base64,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" alt="Feature 1" className="w-16 mx-auto" />
                            <h4 className="mt-4 text-xl font-semibold text-gray-800">
                                AI-Powered Resumes
                            </h4>
                            <p className="mt-2 text-gray-600">
                                Create stunning, professional resumes tailored to your goals.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRByEaugIR01if_d-jbjGg4IcXOQTQgEeXnzUuBQjDa9zxFdcC8D3ZO_oo5VQH5FytfyL4&usqp=CAU" alt="Feature 2" className="w-16 mx-auto" />
                            <h4 className="mt-4 text-xl font-semibold text-gray-800">
                                Mock Interviews
                            </h4>
                            <p className="mt-2 text-gray-600">
                                Practice with real-time feedback and boost your confidence.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <img src="data:image/png;base64,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" alt="Feature 3" className="w-16 mx-auto" />
                            <h4 className="mt-4 text-xl font-semibold text-gray-800">
                                Secure Platform
                            </h4>
                            <p className="mt-2 text-gray-600">
                                Your data is safe with us. Trusted by thousands of professionals.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer/>
        </div>
    );
};

export default WelcomePage;
