# Database Structure and Data Flow

## Overview
The RRR application uses MongoDB as its primary database, implementing a document-oriented data model that supports the application's core functionalities. This document outlines the database schema, relationships between collections, and data flow throughout the application.

## Database Schema

### User Collection
Stores user account information and authentication details.

```javascript
const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  profilePicture: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  resumes: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resume' 
  }],
  interviews: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Interview' 
  }]
});
```

### Resume Collection
Stores user-created resumes with all section data.

```javascript
const resumeSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  template: { 
    type: String, 
    enum: ['modern', 'classic'], 
    default: 'modern' 
  },
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
    experience: [{
      company: String,
      position: String,
      startDate: String,
      endDate: String,
      description: String
    }],
    skills: [String],
    projects: [{
      title: String,
      description: String,
      technologies: String,
      link: String
    }],
    customSections: [{
      title: String,
      content: String
    }]
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  }
});
```

### Interview Collection
Stores mock interview sessions, questions, and user responses.

```javascript
const interviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  jobRole: { 
    type: String, 
    required: true 
  },
  topics: [String],
  questions: [{
    question: String,
    expectedKeywords: [String],
    userAnswer: String,
    feedback: String,
    score: Number,
    timeSpent: Number
  }],
  overallScore: Number,
  date: { 
    type: Date, 
    default: Date.now 
  },
  resumeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resume' 
  }
});
```

### SkillsAnalysis Collection
Stores results from resume analysis and skill assessments.

```javascript
const skillsAnalysisSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  resumeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Resume' 
  },
  skills: [{
    name: String,
    category: String,
    level: String,
    suggestions: [String]
  }],
  missingSkills: [String],
  overallScore: Number,
  date: { 
    type: Date, 
    default: Date.now 
  }
});
```

## Database Relationships

### One-to-Many Relationships
1. **User to Resumes**: One user can have multiple resumes
2. **User to Interviews**: One user can have multiple interview sessions
3. **Resume to SkillsAnalysis**: One resume can have multiple analysis records over time

### References and Population
MongoDB references are used to establish relationships between documents:

```javascript
// Example of populating user's resumes
const user = await User.findById(userId).populate('resumes');

// Example of populating interview with resume data
const interview = await Interview.findById(interviewId)
  .populate('resumeId')
  .populate('userId', 'name email');
```

## Data Flow Patterns

### User Authentication Flow
1. User registers or logs in
2. User document is created or retrieved
3. JWT token is generated with user ID
4. Subsequent requests include token for authentication

### Resume Creation Flow
1. User creates new resume
2. Resume document is created with user ID reference
3. Resume ID is added to user's resumes array
4. Resume sections are updated as user edits content
5. lastUpdated field is updated on each save

### Resume Analysis Flow
1. User uploads resume for analysis
2. Resume is parsed and data extracted
3. Skills and structure are analyzed
4. Analysis results are stored in SkillsAnalysis collection
5. Results are linked to both user and resume

### Interview Session Flow
1. User initiates mock interview
2. Questions are generated based on resume content
3. New interview document is created
4. User answers are stored as they are submitted
5. Completed interview is saved with overall score

## Database Operations

### Create Operations
```javascript
// Create new user
const newUser = new User({
  name: req.body.name,
  email: req.body.email,
  password: hashedPassword
});
await newUser.save();

// Create new resume
const newResume = new Resume({
  userId: req.user.id,
  name: req.body.name,
  template: req.body.template,
  sections: req.body.sections
});
await newResume.save();
```

### Read Operations
```javascript
// Get user's resumes
const resumes = await Resume.find({ userId: req.user.id });

// Get specific resume with populated user data
const resume = await Resume.findById(req.params.id)
  .populate('userId', 'name email');
```

### Update Operations
```javascript
// Update resume sections
const updatedResume = await Resume.findByIdAndUpdate(
  req.params.id,
  { 
    'sections': req.body.sections,
    'lastUpdated': Date.now()
  },
  { new: true }
);

// Add interview to user's interviews array
await User.findByIdAndUpdate(
  req.user.id,
  { $push: { interviews: newInterview._id } }
);
```

### Delete Operations
```javascript
// Delete resume
await Resume.findByIdAndDelete(req.params.id);

// Remove resume reference from user
await User.findByIdAndUpdate(
  req.user.id,
  { $pull: { resumes: req.params.id } }
);
```

## Data Security Considerations

### Password Security
- Passwords are hashed using bcrypt before storage
- Original passwords are never stored in the database
- Password reset uses secure token-based flow

### Data Access Control
- JWT authentication ensures users can only access their own data
- API endpoints validate user ownership before operations
- Role-based access control for future admin functionality

### Data Validation
- Mongoose schema validation ensures data integrity
- Additional validation logic in API controllers
- Error handling for invalid data formats

## Backup and Recovery

### Database Backup Strategy
- Regular automated backups of MongoDB database
- Backup before major deployments or migrations
- Secure storage of backup files

### Recovery Procedures
- Documented process for database restoration
- Point-in-time recovery capabilities
- Testing of restore procedures

## Performance Optimization

### Indexing Strategy
```javascript
// Email index for fast user lookup
userSchema.index({ email: 1 });

// Compound index for resume queries
resumeSchema.index({ userId: 1, lastUpdated: -1 });
```

### Query Optimization
- Selective field projection to reduce data transfer
- Pagination for large result sets
- Efficient use of MongoDB aggregation pipeline

### Connection Pooling
- Configured connection pooling for optimal performance
- Monitoring of connection usage and timeouts
- Proper connection error handling
