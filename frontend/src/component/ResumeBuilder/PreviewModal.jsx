import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaGithub, FaLinkedin, FaPhone, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const PreviewModal = ({ isOpen, onClose, formData, setFormData }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found. Please login first.');
                }

                const response = await axios.get('/api/resume/user-data', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data) {
                    setFormData(prevData => ({
                        ...prevData,
                        ...response.data
                    }));
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch user data');
                console.error('Error fetching user data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchUserData();
        }
    }, [isOpen, setFormData]);

    if (!isOpen) return null;

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg">
                    Loading...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg">
                    <p className="text-red-500">{error}</p>
                    <button
                        onClick={onClose}
                        className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                >
                    {/* Resume Content */}
                    <div className="p-8 font-[system-ui] max-w-4xl mx-auto">
                        {/* Personal Information */}
                        <div className="text-center mb-6">
                            <h1 className="text-2xl font-bold mb-1">{formData.personal.fullName}</h1>
                            <p className="text-sm mb-2">{formData.personal.location}</p>
                            <div className="flex justify-center items-center space-x-4 text-sm">
                                <div className="flex items-center">
                                    <FaPhone className="mr-1 w-3 h-3" />
                                    {formData.personal.phone}
                                </div>
                                <div className="flex items-center">
                                    <FaEnvelope className="mr-1 w-3 h-3" />
                                    <a href={`mailto:${formData.personal.email}`} className="underline">
                                        {formData.personal.email}
                                    </a>
                                </div>
                                {formData.personal.github && (
                                    <div className="flex items-center">
                                        <FaGithub className="mr-1 w-3 h-3" />
                                        <a href={formData.personal.github} target="_blank" rel="noopener noreferrer" className="underline">
                                            {formData.personal.github}
                                        </a>
                                    </div>
                                )}
                                {formData.personal.linkedin && (
                                    <div className="flex items-center">
                                        <FaLinkedin className="mr-1 w-3 h-3" />
                                        <a href={formData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="underline">
                                            {formData.personal.linkedin}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Training Section */}
                        <div className="mb-4">
                            <h2 className="text-lg font-bold border-b border-gray-800 pb-1 mb-3">Training</h2>
                            {formData.training.map((item, index) => (
                                <div key={index} className="mb-3">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <p className="font-bold">{item.position}</p>
                                            <p className="italic text-sm">{item.company}</p>
                                        </div>
                                        <p className="text-sm">{item.duration}</p>
                                    </div>
                                    <ul className="list-disc ml-5 mt-1">
                                        {item.points.map((point, idx) => (
                                            <li key={idx} className="text-sm leading-tight mb-1">{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        {/* Projects Section */}
                        <div className="mb-4">
                            <h2 className="text-lg font-bold border-b border-gray-800 pb-1 mb-3">Projects</h2>
                            {formData.projects.map((project, index) => (
                                <div key={index} className="mb-3">
                                    <div className="flex justify-between items-baseline">
                                        <p className="font-bold">
                                            {project.title} | <span className="italic font-normal">{project.technologies}</span>
                                        </p>
                                        <p className="text-sm">{project.duration}</p>
                                    </div>
                                    <ul className="list-disc ml-5 mt-1">
                                        {project.points.map((point, idx) => (
                                            <li key={idx} className="text-sm leading-tight mb-1">{point}</li>
                                        ))}
                                    </ul>
                                    {project.githubLink && (
                                        <p className="text-sm ml-5">
                                            Github Repository Link: <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="underline">{project.githubLink}</a>
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Technical Skills Section */}
                        <div className="mb-4">
                            <h2 className="text-lg font-bold border-b border-gray-800 pb-1 mb-3">Technical Skills</h2>
                            <div className="space-y-1 text-sm">
                                <p>
                                    <span className="font-bold">Languages:</span> {formData.technicalSkills.languages}
                                </p>
                                <p>
                                    <span className="font-bold">Technologies/Frameworks:</span> {formData.technicalSkills.technologies}
                                </p>
                                <p>
                                    <span className="font-bold">Skills:</span> {formData.technicalSkills.skills}
                                </p>
                            </div>
                        </div>

                        {/* Education Section */}
                        <div className="mb-4">
                            <h2 className="text-lg font-bold border-b border-gray-800 pb-1 mb-3">Education</h2>
                            {formData.education.map((edu, index) => (
                                <div key={index} className="mb-2">
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <p className="font-bold">{edu.institution}</p>
                                            <p className="text-sm italic">{edu.degree}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm">{edu.duration}</p>
                                            <p className="text-sm">{edu.location}</p>
                                        </div>
                                    </div>
                                    <p className="text-sm italic">{edu.details}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Close button */}
                    <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PreviewModal; 