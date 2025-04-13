import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '../Header';
import Footer from '../Footer';
import { FaPhone, FaEnvelope, FaGithub, FaLinkedin, FaPlus, FaTrash, FaMagic, FaDownload, FaEye, FaCheck } from 'react-icons/fa';
import PreviewModal from './PreviewModal';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResumeBuilder = () => {
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState('');
    
    const [sections, setSections] = useState([
        { id: 'personal', title: 'Personal Information', isVisible: true },
        { id: 'technicalSkills', title: 'Technical Skills', isVisible: true },
        { id: 'training', title: 'Experience', isVisible: true },
        { id: 'projects', title: 'Projects', isVisible: true },
        { id: 'education', title: 'Education', isVisible: true },
        { id: 'certifications', title: 'Certifications', isVisible: false }
    ]);

    const [formData, setFormData] = useState({
        personal: {
            fullName: '',
            location: '',
            phone: '',
            email: '',
            github: '',
            linkedin: ''
        },
        technicalSkills: {
            languages: '',
            technologies: '',
            skills: ''
        },
        training: [],
        projects: [],
        certifications: [],
        education: []
    });

    const handleTemplateChange = (template) => {
        setSelectedTemplate(template);
        toast.success(`Template changed to ${template} style`);
    };

    const toggleSection = (id) => {
        setSections(prev => prev.map(section =>
            section.id === id ? { ...section, isVisible: !section.isVisible } : section
        ));
    };

    const addNewSection = () => {
        const hiddenSections = sections.filter(section => !section.isVisible);
        if (hiddenSections.length > 0) {
            const sectionToAdd = hiddenSections[0];
            setSections(prev => prev.map(section => 
                section.id === sectionToAdd.id 
                    ? { ...section, isVisible: true }
                    : section
            ));
            toast.success(`${sectionToAdd.title} section added`);
        } else {
            toast.info('All sections are already visible');
        }
    };

    const handleInputChange = (section, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleArrayFieldChange = (section, index, field, value) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map((item, i) => 
                i === index ? { ...item, [field]: value } : item
            )
        }));
    };

    const addArrayItem = (section, template = {}) => {
        setFormData(prev => ({
            ...prev,
            [section]: [...prev[section], { id: Date.now(), ...template }]
        }));
    };

    const removeArrayItem = (section, index) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((_, i) => i !== index)
        }));
    };

    const handleSaveResume = async () => {
        setSaveLoading(true);
        setSaveError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to save resume');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/resume/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    template: selectedTemplate
                })
            });

            if (response.ok) {
                toast.success('Resume saved successfully!');
                setShowSaveModal(false);
            } else {
                throw new Error('Failed to save resume');
            }
        } catch (error) {
            console.error('Error saving resume:', error);
            setSaveError('Failed to save resume. Please try again.');
            toast.error('Failed to save resume');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDownloadResume = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Please login to download resume');
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/resume/download`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    formData,
                    template: selectedTemplate 
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to download resume');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'resume.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            toast.success('Resume downloaded successfully!');
        } catch (error) {
            console.error('Error downloading resume:', error);
            toast.error(error.message || 'Failed to download resume');
        }
    };
    
    const SaveModal = () => (
        <AnimatePresence>
            {showSaveModal && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                >
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.95 }}
                        className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
                    >
                        <h3 className="text-xl font-bold mb-4">Save Resume</h3>
                        <p className="mb-6">Are you sure you want to save your resume? This will update your existing resume data.</p>
                        
                        {saveError && (
                            <div className="mb-4 text-red-500">{saveError}</div>
                        )}
                        
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setShowSaveModal(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                disabled={saveLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveResume}
                                disabled={saveLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                                {saveLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                {/* Template Selection */}
                <div className="max-w-4xl mx-auto mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Choose Your Template</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTemplateChange('modern')}
                                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                                    selectedTemplate === 'modern' 
                                        ? 'border-blue-500 ring-2 ring-blue-200' 
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                    <div className="p-4">
                                        <h4 className="text-lg font-semibold mb-2">Modern Template</h4>
                                        <p className="text-sm text-gray-600">Clean and contemporary design</p>
                                    </div>
                                </div>
                                {selectedTemplate === 'modern' && (
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full">
                                        <FaCheck className="w-4 h-4" />
                                    </div>
                                )}
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => handleTemplateChange('classic')}
                                className={`relative cursor-pointer rounded-lg overflow-hidden border-2 ${
                                    selectedTemplate === 'classic' 
                                        ? 'border-blue-500 ring-2 ring-blue-200' 
                                        : 'border-gray-200 hover:border-blue-300'
                                }`}
                            >
                                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                                    <div className="p-4">
                                        <h4 className="text-lg font-semibold mb-2">Classic Template</h4>
                                        <p className="text-sm text-gray-600">Traditional and professional layout</p>
                                    </div>
                                </div>
                                {selectedTemplate === 'classic' && (
                                    <div className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full">
                                        <FaCheck className="w-4 h-4" />
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Section Management */}
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Manage Sections</h3>
                        <div className="flex flex-wrap gap-3">
                            {sections.map(section => (
                                <motion.button
                                    key={section.id}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => toggleSection(section.id)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                        section.isVisible
                                            ? 'bg-blue-500 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    {section.title}
                                </motion.button>
                            ))}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={addNewSection}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-green-500 text-white hover:bg-green-600 transition-all duration-200 shadow-md"
                            >
                                + Add Section
                            </motion.button>
                        </div>
                    </div>

                    {/* Personal Information Section */}
                    {sections.find(s => s.id === 'personal')?.isVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8"
                        >
                            <h3 className="text-2xl font-bold mb-6 text-gray-800">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={formData.personal.fullName}
                                        onChange={(e) => handleInputChange('personal', 'fullName', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        placeholder="City, Country"
                                        value={formData.personal.location}
                                        onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                                    <input
                                        type="tel"
                                        placeholder="+1 234 567 890"
                                        value={formData.personal.phone}
                                        onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.personal.email}
                                        onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">GitHub URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://github.com/username"
                                        value={formData.personal.github}
                                        onChange={(e) => handleInputChange('personal', 'github', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/username"
                                        value={formData.personal.linkedin}
                                        onChange={(e) => handleInputChange('personal', 'linkedin', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Technical Skills Section */}
                    {sections.find(s => s.id === 'technicalSkills')?.isVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8"
                        >
                            <h3 className="text-2xl font-bold mb-6 text-gray-800">Technical Skills</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Programming Languages
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., JavaScript, Python, Java"
                                        value={formData.technicalSkills.languages}
                                        onChange={(e) => handleInputChange('technicalSkills', 'languages', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Technologies & Frameworks
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., React, Node.js, Docker"
                                        value={formData.technicalSkills.technologies}
                                        onChange={(e) => handleInputChange('technicalSkills', 'technologies', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Additional Skills
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Agile, Git, CI/CD"
                                        value={formData.technicalSkills.skills}
                                        onChange={(e) => handleInputChange('technicalSkills', 'skills', e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Experience Section */}
                    {sections.find(s => s.id === 'training')?.isVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Experience</h3>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addArrayItem('training', {
                                        company: '',
                                        position: '',
                                        duration: '',
                                        points: ['']
                                    })}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md flex items-center"
                                >
                                    <FaPlus className="mr-2" />
                                    Add Experience
                                </motion.button>
                            </div>
                            {formData.training.map((exp, index) => (
                                <motion.div
                                    key={exp.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Company Name</label>
                                            <input
                                                type="text"
                                                placeholder="Company Name"
                                                value={exp.company}
                                                onChange={(e) => handleArrayFieldChange('training', index, 'company', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Position</label>
                                            <input
                                                type="text"
                                                placeholder="Position"
                                                value={exp.position}
                                                onChange={(e) => handleArrayFieldChange('training', index, 'position', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Duration</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., 2020 - 2022"
                                                value={exp.duration}
                                                onChange={(e) => handleArrayFieldChange('training', index, 'duration', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">Responsibilities & Achievements</label>
                                        {exp.points.map((point, pointIndex) => (
                                            <div key={pointIndex} className="flex gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Add achievement/responsibility"
                                                    value={point}
                                                    onChange={(e) => {
                                                        const newPoints = [...exp.points];
                                                        newPoints[pointIndex] = e.target.value;
                                                        handleArrayFieldChange('training', index, 'points', newPoints);
                                                    }}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                />
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => {
                                                        const newPoints = exp.points.filter((_, i) => i !== pointIndex);
                                                        handleArrayFieldChange('training', index, 'points', newPoints);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash />
                                                </motion.button>
                                            </div>
                                        ))}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                const newPoints = [...exp.points, ''];
                                                handleArrayFieldChange('training', index, 'points', newPoints);
                                            }}
                                            className="text-blue-500 hover:text-blue-700 font-medium flex items-center"
                                        >
                                            <FaPlus className="mr-2" />
                                            Add Point
                                        </motion.button>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => removeArrayItem('training', index)}
                                        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                    >
                                        Remove Experience
                                    </motion.button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Projects Section */}
                    {sections.find(s => s.id === 'projects')?.isVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Projects</h3>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addArrayItem('projects', {
                                        title: '',
                                        technologies: '',
                                        duration: '',
                                        points: [''],
                                        githubLink: ''
                                    })}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md flex items-center"
                                >
                                    <FaPlus className="mr-2" />
                                    Add Project
                                </motion.button>
                            </div>
                            {formData.projects.map((project, index) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Project Title</label>
                                            <input
                                                type="text"
                                                placeholder="Project Title"
                                                value={project.title}
                                                onChange={(e) => handleArrayFieldChange('projects', index, 'title', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Technologies Used</label>
                                            <input
                                                type="text"
                                                placeholder="Technologies Used"
                                                value={project.technologies}
                                                onChange={(e) => handleArrayFieldChange('projects', index, 'technologies', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Duration</label>
                                            <input
                                                type="text"
                                                placeholder="Duration"
                                                value={project.duration}
                                                onChange={(e) => handleArrayFieldChange('projects', index, 'duration', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">GitHub Link</label>
                                            <input
                                                type="url"
                                                placeholder="GitHub Link"
                                                value={project.githubLink}
                                                onChange={(e) => handleArrayFieldChange('projects', index, 'githubLink', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                
                                    <div className="space-y-4">
                                        <label className="block text-sm font-medium text-gray-700">Project Details</label>
                                        {project.points.map((point, pointIndex) => (
                                            <div key={pointIndex} className="flex gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Add project detail"
                                                    value={point}
                                                    onChange={(e) => {
                                                        const newPoints = [...project.points];
                                                        newPoints[pointIndex] = e.target.value;
                                                        handleArrayFieldChange('projects', index, 'points', newPoints);
                                                    }}
                                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                />
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => {
                                                        const newPoints = project.points.filter((_, i) => i !== pointIndex);
                                                        handleArrayFieldChange('projects', index, 'points', newPoints);
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <FaTrash />
                                                </motion.button>
                                            </div>
                                        ))}
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                const newPoints = [...project.points, ''];
                                                handleArrayFieldChange('projects', index, 'points', newPoints);
                                            }}
                                            className="text-blue-500 hover:text-blue-700 font-medium flex items-center"
                                        >
                                            <FaPlus className="mr-2" />
                                            Add Point
                                        </motion.button>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => removeArrayItem('projects', index)}
                                        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                    >
                                        Remove Project
                                    </motion.button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Education Section */}
                    {sections.find(s => s.id === 'education')?.isVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Education</h3>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addArrayItem('education', {
                                        institution: '',
                                        degree: '',
                                        duration: '',
                                        location: '',
                                        details: ''
                                    })}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md flex items-center"
                                >
                                    <FaPlus className="mr-2" />
                                    Add Education
                                </motion.button>
                            </div>
                            {formData.education.map((edu, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Institution Name</label>
                                            <input
                                                type="text"
                                                placeholder="Institution Name"
                                                value={edu.institution}
                                                onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Degree</label>
                                            <input
                                                type="text"
                                                placeholder="Degree"
                                                value={edu.degree}
                                                onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Duration</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., 2021 - 2025"
                                                value={edu.duration}
                                                onChange={(e) => handleArrayFieldChange('education', index, 'duration', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Location</label>
                                            <input
                                                type="text"
                                                placeholder="Location"
                                                value={edu.location}
                                                onChange={(e) => handleArrayFieldChange('education', index, 'location', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Additional Details</label>
                                            <input
                                                type="text"
                                                placeholder="Additional Details"
                                                value={edu.details}
                                                onChange={(e) => handleArrayFieldChange('education', index, 'details', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => removeArrayItem('education', index)}
                                        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                    >
                                        Remove Education
                                    </motion.button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Certifications Section */}
                    {sections.find(s => s.id === 'certifications')?.isVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 mb-8"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-800">Certifications</h3>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => addArrayItem('certifications', {
                                        title: '',
                                        platform: '',
                                        date: '',
                                        certificateLink: ''
                                    })}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md flex items-center"
                                >
                                    <FaPlus className="mr-2" />
                                    Add Certification
                                </motion.button>
                            </div>
                            {formData.certifications.map((cert, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 p-6 border border-gray-200 rounded-xl bg-gray-50"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Certification Title</label>
                                            <input
                                                type="text"
                                                placeholder="Certification Title"
                                                value={cert.title}
                                                onChange={(e) => handleArrayFieldChange('certifications', index, 'title', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Platform/Institution</label>
                                            <input
                                                type="text"
                                                placeholder="Platform/Institution"
                                                value={cert.platform}
                                                onChange={(e) => handleArrayFieldChange('certifications', index, 'platform', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Date</label>
                                            <input
                                                type="text"
                                                placeholder="Date"
                                                value={cert.date}
                                                onChange={(e) => handleArrayFieldChange('certifications', index, 'date', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-gray-700">Certificate Link</label>
                                            <input
                                                type="url"
                                                placeholder="Certificate Link"
                                                value={cert.certificateLink}
                                                onChange={(e) => handleArrayFieldChange('certifications', index, 'certificateLink', e.target.value)}
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                            />
                                        </div>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => removeArrayItem('certifications', index)}
                                        className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                    >
                                        Remove Certification
                                    </motion.button>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                    {/* Action Buttons */}
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="sticky bottom-0 bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex justify-end space-x-4"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowSaveModal(true)}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200 shadow-md flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        Save Resume
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsPreviewOpen(true)}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md flex items-center"
                    >
                        <FaEye className="mr-2" />
                        Preview
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleDownloadResume}
                        className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-200 shadow-md flex items-center"
                    >
                        <FaDownload className="mr-2" />
                        Download PDF
                    </motion.button>
                </motion.div>
                </div>
            </div>
            <Footer />
            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                formData={formData}
                template={selectedTemplate}
            />
            <ToastContainer />
            <SaveModal />
        </>
    );
};

export default ResumeBuilder;