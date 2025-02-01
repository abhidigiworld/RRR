import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaFileAlt, FaHistory, FaCog, FaSignOutAlt, FaEdit, FaDownload } from 'react-icons/fa';
import Header from '../Header';
import Footer from '../Footer';
import { useNavigate } from 'react-router-dom';
import PreviewModal from '../ResumeBuilder/PreviewModal';

const UserProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [resumeData, setResumeData] = useState(null);
    const [interviewHistory, setInterviewHistory] = useState([]);
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

                // Fetch resume data
                const resumeResponse = await fetch(`${import.meta.env.VITE_API_URL}/resume/fetch`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (resumeResponse.ok) {
                    const resumeData = await resumeResponse.json();
                    setResumeData(resumeData);
                }

                // Fetch interview history (assuming you have this endpoint)
                const historyResponse = await fetch(`${import.meta.env.VITE_API_URL}/interview/history`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (historyResponse.ok) {
                    const data = await historyResponse.json();
                    setInterviewHistory(data);
                }

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleEditResume = () => {
        navigate('/resume-builder');
    };

    const handleDownloadResume = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/resume/download`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'resume.pdf';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        } catch (error) {
            console.error('Error downloading resume:', error);
        }
    };

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
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setIsPreviewOpen(true)}
                                    className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center"
                                >
                                    <FaHistory className="mr-2" />
                                    Preview Resume
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleEditResume}
                                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center justify-center"
                                >
                                    <FaEdit className="mr-2" />
                                    Edit Resume
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleDownloadResume}
                                    className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center justify-center"
                                >
                                    <FaDownload className="mr-2" />
                                    Download Resume
                                </motion.button>
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
                            {interviewHistory.length > 0 ? (
                                <div className="space-y-4">
                                    {interviewHistory.map((interview, index) => (
                                        <div
                                            key={index}
                                            className="border-l-4 border-blue-500 pl-4 py-2"
                                        >
                                            <p className="font-semibold">{interview.topic}</p>
                                            <p className="text-sm text-gray-600">{interview.date}</p>
                                            <p className="text-sm">Score: {interview.score}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-600 text-center">No interview history available</p>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                formData={resumeData}
            />
            
            <Footer />
        </>
    );
};

export default UserProfile; 