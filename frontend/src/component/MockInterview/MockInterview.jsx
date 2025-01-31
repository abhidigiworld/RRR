import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaVideo, FaCog, FaRegClock, FaRobot, FaFileUpload, FaFilePdf, FaFileWord, FaTimes } from 'react-icons/fa';
import Header from '../Header';
import Footer from '../Footer';

const DetectedSkill = {
    STRONG: 'strong',
    MODERATE: 'moderate',
    BASIC: 'basic'
};

const MockInterview = () => {
    const [difficulty, setDifficulty] = useState('medium');
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadError, setUploadError] = useState('');
    const [detectedTopics, setDetectedTopics] = useState([]);
    const [parsedResumeData, setParsedResumeData] = useState({
        skills: [],
        experience: [],
        projects: [],
        detectedTopics: []
    });

    const topics = [
        'Data Structures & Algorithms',
        'React.js',
        'Node.js',
        'System Design',
        'JavaScript',
        'Python',
        'Java',
        'Full Stack Development',
        'Database Management'
    ];

    const analyzeResume = async (file) => {
        // This will be replaced with actual API call later
        // Simulating resume parsing for now
        const mockParsedData = {
            skills: [
                { name: 'React.js', level: DetectedSkill.STRONG, subtopics: ['Hooks', 'Redux', 'Context API'] },
                { name: 'Node.js', level: DetectedSkill.STRONG, subtopics: ['Express', 'REST APIs', 'MongoDB'] },
                { name: 'JavaScript', level: DetectedSkill.MODERATE, subtopics: ['ES6+', 'Async/Await', 'DOM'] },
                { name: 'System Design', level: DetectedSkill.BASIC, subtopics: ['APIs', 'Database Design'] }
            ],
            experience: [
                'Web Development',
                'Full Stack Development',
                'Database Management'
            ],
            projects: [
                'E-commerce Platform',
                'Social Media App',
                'Testing Platform'
            ]
        };

        setParsedResumeData(mockParsedData);
        setDetectedTopics(mockParsedData.skills.map(skill => skill.name));
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const fileType = file?.type;
        
        setUploadError('');

        if (fileType !== 'application/pdf' && 
            fileType !== 'application/msword' && 
            fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            setUploadError('Please upload a PDF or DOC/DOCX file');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size should be less than 5MB');
            return;
        }

        setResumeFile(file);
        analyzeResume(file);
    };

    const removeFile = () => {
        setResumeFile(null);
        setUploadError('');
    };

    const startInterview = () => {
        if (!resumeFile) {
            alert('Please upload your resume');
            return;
        }
        setIsInterviewStarted(true);
    };

    const SkillLevelIndicator = ({ level }) => {
        const colors = {
            [DetectedSkill.STRONG]: 'bg-green-500',
            [DetectedSkill.MODERATE]: 'bg-yellow-500',
            [DetectedSkill.BASIC]: 'bg-blue-500'
        };

        return (
            <span className={`px-2 py-0.5 text-xs text-white rounded-full ${colors[level]}`}>
                {level}
            </span>
        );
    };

    const detectedTopicsSection = (
        <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Interview Topics Based on Your Resume
            </h3>
            
            {/* Primary Skills */}
            <div className="space-y-4">
                {parsedResumeData.skills.map((skill, index) => (
                    <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-800">{skill.name}</h4>
                            <SkillLevelIndicator level={skill.level} />
                        </div>
                        {skill.subtopics && (
                            <div className="ml-4">
                                <p className="text-sm text-gray-600 mb-1">Expected questions on:</p>
                                <div className="flex flex-wrap gap-2">
                                    {skill.subtopics.map((subtopic, idx) => (
                                        <span
                                            key={idx}
                                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-sm"
                                        >
                                            {subtopic}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Project Experience */}
            {parsedResumeData.projects.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-medium text-gray-800 mb-2">Project Discussion Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                        {parsedResumeData.projects.map((project, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                            >
                                {project}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">Note:</span> The interview will focus on these topics, 
                    with emphasis on your stronger areas. Questions will be tailored to your {difficulty} difficulty preference.
                </p>
            </div>
        </div>
    );

    const resumeUploadSection = (
        <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                {!resumeFile ? (
                    <div className="text-center">
                        <input
                            type="file"
                            id="resume-upload"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileUpload}
                            className="hidden"
                        />
                        <label
                            htmlFor="resume-upload"
                            className="cursor-pointer flex flex-col items-center"
                        >
                            <FaFileUpload className="text-4xl text-gray-400 mb-2" />
                            <p className="text-gray-600 mb-1">
                                Drag & drop your resume or click to upload
                            </p>
                            <p className="text-sm text-gray-500">
                                Supports PDF, DOC, DOCX (Max 5MB)
                            </p>
                        </label>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                                {resumeFile.type === 'application/pdf' ? (
                                    <FaFilePdf className="text-red-500 text-xl" />
                                ) : (
                                    <FaFileWord className="text-blue-500 text-xl" />
                                )}
                                <div>
                                    <p className="font-medium">{resumeFile.name}</p>
                                    <p className="text-sm text-gray-500">
                                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={removeFile}
                                className="text-gray-500 hover:text-red-500"
                            >
                                <FaTimes />
                            </button>
                        </div>
                        {detectedTopicsSection}
                    </>
                )}
                {uploadError && (
                    <p className="text-red-500 text-sm mt-2">{uploadError}</p>
                )}
            </div>
            {resumeFile && (
                <p className="text-sm text-green-600 mt-2">
                    ✓ Resume uploaded successfully. Your interview will be personalized based on your experience.
                </p>
            )}
        </div>
    );

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {!isInterviewStarted ? (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-lg shadow-xl p-8"
                        >
                            <h1 className="text-3xl font-bold text-center mb-8">
                                AI Mock Interview
                            </h1>

                            {resumeUploadSection}

                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Select Difficulty</h2>
                                <div className="flex space-x-4">
                                    {['easy', 'medium', 'hard'].map((level) => (
                                        <motion.button
                                            key={level}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setDifficulty(level)}
                                            className={`px-6 py-3 rounded-lg capitalize ${
                                                difficulty === level
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            {level}
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Setup</h2>
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => setIsCameraOn(!isCameraOn)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded ${
                                            isCameraOn ? 'bg-green-500 text-white' : 'bg-gray-200'
                                        }`}
                                    >
                                        <FaVideo />
                                        <span>{isCameraOn ? 'Camera On' : 'Camera Off'}</span>
                                    </button>
                                    <button
                                        onClick={() => setIsMicOn(!isMicOn)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded ${
                                            isMicOn ? 'bg-green-500 text-white' : 'bg-gray-200'
                                        }`}
                                    >
                                        <FaMicrophone />
                                        <span>{isMicOn ? 'Mic On' : 'Mic Off'}</span>
                                    </button>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={startInterview}
                                className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-900 ${
                                    !resumeFile ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={!resumeFile}
                            >
                                Start Interview
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-white rounded-lg shadow-xl"
                        >
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <div className="flex items-center space-x-4">
                                    <FaRobot className="text-2xl text-blue-600" />
                                    <div>
                                        <h2 className="font-semibold">AI Interviewer</h2>
                                        <p className="text-sm text-gray-600">{topics[Math.floor(Math.random() * topics.length)]} - {difficulty}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <FaRegClock className="text-gray-600" />
                                    <span>00:00</span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-8 mb-8">
                                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                                        <FaRobot className="text-6xl text-white" />
                                    </div>
                                    <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
                                        {isCameraOn ? (
                                            <video className="w-full h-full rounded-lg" autoPlay muted />
                                        ) : (
                                            <FaVideo className="text-6xl text-gray-600" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-center space-x-4">
                                    <button className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600">
                                        <FaMicrophone />
                                    </button>
                                    <button className="p-4 rounded-full bg-gray-500 text-white hover:bg-gray-600">
                                        <FaVideo />
                                    </button>
                                    <button className="p-4 rounded-full bg-gray-500 text-white hover:bg-gray-600">
                                        <FaCog />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MockInterview; 