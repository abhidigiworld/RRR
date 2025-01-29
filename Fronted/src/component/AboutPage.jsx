import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const AboutPage = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <Header/>

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-100 to-purple-100 py-16">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center px-4">
                    <div className="flex-1 text-center md:text-left">
                        <h2 className="text-4xl font-bold text-gray-800">
                            About <span className="text-indigo-600">RRR</span>
                        </h2>
                        <p className="mt-4 text-gray-600 text-lg">
                            We are dedicated to empowering individuals with the tools they need to build their careers. Our platform combines AI-driven technology with personalized services to create the ultimate career-building experience.
                        </p>
                    </div>
                    <div className="flex-1">
                        <img
                            src="https://wallpapers.com/images/hd/web-development-team-cartoon-4wynyqptfgs8bh3u.jpg"
                            alt="Team Illustration"
                            className="w-full h-auto"
                        />
                    </div>
                </div>
            </section>

            {/* Vision, Mission, Values */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-gray-800">Our Core Principles</h3>
                    <p className="mt-4 text-gray-600 text-lg">
                        We are driven by our mission, inspired by our vision, and committed to our values.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        {/* Vision */}
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <img
                                src="data:image/png;base64,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"
                                alt="Vision"
                                className="w-16 mx-auto"
                            />
                            <h4 className="mt-4 text-xl font-semibold text-gray-800">
                                Our Vision
                            </h4>
                            <p className="mt-2 text-gray-600">
                                To create a world where everyone has equal access to career-building opportunities.
                            </p>
                        </div>
                        {/* Mission */}
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <img
                                src="data:image/png;base64,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"
                                alt="Mission"
                                className="w-16 mx-auto"
                            />
                            <h4 className="mt-4 text-xl font-semibold text-gray-800">
                                Our Mission
                            </h4>
                            <p className="mt-2 text-gray-600">
                                To empower individuals with cutting-edge tools and personalized guidance to achieve their career goals.
                            </p>
                        </div>
                        {/* Values */}
                        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                            <img
                                src="data:image/png;base64,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"
                                alt="Values"
                                className="w-16 mx-auto"
                            />
                            <h4 className="mt-4 text-xl font-semibold text-gray-800">
                                Our Values
                            </h4>
                            <p className="mt-2 text-gray-600">
                                Integrity, innovation, and inclusivity are at the heart of everything we do.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 bg-gradient-to-r from-purple-100 to-blue-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-3xl font-bold text-gray-800">
                        Meet Our Team
                    </h3>
                    <p className="mt-4 text-gray-600 text-lg">
                        Our diverse team of experts is dedicated to helping you achieve success.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        {/* Team Member 1 */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <img
                                src=""
                                alt="Team Member 1"
                                className="rounded-full w-24 h-24 mx-auto"
                            />
                            <h4 className="mt-4 text-lg font-semibold text-gray-800">
                                Deepak And Azhar
                            </h4>
                            <p className="text-gray-600">Desingner</p>
                        </div>
                        {/* Team Member 2 */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <img
                                src=""
                                alt="Team Member 2"
                                className="rounded-full w-24 h-24 mx-auto"
                            />
                            <h4 className="mt-4 text-lg font-semibold text-gray-800">
                                Abhishek
                            </h4>
                            <p className="text-gray-600">Designer</p>
                        </div>
                        {/* Team Member 3 */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <img
                                src=""
                                alt="Team Member 3"
                                className="rounded-full w-24 h-24 mx-auto"
                            />
                            <h4 className="mt-4 text-lg font-semibold text-gray-800">
                                Ayush
                            </h4>
                            <p className="text-gray-600">Developer</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AboutPage;
