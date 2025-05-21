# RRR Application Directory Structure

## Introduction

RRR application ek complex project hai jisme frontend aur backend dono components hain. Is document mein hum project ki directory structure ko detail mein explain karenge, har folder aur important files ka purpose batayenge, aur ye bhi samjhayenge ki different components ek dusre ke saath kaise interact karte hain.

## Project Overview

```
RRR/
├── frontend/           # React frontend application
│   ├── public/         # Static files
│   └── src/            # Source code
├── backend/            # Node.js backend application
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── controllers/    # Business logic
│   ├── middleware/     # Custom middleware
│   └── utils/          # Utility functions
├── .env                # Environment variables
├── package.json        # Project dependencies and scripts
└── README.md           # Project documentation
```

## Frontend Structure

```
frontend/
├── public/
│   ├── index.html      # Main HTML file
│   ├── favicon.ico     # Website favicon
│   └── assets/         # Static assets
├── src/
│   ├── assets/         # Images, fonts, etc.
│   ├── component/      # React components
│   │   ├── Header.jsx  # Application header
│   │   ├── Footer.jsx  # Application footer
│   │   ├── Login/      # Authentication components
│   │   ├── Registration/ # User registration
│   │   ├── ResumeBuilder/ # Resume builder feature
│   │   ├── SmartRecognition/ # Resume analysis
│   │   ├── MockInterview/ # Interview practice
│   │   └── UserProfile/ # User profile management
│   ├── context/        # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   ├── index.js        # Application entry point
│   └── index.css       # Global styles
├── package.json        # Frontend dependencies
└── tailwind.config.js  # Tailwind CSS configuration
```

### Frontend Key Files Explanation

#### 1. Entry Points

**src/index.js**
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Ye file application ka main entry point hai. Isme React app ko DOM se connect kiya jata hai.

**src/App.jsx**
```jsx
function App() {
  return (
    <Router>
      {/* Session Manager */}
      <SessionManagerWrapper />
      <ToastContainer />

      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        {/* More routes... */}
      </Routes>
    </Router>
  );
}
```

App.jsx main application component hai jisme routing setup kiya gaya hai. Ye decide karta hai ki konsa component kab display hoga.

#### 2. Core Components

**src/component/Header.jsx**
```jsx
const Header = () => {
  // State and handlers
  
  return (
    <header className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-lg py-3">
      {/* Logo */}
      {/* Navigation */}
      {/* User menu */}
      {/* Mobile menu */}
    </header>
  );
};
```

Header component application ka navigation provide karta hai aur user authentication status dikhata hai.

**src/component/ResumeBuilder/ResumeBuilder.jsx**
```jsx
const ResumeBuilder = () => {
  // Resume state and handlers
  
  return (
    <div className="resume-builder-container">
      <Sidebar />
      <div className="main-content">
        <ResumeForm data={resumeData} onChange={handleChange} />
        <ResumePreview data={resumeData} template={template} />
      </div>
    </div>
  );
};
```

ResumeBuilder main feature component hai jo resume creation aur editing handle karta hai.

## Backend Structure

```
backend/
├── models/
│   ├── User.js         # User model schema
│   ├── Resume.js       # Resume model schema
│   └── Interview.js    # Interview model schema
├── routes/
│   ├── auth.js         # Authentication routes
│   ├── resume.js       # Resume management routes
│   ├── interview.js    # Interview routes
│   └── recognition.js  # Resume analysis routes
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── resumeController.js # Resume operations
│   └── interviewController.js # Interview logic
├── middleware/
│   ├── auth.js         # Authentication middleware
│   └── errorHandler.js # Error handling middleware
├── utils/
│   ├── database.js     # Database connection
│   └── validators.js   # Input validation
├── index.js            # Server entry point
└── package.json        # Backend dependencies
```

### Backend Key Files Explanation

#### 1. Server Entry Point

**index.js**
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');
// More imports...

const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
// More routes...

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

Ye file backend server ka main entry point hai. Isme Express server setup, database connection, middleware configuration, aur routes registration hoti hai.

#### 2. Database Models

**models/User.js**
```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  createdAt: { type: Date, default: Date.now },
  resumes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }]
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
```

User model user data ka structure define karta hai aur password hashing jaise security features implement karta hai.

**models/Resume.js**
```javascript
const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  template: { type: String, enum: ['modern', 'classic'], default: 'modern' },
  sections: {
    personalInfo: {
      name: String,
      email: String,
      phone: String,
      address: String,
      linkedin: String,
      website: String
    },
    education: [{
      institution: String,
      degree: String,
      field: String,
      startDate: String,
      endDate: String,
      description: String
    }],
    // More sections...
  },
  lastUpdated: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resume', resumeSchema);
```

