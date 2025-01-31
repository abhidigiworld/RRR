import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';
import { FaPhone, FaEnvelope, FaGithub, FaLinkedin, FaPlus, FaTrash, FaMagic } from 'react-icons/fa';
import PreviewModal from './PreviewModal';
import { useNavigate } from 'react-router-dom';

const SectionTitle = ({ children }) => (
    <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-1 mb-4">
        {children}
    </h2>
);

const BulletPoint = ({ value, onChange, onRemove, placeholder }) => (
    <div className="flex items-start group">
        <span className="mr-2 mt-1.5 text-lg">•</span>
        <div className="flex-1">
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full py-1 focus:outline-none border-b border-transparent focus:border-gray-400 text-gray-700"
            />
        </div>
        {onRemove && (
            <button
                onClick={onRemove}
                className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity mt-1.5 ml-2"
            >
                <FaTrash className="w-3.5 h-3.5" />
            </button>
        )}
    </div>
);

const ResumeSection = ({ title, children }) => (
    <div className="p-8 border-b">
        <div className="mb-4">
            <h2 className="text-xl font-bold border-b-2 border-gray-800 pb-1">{title}</h2>
        </div>
        {children}
    </div>
);

const SectionContent = ({ children, onAdd, showAddButton = true }) => (
    <div>
        {children}
        {showAddButton && (
            <button
                onClick={onAdd}
                className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
            >
                <FaPlus className="w-3 h-3 mr-2" />
                Add More
            </button>
        )}
    </div>
);

