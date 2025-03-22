import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaVideo, FaCog, FaRegClock, FaRobot, FaFileUpload, FaFilePdf, FaFileWord, FaTimes } from "react-icons/fa";
import Header from "../Header";
import Footer from "../Footer";
import axios from 'axios'
import { useEffect } from "react";
import Mic from "../Mice/Mic";

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
    const [promt,setpromt]=useState([]);
    const [skillloading,setskillloading]=useState(false);
    const baseUrl="http://localhost:3001/";

    const [parsedResumeData, setParsedResumeData] = useState({
        skills: [],
        experience: [],
        projects: [],
    });

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

    const startInterview = async() => {
       
        if (!resumeFile) {
            alert("Please upload your resume");
            return;
        }
        try {
            const res = await axios.post(
                `${baseUrl}api/generate`,
                { promt }, // Ensure 'prompt' is properly defined
               
            );
       console.log(res.data);
    //    setrespo(res.data);
    //    setproc(false);
         
        }catch(err){

        }

        setIsInterviewStarted(true);
    };
    useEffect(() => {
        setpromt(parsedResumeData.skills.map((skill) => skill.name));
    }, [parsedResumeData.skills]);
    

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {!isInterviewStarted ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-xl p-8">
                            <h1 className="text-3xl font-bold text-center mb-8"> Mock Interviewss</h1>

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
                                    <div>
                                        <Mic/>
                                    </div>
                                </div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={startInterview}
                                className={`w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-blue-900 ${!resumeFile ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={!resumeFile}
                            >
                                Start Interview
                            </motion.button>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-lg shadow-xl">
                            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                                <div className="flex items-center space-x-4">
                                    <FaRobot className="text-2xl text-blue-600" />
                                    <div>
                                        <h2 className="font-semibold">AI Interviewer</h2>
                                        <p className="text-sm text-gray-600">{detectedTopics.join(", ")}</p>
                                    </div>
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
