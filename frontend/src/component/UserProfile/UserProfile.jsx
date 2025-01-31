import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaFileAlt, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa';
import Header from '../Header';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/resume/user-data`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                setUserData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    {/* Profile Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-lg p-6 mb-6"
                    >
                        <div className="flex items-center space-x-4">
                            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-4xl text-white">{userData?.fullName?.[0]}</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{userData?.fullName}</h1>
                                <p className="text-gray-600">{userData?.email}</p>
                                <p className="text-gray-500">{userData?.ageCategory}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Profile Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Resume Section */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-lg shadow-lg p-6"
                        >
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <FaFileAlt className="mr-2 text-blue-500" />
                                Resume
                            </h2>
                            <div className="space-y-4">
                                <button 
                                    onClick={() => navigate('/resume-builder')}
                                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
                                >
                                    Edit Resume
                                </button>
                            </div>
                        </motion.div>

                        {/* Interview History */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-lg shadow-lg p-6"
                        >
                            <h2 className="text-xl font-bold mb-4 flex items-center">
                                <FaHistory className="mr-2 text-blue-500" />
                                Interview History
                            </h2>
                            <p className="text-gray-500">No interviews completed yet</p>
                        </motion.div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default UserProfile; 