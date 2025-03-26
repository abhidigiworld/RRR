import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaVideo, FaCog, FaRegClock, FaRobot, FaFileUpload, FaFilePdf, FaFileWord, FaTimes, FaMicrophoneSlash, FaVideoSlash } from "react-icons/fa";
import Header from "../Header";
import Footer from "../Footer";
import axios from 'axios';
import Mic from "../Mice/Mic";
import InterviewResult from "./InterviewResult";

const DetectedSkill = {
    STRONG: "strong",
    MODERATE: "moderate",
    BASIC: "basic",
};

const MockInterview = () => {
    const [difficulty, setDifficulty] = useState("medium");
    const [isInterviewStarted, setIsInterviewStarted] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [uploadError, setUploadError] = useState("");
    const [detectedTopics, setDetectedTopics] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [promt, setpromt] = useState([]);
    const [skillloading, setskillloading] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState("");
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [questions, setQuestions] = useState([]);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [audioRecordings, setAudioRecordings] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [interviewComplete, setInterviewComplete] = useState(false);
    const [interviewResults, setInterviewResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [transcripts, setTranscripts] = useState([]);
    const [recognition, setRecognition] = useState(null);
    const [currentTranscript, setCurrentTranscript] = useState('');

    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const streamRef = useRef(null);
    const audioChunksRef = useRef([]);
    const baseUrl = "http://localhost:3001/";

    const [parsedResumeData, setParsedResumeData] = useState({
        skills: [],
        experience: [],
        projects: [],
    });

    // Timer functionality
    useEffect(() => {
        let interval;
        if (isTimerRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => prev - 1);
            }, 1000);
        } else if (timeRemaining === 0) {
            stopRecording();
            if (currentQuestionIndex < questions.length - 1) {
                moveToNextQuestion();
            } else {
                finishInterview();
            }
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timeRemaining, currentQuestionIndex, questions]);

    useEffect(() => {
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'en-US';

            recognition.onresult = (event) => {
                let transcript = '';
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        transcript += event.results[i][0].transcript;
                    }
                }
                setCurrentTranscript(prev => prev + ' ' + transcript);
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                stopRecording();
            };

            setRecognition(recognition);
        } else {
            alert('Speech recognition is not supported in your browser. Please use Chrome.');
        }

        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            if (recognition) {
                setCurrentTranscript('');
                recognition.start();
                setIsRecording(true);
            }
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('Unable to start recording. Please check microphone permissions.');
        }
    };

    const stopRecording = () => {
        if (recognition && isRecording) {
            recognition.stop();
            setIsRecording(false);
            // Save the transcript for this question
            setTranscripts(prev => [...prev, currentTranscript.trim()]);
            setCurrentTranscript('');
        }
    };

    const moveToNextQuestion = () => {
        stopRecording();
        setCurrentQuestionIndex(prev => prev + 1);
        setCurrentQuestion(questions[currentQuestionIndex + 1]);
        setTimeRemaining(60);
        startRecording();
    };

    const finishInterview = async () => {
        // Stop recording and timer
        stopRecording();
        setIsTimerRunning(false);
        setIsAnalyzing(true);

        // Turn off camera
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
            setIsCameraOn(false);
        }

        // Turn off microphone
        setIsMicOn(false);

        try {
            console.log('Preparing to analyze interview...');
            console.log('Questions:', questions);
            console.log('Transcripts:', transcripts);

            // Ensure we have transcripts for all questions
            const allTranscripts = questions.map((_, index) => {
                return transcripts[index] || "No response provided";
            });

            console.log('Sending request to analyze interview...');
            const response = await axios.post(`${baseUrl}api/analyze-interview`, {
                transcripts: allTranscripts,
                questions
            });

            console.log('Received analysis response:', response.data);

            if (response.data) {
                setInterviewResults(response.data);
                setInterviewComplete(true);
            } else {
                throw new Error('No data received from server');
            }
        } catch (error) {
            console.error('Error analyzing interview:', error);
            alert('Failed to analyze interview responses: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Format time for display
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Camera functionality
    const toggleCamera = async () => {
        try {
            if (!isCameraOn) {
                console.log('Attempting to access camera...');
                const constraints = {
                    video: {
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    },
                    audio: false
                };
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                if (!videoRef.current) {
                    console.error('Video ref is not available');
                    return;
                }
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().catch(e => console.error('Error playing video:', e));
                };
                streamRef.current = stream;
                setIsCameraOn(true);
                console.log('Camera successfully enabled');
            } else {
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach(track => {
                        track.stop();
                        console.log('Camera track stopped');
                    });
                }
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
                setIsCameraOn(false);
                console.log('Camera successfully disabled');
            }
        } catch (error) {
            console.error('Camera error:', error.name, error.message);
            if (error.name === 'NotAllowedError') {
                alert('Camera access was denied. Please check your browser permissions and make sure camera access is allowed.');
            } else if (error.name === 'NotFoundError') {
                alert('No camera device was found. Please make sure your camera is properly connected.');
            } else if (error.name === 'NotReadableError') {
                alert('Your camera might be in use by another application. Please close other apps that might be using the camera.');
            } else {
                alert(`Unable to access camera: ${error.message}`);
            }
            setIsCameraOn(false);
        }
    };

    // Microphone functionality
    const toggleMicrophone = async () => {
        try {
            if (!isMicOn) {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorderRef.current = new MediaRecorder(stream);
                setIsMicOn(true);
            } else {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
                    mediaRecorderRef.current.stop();
                }
                setIsMicOn(false);
            }
        } catch (error) {
            console.error('Error accessing microphone:', error);
            alert('Unable to access microphone. Please check permissions.');
        }
    };

    // Generate interview questions based on resume
    const generateQuestions = async (skills, experience, projects) => {
        try {
            // Safely format the skills and experience data
            const skillsText = Array.isArray(skills) ? skills.join(', ') : '';
            const experienceText = Array.isArray(experience) ?
                experience.map(exp => exp.title || exp.position || exp.role || '').filter(Boolean).join(', ') : '';
            const projectsText = Array.isArray(projects) ?
                projects.map(proj => proj.title || proj.name || '').filter(Boolean).join(', ') : '';

            const prompt = `Generate 5 technical interview questions based on the following skills and experience:
                Skills: ${skillsText || 'General technical skills'}
                Experience: ${experienceText || 'General professional experience'}
                Projects: ${projectsText || 'General project experience'}`;

            console.log('Sending prompt to generate questions:', prompt);

            const response = await axios.post(`${baseUrl}api/generate`, { prompt });
            console.log('Response from question generation:', response.data);

            if (!response.data || !response.data.questions) {
                throw new Error('No questions received from the server');
            }

            const generatedQuestions = response.data.questions;

            // Ensure we only use 5 questions
            const limitedQuestions = generatedQuestions.slice(0, 5);
            setQuestions(limitedQuestions);
            if (limitedQuestions.length > 0) {
                setCurrentQuestion(limitedQuestions[0]);
                setCurrentQuestionIndex(0);
            } else {
                throw new Error('No valid questions were generated');
            }
        } catch (error) {
            console.error('Error generating questions:', error);
            alert('Failed to generate interview questions: ' + (error.response?.data?.message || error.message));
            throw error;
        }
    };

    const startInterview = async () => {
        if (!resumeFile) {
            alert("Please upload your resume first");
            return;
        }

        if (!parsedResumeData || !parsedResumeData.skills || parsedResumeData.skills.length === 0) {
            alert("Please wait for resume analysis to complete");
            return;
        }

        try {
            await generateQuestions(
                parsedResumeData.skills.map(skill => skill.name),
                parsedResumeData.experience || [],
                parsedResumeData.projects || []
            );
            setIsInterviewStarted(true);
            setIsTimerRunning(true);
            startRecording();
        } catch (err) {
            console.error('Error starting interview:', err);
            alert('Failed to start interview. Please try again.');
        }
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const fileType = file?.type;
        setskillloading(true)
        setUploadError("");
        if (!file) return;

        if (fileType !== "application/pdf" && fileType !== "application/msword" && fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            setUploadError("Please upload a PDF or DOC/DOCX file");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setUploadError("File size should be less than 5MB");
            return;
        }

        setResumeFile(file);
        setIsLoading(true);
        await analyzeResume(file);
        setIsLoading(false);
        setskillloading(false);
    };

    const uploadFileToCloud = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Ashton"); // Replace with your Cloudinary preset
        formData.append("resource_type", "raw");

        try {
            const response = await fetch("https://api.cloudinary.com/v1_1/dwvnq0gjr/raw/upload"
                , {
                    method: "POST",
                    body: formData,
                });

            const data = await response.json();
            console.log(data.secure_url);
            return data.secure_url; // Cloudinary returns a secure file URL
        } catch (err) {
            console.error("File Upload Error:", err);
            return null;
        }
    };

    const analyzeResume = async (file) => {
        if (!file) return;

        // Upload to Cloudinary and get a URL
        const fileUrl = await uploadFileToCloud(file);
        if (!fileUrl) {
            setUploadError("Failed to upload resume. Please try again.");
            return;
        }

        const API_KEY = "2e34q1Zpa9wcSq0YKHF1ZQK5o87E2Pzc"; // Replace with actual APILayer API Key
        try {
            const response = await fetch(`https://api.apilayer.com/resume_parser/url?url=${encodeURIComponent(fileUrl)}`, {
                method: "GET",
                headers: {
                    apikey: API_KEY,
                },
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();

            const formattedData = {
                skills: data.skills?.map((skill) => ({
                    name: skill,
                    level: DetectedSkill.MODERATE, // Modify logic to determine level
                    subtopics: [],
                })) || [],
                experience: data.experience || [],
                projects: data.projects || [],
            };
            setParsedResumeData(formattedData);
            setDetectedTopics(formattedData.skills.map((skill) => skill.name));
        } catch (err) {
            setUploadError("Failed to analyze resume. Please try again.");
            console.error("Resume Parsing Error:", err);
        }
    };

    const removeFile = () => {
        setResumeFile(null);
        setUploadError("");
        setParsedResumeData({
            skills: []
        })
        setskillloading(false);

    };

    useEffect(() => {
        setpromt(parsedResumeData.skills.map((skill) => skill.name));
    }, [parsedResumeData.skills]);

    const renderTranscriptSection = () => {
        if (!isInterviewStarted || interviewComplete) return null;

        return (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Current Response:</h3>
                <p className="text-gray-700">{currentTranscript || 'Listening...'}</p>
            </div>
        );
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {!isInterviewStarted ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-xl p-8">
                            <h1 className="text-3xl font-bold text-center mb-8">AI Mock Interview</h1>

                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4">Upload Resume</h2>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                                    {!resumeFile ? (
                                        <div className="text-center">
                                            <input type="file" id="resume-upload" accept=".pdf,.doc,.docx" onChange={handleFileUpload} className="hidden" />
                                            <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center">
                                                <FaFileUpload className="text-4xl text-gray-400 mb-2" />
                                                <p className="text-gray-600 mb-1">Drag & drop your resume or click to upload</p>
                                                <p className="text-sm text-gray-500">Supports PDF, DOC, DOCX (Max 5MB)</p>
                                            </label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between bg-blue-50 p-4 rounded-lg">
                                            <div className="flex items-center space-x-3">
                                                {resumeFile.type.includes("pdf") ? <FaFilePdf className="text-red-500 text-xl" /> : <FaFileWord className="text-blue-500 text-xl" />}
                                                <div>
                                                    <p className="font-medium">{resumeFile.name}</p>
                                                    <p className="text-sm text-gray-500">{(resumeFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                            </div>
                                            <button onClick={removeFile} className="text-gray-500 hover:text-red-500">
                                                <FaTimes />
                                            </button>
                                        </div>
                                    )}
                                    {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
                                </div>
                            </div>
                            {skillloading && <div className="text-black text-xl text-center ">
                                <div>
                                    Analyzing resume for skills...
                                </div>


                            </div>

                            }
                            {parsedResumeData.skills.length > 0 && (
                                <div className="mt-6">
                                    <h2 className="text-xl font-semibold mb-4">Detected Skills</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {parsedResumeData.skills.map((skill, index) => (
                                            <div key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-medium text-center">
                                                {skill.name}

                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Interview Controls */}
                            <div className="flex justify-center space-x-6 mt-8">
                                <button
                                    onClick={toggleCamera}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isCameraOn ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {isCameraOn ? <FaVideoSlash /> : <FaVideo />}
                                    <span>{isCameraOn ? 'Stop Camera' : 'Start Camera'}</span>
                                </button>
                                <button
                                    onClick={toggleMicrophone}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${isMicOn ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
                                        }`}
                                >
                                    {isMicOn ? <FaMicrophoneSlash /> : <FaMicrophone />}
                                    <span>{isMicOn ? 'Stop Mic' : 'Start Mic'}</span>
                                </button>
                            </div>

                            {/* Camera Preview */}
                            <div className="mt-6">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className={`w-full h-64 bg-black rounded-lg ${!isCameraOn && 'hidden'}`}
                                />
                            </div>

                            <button
                                onClick={startInterview}
                                disabled={!resumeFile || isLoading}
                                className={`w-full mt-8 py-3 px-6 rounded-lg text-white font-semibold ${!resumeFile || isLoading
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                {isLoading ? 'Preparing Interview...' : 'Start Interview'}
                            </button>
                        </motion.div>
                    ) : interviewComplete ? (
                        <InterviewResult
                            score={interviewResults?.overallScore || 0}
                            feedback={interviewResults?.feedback || []}
                            keyStrengths={interviewResults?.keyStrengths || []}
                            developmentAreas={interviewResults?.developmentAreas || []}
                            recommendations={interviewResults?.recommendations || []}
                            overallFeedback={interviewResults?.overallFeedback || ''}
                        />
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-xl p-8">
                            {isAnalyzing ? (
                                <div className="text-center py-12">
                                    <FaRobot className="text-5xl text-blue-600 mx-auto animate-bounce" />
                                    <h2 className="text-2xl font-semibold mt-4">Analyzing Your Responses...</h2>
                                    <p className="text-gray-600 mt-2">Please wait while we evaluate your interview performance.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <h2 className="text-2xl font-bold">AI Mock Interview</h2>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2 text-lg">
                                                <FaRegClock className={`${timeRemaining <= 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`} />
                                                <span className={`font-mono ${timeRemaining <= 10 ? 'text-red-600' : ''}`}>{formatTime(timeRemaining)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-6">
                                        <div className="col-span-2">
                                            <video  
                                                src={'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4'}
                                                autoPlay
                                                playsInline
                                                muted
                                                loop={true}
        
                                                className="w-full h-96 bg-black rounded-lg"
                                            />
                                            <div className="mt-4 flex justify-center space-x-4">
                                                <div className="flex items-center space-x-2">
                                                    <FaMicrophone className={isRecording ? 'text-red-500' : 'text-gray-400'} />
                                                    <span className="text-sm">{isRecording ? 'Recording' : 'Not Recording'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-semibold mb-4">Question {currentQuestionIndex + 1} of {questions.length}:</h3>
                                            <p className="text-gray-700 mb-4">{currentQuestion}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2 text-lg">
                                                    <FaRegClock className={`${timeRemaining <= 10 ? 'text-red-600 animate-pulse' : 'text-blue-600'}`} />
                                                    <span className={`font-mono ${timeRemaining <= 10 ? 'text-red-600' : ''}`}>{formatTime(timeRemaining)}</span>
                                                </div>
                                                {currentQuestionIndex < questions.length - 1 && (
                                                    <button
                                                        onClick={moveToNextQuestion}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                                    >
                                                        Next Question
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    {renderTranscriptSection()}
                                </>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MockInterview;