Resume model resume data ka structure define karta hai, including all sections and template information.

#### 3. API Routes

**routes/resume.js**
```javascript
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const resumeController = require('../controllers/resumeController');

// Get all user resumes
router.get('/', auth, resumeController.getUserResumes);

// Get resume by ID
router.get('/:id', auth, resumeController.getResumeById);

// Create new resume
router.post('/', auth, resumeController.createResume);

// Update resume
router.put('/:id', auth, resumeController.updateResume);

// Delete resume
router.delete('/:id', auth, resumeController.deleteResume);

// Clone resume
router.post('/:id/clone', auth, resumeController.cloneResume);

module.exports = router;
```

Routes files API endpoints define karte hain aur appropriate controller functions ko call karte hain.

## Data Flow

### Frontend to Backend Communication

1. **API Service Layer**

```javascript
// frontend/src/services/resumeService.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Add auth token to requests
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export const getResumes = async () => {
  try {
    const response = await axios.get(`${API_URL}/resumes`);
    return response.data;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    throw error;
  }
};

export const createResume = async (resumeData) => {
  try {
    const response = await axios.post(`${API_URL}/resumes`, resumeData);
    return response.data;
  } catch (error) {
    console.error('Error creating resume:', error);
    throw error;
  }
};

// More API functions...
```

Frontend se backend tak data flow mainly API calls ke through hota hai. Frontend components API service functions ko call karte hain, jo axios library ka use karke HTTP requests send karte hain.

2. **Backend Controller Processing**

```javascript
// backend/controllers/resumeController.js
const Resume = require('../models/Resume');
const User = require('../models/User');

exports.createResume = async (req, res) => {
  try {
    const { name, template, sections } = req.body;
    
    // Create new resume
    const newResume = new Resume({
      userId: req.user.id,
      name,
      template,
      sections
    });
    
    // Save to database
    const savedResume = await newResume.save();
    
    // Add resume to user's resumes array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { resumes: savedResume._id } }
    );
    
    res.status(201).json(savedResume);
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// More controller functions...
```

Backend controllers request data ko process karte hain, database operations perform karte hain, aur appropriate response return karte hain.

## Architecture Patterns

### 1. Client-Server Architecture

RRR application client-server architecture follow karta hai:

- **Client (Frontend)**: React.js based single-page application
- **Server (Backend)**: Node.js and Express.js based RESTful API server
- **Database**: MongoDB for data persistence

### 2. Component-Based Architecture

Frontend React.js ke component-based architecture ka use karta hai:

- **Atomic Components**: Buttons, inputs, cards jaise reusable UI elements
- **Container Components**: Data fetching aur state management handle karte hain
- **Page Components**: Complete pages represent karte hain

### 3. MVC Pattern (Backend)

Backend modified MVC (Model-View-Controller) pattern follow karta hai:

- **Models**: MongoDB schemas aur data structure define karte hain
- **Controllers**: Business logic aur request handling manage karte hain
- **Routes**: API endpoints define karte hain
- **Views**: Frontend React components (traditional MVC se alag)

### 4. Repository Pattern

Data access ke liye repository pattern implement kiya gaya hai:

- Database operations ko abstract karta hai
- Code reusability improve karta hai
- Testing ko easier banata hai

## State Management

### 1. React Context API

User authentication aur global state management ke liye Context API ka use kiya gaya hai:

```jsx
// frontend/src/context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp > currentTime) {
          setUser(JSON.parse(localStorage.getItem('user')));
        } else {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);
  
  const login = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setUser(userData);
  };
  
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 2. Local Component State

Component-specific state ke liye React's useState hook ka use kiya gaya hai:

```jsx
const ResumeForm = ({ initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSaving(true);
      try {
        await onSave(formData);
        // Success handling
      } catch (error) {
        // Error handling
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  // More component logic...
};
```

## Conclusion

RRR application ki directory structure aur architecture carefully design ki gayi hai to ensure:

1. **Modularity**: Components aur features ko easily add, modify, ya remove kiya ja sakta hai
2. **Scalability**: Application ko easily scale kiya ja sakta hai as user base grows
3. **Maintainability**: Code organization clear hai, making it easier to maintain
4. **Separation of Concerns**: Frontend aur backend clearly separated hain with well-defined interfaces

Is structure ka use karke, development team efficiently collaborate kar sakti hai aur new features ko easily integrate kar sakti hai.