const ResumeBuilder = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        personal: {
            fullName: '',
            location: '',
            phone: '',
            email: '',
            github: '',
            linkedin: ''
        },
        training: [
            {
                id: 1,
                company: '',
                position: '',
                duration: '',
                points: ['']
            }
        ],
        projects: [
            {
                id: 1,
                title: '',
                technologies: '',
                duration: '',
                points: [''],
                githubLink: ''
            }
        ],
        certifications: [
            {
                id: 1,
                title: '',
                platform: '',
                date: '',
                certificateLink: ''
            }
        ],
        technicalSkills: {
            languages: '',
            technologies: '',
            skills: ''
        },
        education: [
            {
                id: 1,
                institution: '',
                degree: '',
                duration: '',
                location: '',
                details: ''
            }
        ]
    });

    const [sections, setSections] = useState([
        { id: 'training', title: 'Training', isVisible: true },
        { id: 'projects', title: 'Projects', isVisible: true },
        { id: 'certifications', title: 'Certifications', isVisible: true },
        { id: 'technicalSkills', title: 'Technical Skills', isVisible: true },
        { id: 'education', title: 'Education', isVisible: true }
    ]);

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/resume/user-data`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

                const data = await response.json();
                
                // Update form data with user information
                setFormData(prevData => ({
                    ...prevData,
                    personal: {
                        ...prevData.personal,
                        fullName: data.fullName || '',
                        email: data.email || '',
                        // Add other fields as needed
                    }
                }));

            } catch (err) {
                console.error('Error fetching user data:', err);
                setError('Failed to load user data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handlePersonalChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            personal: {
                ...prev.personal,
                [name]: value
            }
        }));
    };

    const addSection = (section) => {
        const newItem = {
            id: formData[section].length + 1,
            ...(section === 'training' ? {
                company: '',
                position: '',
                duration: '',
                points: ['']
            } : section === 'projects' ? {
                title: '',
                technologies: '',
                duration: '',
                points: [''],
                githubLink: ''
            } : section === 'certifications' ? {
                title: '',
                platform: '',
                date: '',
                certificateLink: ''
            } : {
                institution: '',
                degree: '',
                duration: '',
                location: '',
                details: ''
            })
        };

        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], newItem]
        }));
    };

    const addBulletPoint = (section, index) => {
        const newData = [...formData[section]];
        newData[index].points.push('');
        setFormData(prev => ({ ...prev, [section]: newData }));
    };

    const handlePointChange = (section, itemIndex, pointIndex, value) => {
        const newData = [...formData[section]];
        newData[itemIndex].points[pointIndex] = value;
        setFormData(prev => ({ ...prev, [section]: newData }));
    };

    const removeSection = (section, id) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== id)
        }));
    };

    const removeBulletPoint = (section, itemIndex, pointIndex) => {
        const newData = [...formData[section]];
        newData[itemIndex].points.splice(pointIndex, 1);
        setFormData(prev => ({ ...prev, [section]: newData }));
    };

    const toggleSection = (sectionId) => {
        setSections(prev => prev.map(section => 
            section.id === sectionId 
                ? { ...section, isVisible: !section.isVisible }
                : section
        ));
    };

    const addNewSection = () => {
        const hiddenSections = sections.filter(section => !section.isVisible);
        if (hiddenSections.length > 0) {
            toggleSection(hiddenSections[0].id);
        }
    };

    const removeItem = (section, itemId) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter(item => item.id !== itemId)
        }));
    };

    const handleAIInput = () => {
        console.log("AI Input functionality will be implemented");
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto mb-6">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAIInput}
                        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-lg shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 group"
                    >
                        <FaMagic className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span className="text-lg font-semibold">Generate Resume with AI</span>
                    </motion.button>
                    <p className="text-center text-sm text-gray-600 mt-2">
                        Let AI help you create a professional resume by analyzing your background
                    </p>
                </div>
                <div className="max-w-4xl mx-auto">
                    {/* Section Management */}
                    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                        <h3 className="text-lg font-semibold mb-2">Manage Sections</h3>
                        <div className="flex flex-wrap gap-2">
                            {sections
                                .filter(section => !['technicalSkills', 'education'].includes(section.id))
                                .map(section => (
                                    <button
                                        key={section.id}
                                        onClick={() => toggleSection(section.id)}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            section.isVisible
                                                ? 'bg-blue-100 text-blue-700'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}
                                    >
                                        {section.title}
                                    </button>
                                ))}
                            {/* Mandatory sections shown as disabled */}
                            {['technicalSkills', 'education'].map(id => (
                                <span
                                    key={id}
                                    className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-500 cursor-not-allowed flex items-center"
                                >
                                    {sections.find(s => s.id === id)?.title} 
                                    <span className="ml-1 text-xs">(Required)</span>
                                </span>
                            ))}
                            <button
                                onClick={addNewSection}
                                className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm"
                            >
                                + Add Section
                            </button>
                        </div>
                    </div>

                    {/* Resume Content */}
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                        {/* Personal Information Section */}
                        <div className="p-8 border-b">
                            <input
                                type="text"
                                name="fullName"
                                value={formData.personal.fullName}
                                onChange={handlePersonalChange}
                                placeholder="Full Name"
                                className="w-full text-3xl font-bold text-center mb-4 focus:outline-none"
                            />
                            <input
                                type="text"
                                name="location"
                                value={formData.personal.location}
                                onChange={handlePersonalChange}
                                placeholder="Pakur, Jharkhand 816106"
                                className="w-full text-center text-gray-600 mb-4 focus:outline-none"
                            />
                            <div className="flex justify-center items-center space-x-6 text-sm">
                                <div className="flex items-center space-x-2">
                                    <FaPhone className="text-gray-600" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.personal.phone}
                                        onChange={handlePersonalChange}
                                        placeholder="+91"
                                        className="focus:outline-none w-32"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FaEnvelope className="text-gray-600" />
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.personal.email}
                                        onChange={handlePersonalChange}
                                        placeholder="example@gmail.com"
                                        className="focus:outline-none w-40"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FaGithub className="text-gray-600" />
                                    <input
                                        type="text"
                                        name="github"
                                        value={formData.personal.github}
                                        onChange={handlePersonalChange}
                                        placeholder="github.com/username"
                                        className="focus:outline-none w-40"
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <FaLinkedin className="text-gray-600" />
                                    <input
                                        type="text"
                                        name="linkedin"
                                        value={formData.personal.linkedin}
                                        onChange={handlePersonalChange}
                                        placeholder="linkedin.com/in/username"
                                        className="focus:outline-none w-40"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Sections */}
                        {sections.map(section => section.isVisible && (
                            <ResumeSection
                                key={section.id}
                                title={section.title}
                            >
                                <SectionContent 
                                    onAdd={() => addSection(section.id)}
                                    showAddButton={!['technicalSkills'].includes(section.id)}
                                >
                                    {section.id === 'training' && (
                                        formData.training.map((item, index) => (
                                            <div key={item.id} className="mb-6 relative group">
                                                {formData.training.length > 1 && (
                                                    <button
                                                        onClick={() => removeItem('training', item.id)}
                                                        className="absolute -right-2 -top-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            value={item.company}
                                                            onChange={(e) => {
                                                                const newTraining = [...formData.training];
                                                                newTraining[index].company = e.target.value;
                                                                setFormData(prev => ({ ...prev, training: newTraining }));
                                                            }}
                                                            placeholder="Company Name"
                                                            className="font-semibold text-lg focus:outline-none w-full"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={item.position}
                                                            onChange={(e) => {
                                                                const newTraining = [...formData.training];
                                                                newTraining[index].position = e.target.value;
                                                                setFormData(prev => ({ ...prev, training: newTraining }));
                                                            }}
                                                            placeholder="Position"
                                                            className="text-gray-600 focus:outline-none w-full"
                                                        />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        value={item.duration}
                                                        onChange={(e) => {
                                                            const newTraining = [...formData.training];
                                                            newTraining[index].duration = e.target.value;
                                                            setFormData(prev => ({ ...prev, training: newTraining }));
                                                        }}
                                                        placeholder="June 2023 - July 2023"
                                                        className="text-right text-gray-600 focus:outline-none w-48"
                                                    />
                                                </div>
                                                <div className="pl-6 space-y-2">
                                                    {item.points.map((point, pointIndex) => (
                                                        <BulletPoint
                                                            key={pointIndex}
                                                            value={point}
                                                            onChange={(e) => {
                                                                const newTraining = [...formData.training];
                                                                newTraining[index].points[pointIndex] = e.target.value;
                                                                setFormData(prev => ({ ...prev, training: newTraining }));
                                                            }}
                                                            onRemove={item.points.length > 1 ? () => removeBulletPoint('training', index, pointIndex) : null}
                                                            placeholder="Add achievement or responsibility (e.g., Created a web application for movie recommendations)"
                                                        />
                                                    ))}
                                                    <button
                                                        onClick={() => addBulletPoint('training', index)}
                                                        className="text-blue-600 text-sm hover:text-blue-800 ml-4 flex items-center"
                                                    >
                                                        <FaPlus className="w-3 h-3 mr-1" />
                                                        Add Point
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {section.id === 'projects' && (
                                        formData.projects.map((project, index) => (
                                            <div key={project.id} className="mb-6 relative group">
                                                {formData.projects.length > 1 && (
                                                    <button
                                                        onClick={() => removeItem('projects', project.id)}
                                                        className="absolute -right-2 -top-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <div className="grid grid-cols-2 gap-4 mb-2">
                                                    <input
                                                        type="text"
                                                        value={project.title}
                                                        onChange={(e) => {
                                                            const newProjects = [...formData.projects];
                                                            newProjects[index].title = e.target.value;
                                                            setFormData(prev => ({ ...prev, projects: newProjects }));
                                                        }}
                                                        placeholder="Project Title | Technologies Used"
                                                        className="font-semibold focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={project.githubLink}
                                                        onChange={(e) => {
                                                            const newProjects = [...formData.projects];
                                                            newProjects[index].githubLink = e.target.value;
                                                            setFormData(prev => ({ ...prev, projects: newProjects }));
                                                        }}
                                                        placeholder="GitHub Repository Link"
                                                        className="text-right focus:outline-none"
                                                    />
                                                </div>
                                                <div className="pl-6 space-y-2">
                                                    {project.points.map((point, pointIndex) => (
                                                        <BulletPoint
                                                            key={pointIndex}
                                                            value={point}
                                                            onChange={(e) => {
                                                                const newProjects = [...formData.projects];
                                                                newProjects[index].points[pointIndex] = e.target.value;
                                                                setFormData(prev => ({ ...prev, projects: newProjects }));
                                                            }}
                                                            onRemove={project.points.length > 1 ? () => removeBulletPoint('projects', index, pointIndex) : null}
                                                            placeholder="Add project detail (e.g., Implemented features for test creation and monitoring)"
                                                        />
                                                    ))}
                                                    <button
                                                        onClick={() => addBulletPoint('projects', index)}
                                                        className="text-blue-600 text-sm hover:text-blue-800 ml-4 flex items-center"
                                                    >
                                                        <FaPlus className="w-3 h-3 mr-1" />
                                                        Add Point
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {section.id === 'certifications' && (
                                        formData.certifications.map((cert, index) => (
                                            <div key={cert.id} className="mb-6 relative group">
                                                {formData.certifications.length > 1 && (
                                                    <button
                                                        onClick={() => removeItem('certifications', cert.id)}
                                                        className="absolute -right-2 -top-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <div className="grid grid-cols-2 gap-4 mb-2">
                                                    <input
                                                        type="text"
                                                        value={cert.title}
                                                        onChange={(e) => {
                                                            const newCertifications = [...formData.certifications];
                                                            newCertifications[index].title = e.target.value;
                                                            setFormData(prev => ({ ...prev, certifications: newCertifications }));
                                                        }}
                                                        placeholder="Certification Title"
                                                        className="font-semibold focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={cert.platform}
                                                        onChange={(e) => {
                                                            const newCertifications = [...formData.certifications];
                                                            newCertifications[index].platform = e.target.value;
                                                            setFormData(prev => ({ ...prev, certifications: newCertifications }));
                                                        }}
                                                        placeholder="Platform"
                                                        className="text-right focus:outline-none"
                                                    />
                                                </div>
                                                <div className="pl-4">
                                                    <input
                                                        type="text"
                                                        value={cert.date}
                                                        onChange={(e) => {
                                                            const newCertifications = [...formData.certifications];
                                                            newCertifications[index].date = e.target.value;
                                                            setFormData(prev => ({ ...prev, certifications: newCertifications }));
                                                        }}
                                                        placeholder="Date"
                                                        className="w-full focus:outline-none"
                                                    />
                                                </div>
                                                <div className="pl-4">
                                                    <input
                                                        type="text"
                                                        value={cert.certificateLink}
                                                        onChange={(e) => {
                                                            const newCertifications = [...formData.certifications];
                                                            newCertifications[index].certificateLink = e.target.value;
                                                            setFormData(prev => ({ ...prev, certifications: newCertifications }));
                                                        }}
                                                        placeholder="Certificate Link"
                                                        className="w-full focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    {section.id === 'technicalSkills' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    value={formData.technicalSkills.languages}
                                                    onChange={(e) => {
                                                        const newSkills = { ...formData.technicalSkills };
                                                        newSkills.languages = e.target.value;
                                                        setFormData(prev => ({ ...prev, technicalSkills: newSkills }));
                                                    }}
                                                    placeholder="Languages (e.g., C++, JavaScript, Java)"
                                                    className="font-semibold focus:outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.technicalSkills.technologies}
                                                    onChange={(e) => {
                                                        const newSkills = { ...formData.technicalSkills };
                                                        newSkills.technologies = e.target.value;
                                                        setFormData(prev => ({ ...prev, technicalSkills: newSkills }));
                                                    }}
                                                    placeholder="Technologies (e.g., React JS, Node JS, MongoDB)"
                                                    className="font-semibold focus:outline-none"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={formData.technicalSkills.skills}
                                                onChange={(e) => {
                                                    const newSkills = { ...formData.technicalSkills };
                                                    newSkills.skills = e.target.value;
                                                    setFormData(prev => ({ ...prev, technicalSkills: newSkills }));
                                                }}
                                                placeholder="Skills (e.g., Data Structures, Algorithms, Problem-Solving)"
                                                className="font-semibold focus:outline-none w-full"
                                            />
                                        </div>
                                    )}
                                    {section.id === 'education' && (
                                        formData.education.map((edu, index) => (
                                            <div key={edu.id} className="mb-6 relative group">
                                                {formData.education.length > 1 && (
                                                    <button
                                                        onClick={() => removeItem('education', edu.id)}
                                                        className="absolute -right-2 -top-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <FaTrash className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <div className="grid grid-cols-2 gap-4 mb-2">
                                                    <input
                                                        type="text"
                                                        value={edu.institution}
                                                        onChange={(e) => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].institution = e.target.value;
                                                            setFormData(prev => ({ ...prev, education: newEducation }));
                                                        }}
                                                        placeholder="Institution"
                                                        className="font-semibold focus:outline-none"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={edu.degree}
                                                        onChange={(e) => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].degree = e.target.value;
                                                            setFormData(prev => ({ ...prev, education: newEducation }));
                                                        }}
                                                        placeholder="Degree"
                                                        className="font-semibold focus:outline-none"
                                                    />
                                                </div>
                                                <div className="pl-4">
                                                    <input
                                                        type="text"
                                                        value={edu.duration}
                                                        onChange={(e) => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].duration = e.target.value;
                                                            setFormData(prev => ({ ...prev, education: newEducation }));
                                                        }}
                                                        placeholder="Duration (e.g., 2021 - 2025)"
                                                        className="w-full focus:outline-none"
                                                    />
                                                </div>
                                                <div className="pl-4">
                                                    <input
                                                        type="text"
                                                        value={edu.location}
                                                        onChange={(e) => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].location = e.target.value;
                                                            setFormData(prev => ({ ...prev, education: newEducation }));
                                                        }}
                                                        placeholder="Location"
                                                        className="w-full focus:outline-none"
                                                    />
                                                </div>
                                                <div className="pl-4">
                                                    <input
                                                        type="text"
                                                        value={edu.details}
                                                        onChange={(e) => {
                                                            const newEducation = [...formData.education];
                                                            newEducation[index].details = e.target.value;
                                                            setFormData(prev => ({ ...prev, education: newEducation }));
                                                        }}
                                                        placeholder="Details"
                                                        className="w-full focus:outline-none"
                                                    />
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </SectionContent>
                            </ResumeSection>
                        ))}

                        {/* Action Buttons */}
                        <div className="p-8 flex justify-end space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setIsPreviewOpen(true)}
                                className="px-6 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                            >
                                Preview
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Download PDF
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                formData={formData}
            />
        </>
    );
};

export default ResumeBuilder; 