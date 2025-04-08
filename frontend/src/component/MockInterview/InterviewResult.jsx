import React from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

const InterviewResult = ({ score, feedback, keyStrengths, developmentAreas, recommendations, overallFeedback }) => {
    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-xl p-8"
        >
            <h2 className="text-3xl font-bold text-center mb-8">Interview Results</h2>

            {/* Overall Score */}
            <div className="text-center mb-8">
                <div className={`text-6xl font-bold ${getScoreColor(score)}`}>
                    {score}/100
                </div>
                <p className="text-gray-600 mt-2">{overallFeedback}</p>
            </div>

            {/* Question-by-Question Feedback */}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Detailed Feedback</h3>
                {feedback.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold">Question {item.questionNumber}: {item.question}</h4>
                        <p className="text-gray-600 mt-2">Your Response: {item.response}</p>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-3 rounded shadow-sm">
                                <h5 className="font-semibold text-blue-600">Technical Accuracy</h5>
                                <p className="text-sm">{item.technicalAccuracy}</p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <h5 className="font-semibold text-green-600">Communication</h5>
                                <p className="text-sm">{item.communication}</p>
                            </div>
                            <div className="bg-white p-3 rounded shadow-sm">
                                <h5 className="font-semibold text-purple-600">Problem Solving</h5>
                                <p className="text-sm">{item.problemSolving}</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <div className={`text-2xl font-bold ${getScoreColor(item.score)} mb-2`}>
                                Score: {item.score}/100
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h5 className="font-semibold text-green-600 flex items-center">
                                        <FaCheckCircle className="mr-2" />
                                        Strengths
                                    </h5>
                                    <ul className="list-disc list-inside text-sm">
                                        {item.strengths.map((strength, i) => (
                                            <li key={i}>{strength}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-semibold text-yellow-600 flex items-center">
                                        <FaExclamationCircle className="mr-2" />
                                        Areas to Improve
                                    </h5>
                                    <ul className="list-disc list-inside text-sm">
                                        {item.improvements.map((improvement, i) => (
                                            <li key={i}>{improvement}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Summary Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <FaStar className="text-yellow-400 mr-2" />
                        Key Strengths
                    </h3>
                    <ul className="list-disc list-inside">
                        {keyStrengths.map((strength, index) => (
                            <li key={index} className="text-gray-700 mb-2">{strength}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <FaExclamationCircle className="text-yellow-600 mr-2" />
                        Areas for Development
                    </h3>
                    <ul className="list-disc list-inside">
                        {developmentAreas.map((area, index) => (
                            <li key={index} className="text-gray-700 mb-2">{area}</li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Recommendations */}
            <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Recommendations</h3>
                <ul className="list-disc list-inside">
                    {recommendations.map((recommendation, index) => (
                        <li key={index} className="text-gray-700 mb-2">{recommendation}</li>
                    ))}
                </ul>
            </div>
        </motion.div>
    );
};

export default InterviewResult;
