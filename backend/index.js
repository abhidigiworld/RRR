require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI("AIzaSyC06-P5LquDMk5HzrziOG3OFZyGnOmwVv0");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  ageCategory: { type: String, required: true },
  password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Resume Schema
const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  personal: {
    fullName: String,
    location: String,
    phone: String,
    email: String,
    github: String,
    linkedin: String
  },
  training: [{
    id: Number,
    company: String,
    position: String,
    duration: String,
    points: [String]
  }],
  projects: [{
    id: Number,
    title: String,
    technologies: String,
    duration: String,
    points: [String],
    githubLink: String
  }],
  certifications: [{
    id: Number,
    title: String,
    platform: String,
    date: String,
    certificateLink: String
  }],
  technicalSkills: {
    languages: String,
    technologies: String,
    skills: String
  },
  education: [{
    id: Number,
    institution: String,
    degree: String,
    duration: String,
    location: String,
    details: String
  }]
});

const Resume = mongoose.model('Resume', resumeSchema);

// Add OTP Schema
const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // OTP expires in 5 minutes
});

const OTP = mongoose.model('OTP', otpSchema);

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP Email
const sendOTPEmail = async (email, otp, type) => {
  const subject = type === 'registration' 
    ? 'Welcome to RRR - Email Verification' 
    : 'RRR - Password Reset Request';

  const html = type === 'registration' 
    ? `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to RRR - Resume Recognition & Reconfiguration</h2>
        <p>Thank you for choosing RRR for your professional journey. We're excited to have you on board!</p>
        <p>Your verification OTP is: <strong style="font-size: 24px; color: #2563eb;">${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
        <p>With RRR, you'll have access to:</p>
        <ul>
          <li>AI-powered resume building</li>
          <li>Smart interview preparation</li>
          <li>Professional career guidance</li>
        </ul>
        <p>If you didn't request this verification, please ignore this email.</p>
      </div>
    `
    : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Password Reset Request - RRR</h2>
        <p>We received a request to reset your password. If you didn't make this request, please secure your account immediately.</p>
        <p>Your password reset OTP is: <strong style="font-size: 24px; color: #dc2626;">${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
        <p>For security reasons, please do not share this OTP with anyone.</p>
      </div>
      
    `;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html
  });
};

// Send OTP Endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email, type } = req.body;

    // For registration, check if email already exists
    if (type === 'registration') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered' });
      }
    }

    const otp = generateOTP();

    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email },
      { otp },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp, type);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ message: 'Failed to send OTP' });
  }
});

// Verify OTP Endpoint
app.post('/api/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    await OTP.deleteOne({ email });
    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ message: 'Failed to verify OTP' });
  }
});

// Reset Password Endpoint
app.post('/api/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    await User.findOneAndUpdate(
      { email },
      { password: hashedPassword }
    );

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Failed to reset password' });
  }
});

// Registration Endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, ageCategory, password, confirmPassword } = req.body;

    // Basic validation
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      fullName,
      email,
      ageCategory,
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login Endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.log("Invalid password for user:", email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log("Login successful for user:", email);
    res.status(200).json({ 
      result: user, 
      token, 
      userType: 'user',
      fullName: user.fullName
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
});

// Protected route to get user data
app.get('/api/resume/user-data', async (req, res) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return user data (excluding sensitive information)
        res.status(200).json({
            fullName: user.fullName,
            email: user.email,
            ageCategory: user.ageCategory
            // Add other fields as needed
        });

    } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Save/Update Resume Endpoint
app.post('/api/resume/save', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const resumeData = {
      userId,
      ...req.body
    };

    // Update if exists, create if doesn't
    const result = await Resume.findOneAndUpdate(
      { userId },
      resumeData,
      { upsert: true, new: true }
    );

    res.status(200).json({ message: 'Resume saved successfully', resume: result });
  } catch (error) {
    console.error('Error saving resume:', error);
    res.status(500).json({ message: 'Error saving resume' });
  }
});

// Fetch Resume Endpoint
app.get('/api/resume/fetch', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const resume = await Resume.findOne({ userId });
    if (!resume) {
      return res.status(404).json({ message: 'No resume found' });
    }

    res.status(200).json(resume);
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Error fetching resume' });
  }
});

// Add this new endpoint
app.post('/api/check-user', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User exists' });
    } catch (error) {
        console.error('Error checking user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Interview Analysis Endpoint
app.post('/api/analyze-interview', async (req, res) => {
    try {
        const { transcripts, questions } = req.body;
        console.log('Received analysis request:', { 
            questionsCount: questions?.length,
            transcriptsCount: transcripts?.length 
        });

        if (!transcripts || !questions || transcripts.length !== questions.length) {
            throw new Error('Invalid request: Missing or mismatched questions and transcripts');
        }

        const analysisPrompt = `
        You are an expert technical interviewer. Analyze these interview responses.
        
        Questions and Answers:
        ${questions.map((q, i) => `
        Question: ${q}
        Answer: ${transcripts[i] || 'No response provided'}
        `).join('\n\n')}
        
        Provide a JSON response in this EXACT format (do not include any other text):
        {
            "feedback": [
                {
                    "questionNumber": 1,
                    "question": "question text",
                    "response": "answer text",
                    "score": 75,
                    "technicalAccuracy": "feedback on technical accuracy",
                    "communication": "feedback on communication",
                    "problemSolving": "feedback on approach",
                    "strengths": ["strength 1", "strength 2"],
                    "improvements": ["improvement 1", "improvement 2"]
                }
            ],
            "overallScore": 80,
            "overallFeedback": "overall performance feedback",
            "keyStrengths": ["key strength 1", "key strength 2"],
            "developmentAreas": ["area 1", "area 2"],
            "recommendations": ["recommendation 1", "recommendation 2"]
        }`;

        console.log('Sending analysis prompt to AI...');
        const result = await model.generateContent(analysisPrompt);
        const response = await result.response;
        let analysis;

        try {
            const text = response.text();
            console.log('Raw AI response:', text);
            
            // Try to extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }
            
            analysis = JSON.parse(jsonMatch[0]);
            
            // Validate the analysis structure
            if (!analysis.feedback || !analysis.overallScore || 
                !analysis.keyStrengths || !analysis.developmentAreas) {
                throw new Error('Invalid analysis structure');
            }
            
        } catch (e) {
            console.error('Error parsing AI response:', e);
            // Provide a fallback analysis
            analysis = {
                feedback: questions.map((q, i) => ({
                    questionNumber: i + 1,
                    question: q,
                    response: transcripts[i] || 'No response provided',
                    score: 70,
                    technicalAccuracy: "Shows basic understanding of technical concepts",
                    communication: "Communication is clear and structured",
                    problemSolving: "Demonstrates logical problem-solving approach",
                    strengths: [
                        "Clear communication",
                        "Structured approach"
                    ],
                    improvements: [
                        "Could provide more detailed examples",
                        "Could elaborate on technical implementation"
                    ]
                })),
                overallScore: 70,
                overallFeedback: "Shows good potential with room for improvement in technical depth",
                keyStrengths: [
                    "Clear communication style",
                    "Structured thinking"
                ],
                developmentAreas: [
                    "Technical depth in responses",
                    "Practical implementation details"
                ],
                recommendations: [
                    "Practice providing more detailed technical examples",
                    "Focus on connecting theory with practical applications",
                    "Consider using the STAR method (Situation, Task, Action, Result) in responses"
                ]
            };
        }

        // Ensure scores are within valid range
        analysis.overallScore = Math.min(100, Math.max(0, analysis.overallScore));
        analysis.feedback.forEach(f => {
            f.score = Math.min(100, Math.max(0, f.score));
        });

        console.log('Sending analysis response:', analysis);
        res.json(analysis);
    } catch (error) {
        console.error('Error analyzing interview:', error);
        res.status(500).json({
            message: 'Failed to analyze interview',
            error: error.message
        });
    }
});

// Interview Question Generation Endpoint
app.post('/api/generate', async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log('Received prompt:', prompt);
        
        // Create a more structured prompt for the AI
        const structuredPrompt = `
        You are an experienced technical interviewer. Generate exactly 5 technical Basic  interview questions based on the candidate's skills and experience.

        Requirements:
        1. Generate EXACTLY 5 questions
        2. Each question must be on a new line
        3. Each question must end with a question mark
        4. Questions should cover different aspects of the candidate's skills
        5. Include basic levels
        6. Focus on practical, real-world scenarios
        7. DO NOT include any explanations or additional text
        8. DO NOT number the questions

        Candidate Information:
        ${prompt}

        Format your response as exactly 5 questions, one per line, nothing else.`;

        // Generate response using Gemini
        const result = await model.generateContent(structuredPrompt);
        const response = await result.response;
        let questions = [];

        try {
            // Get the raw text response
            const text = response.text();
            console.log('AI Response:', text);
            
            // Split by newlines and clean up
            questions = text
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && line.includes('?'));
            
            // Ensure exactly 5 questions
            if (questions.length < 5) {
                // If we don't have enough questions, generate some generic ones
                const defaultQuestions = [
                    "Can you explain your approach to problem-solving in a technical context?",
                    "How do you stay updated with the latest technological trends?",
                    "Describe a challenging project you worked on and how you overcame the obstacles?",
                    "How do you handle technical disagreements in a team setting?",
                    "What's your process for debugging complex technical issues?"
                ];
                questions = [...questions, ...defaultQuestions].slice(0, 5);
            } else if (questions.length > 5) {
                questions = questions.slice(0, 5);
            }
            
            console.log('Final processed questions:', questions);
            
            if (questions.length !== 5) {
                throw new Error('Failed to generate exactly 5 questions');
            }
        } catch (e) {
            console.error('Error processing questions:', e);
            throw new Error('Failed to generate valid interview questions');
        }

        res.json({ questions });
    } catch (error) {
        console.error('Error generating interview questions:', error);
        res.status(500).json({ 
            message: 'Failed to generate interview questions',
            error: error.message 
        });
    }
});

app.get('/',async(req,res)=>{
  res.send('Hello')
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));