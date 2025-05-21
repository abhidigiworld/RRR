# Mock Interview Functionality

## Overview
The Mock Interview component of the RRR application provides users with a simulated interview experience based on their resume content and selected job roles. It generates relevant questions, allows users to practice their responses, and provides feedback to help improve interview performance.

## Key Features

### 1. Topic Selection
- Industry-specific interview topics
- Role-based question categories
- Skill-focused question sets
- Custom topic creation

### 2. Question Generation
- Algorithm-based question creation
- Resume-tailored questions
- Technical and behavioral questions
- Varying difficulty levels

### 3. Interview Simulation
- Timed response environment
- Text-based answer submission
- Voice recording option (future enhancement)
- Realistic interview flow

### 4. Answer Evaluation
- Keyword analysis
- Structure assessment
- Completeness evaluation
- Improvement suggestions

### 5. Interview History
- Past interview session storage
- Performance tracking over time
- Question and answer review
- Progress visualization

## User Workflow

### 1. Interview Setup
1. User navigates to Mock Interview section
2. Uploads resume or uses previously parsed resume
3. Selects job role and interview type
4. Chooses specific topics or skills to focus on
5. Sets interview parameters (number of questions, time limits)

### 2. Interview Session
1. System generates relevant questions
2. Questions are presented one at a time
3. Timer starts for each question
4. User types or records their answer
5. System evaluates response and provides feedback
6. Process continues until all questions are answered

### 3. Results Review
1. System provides overall interview performance summary
2. Highlights strengths and areas for improvement
3. Offers specific suggestions for each question
4. Saves interview session for future reference

### 4. Progress Tracking
1. User can view history of all interview sessions
2. Compare performance across different sessions
3. Track improvement in specific areas
4. Review past questions and answers

## Technical Implementation

### Frontend Components

#### MockInterview Component
- Main container component
- Manages interview state and flow
- Coordinates question generation and evaluation
- Displays interview interface

#### TopicSelector Component
- Presents available interview topics
- Allows custom topic creation
- Manages topic selection
- Filters topics based on job role

#### QuestionDisplay Component
- Renders current question
- Manages timer functionality
- Provides answer input interface
- Handles question navigation

#### AnswerEvaluator Component
- Analyzes user responses
- Generates feedback
- Displays evaluation results
- Provides improvement suggestions

#### InterviewHistory Component
- Lists past interview sessions
- Provides detailed view of each session
- Visualizes performance metrics
- Allows session comparison

### Backend Components

#### Interview Model (MongoDB Schema)
```javascript
const interviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  jobRole: { type: String, required: true },
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
  date: { type: Date, default: Date.now },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }
});
```

#### Question Generation Logic
```javascript
const generateQuestions = (resumeData, jobRole, topics, count = 5) => {
  const questions = [];
  
  // Generate questions based on skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    for (const skill of resumeData.skills.slice(0, Math.min(3, resumeData.skills.length))) {
      questions.push({
        question: `Can you describe a project where you used ${skill}?`,
        expectedKeywords: [skill, 'project', 'experience', 'implemented', 'developed']
      });
    }
  }
  
  // Generate questions based on experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    const recentExperience = resumeData.experience[0];
    questions.push({
      question: `Tell me about your role at ${recentExperience.company}. What were your main responsibilities?`,
      expectedKeywords: ['responsibility', 'role', 'managed', 'developed', 'team']
    });
  }
  
  // Generate role-specific questions
  const roleQuestions = getRoleSpecificQuestions(jobRole, topics);
  questions.push(...roleQuestions);
  
  // Generate behavioral questions
  const behavioralQuestions = getBehavioralQuestions();
  questions.push(...behavioralQuestions);
  
  // Return the requested number of questions
  return questions.slice(0, count);
};
```

#### Interview API Endpoints
1. **Create Interview**: `POST /api/interview`
2. **Get Interview History**: `GET /api/interview/history`
3. **Get Interview by ID**: `GET /api/interview/:id`
4. **Submit Answer**: `POST /api/interview/:id/answer`
5. **Complete Interview**: `POST /api/interview/:id/complete`
6. **Generate Questions**: `POST /api/interview/generate-questions`

## Data Flow

1. **Interview Setup**:
   - User selects job role and topics
   - Frontend sends request to generate questions
   - Backend generates questions based on resume data and selections
   - Questions are returned to frontend and stored in session

2. **Question Answering**:
   - Frontend displays current question and starts timer
   - User submits answer
   - Answer is sent to backend for evaluation
   - Backend analyzes answer and returns feedback
   - Frontend displays feedback and moves to next question

3. **Interview Completion**:
   - All question responses are compiled
   - Overall performance is calculated
   - Complete interview data is saved to database
   - Summary results are displayed to user

4. **History Retrieval**:
   - User requests interview history
   - Frontend fetches history from backend
   - Backend retrieves interview records from database
   - Data is returned and displayed in frontend

## Testing Scenarios

1. **Question Generation**:
   - Verify questions are relevant to resume content
   - Test with different job roles and topics
   - Check question variety and quality

2. **Answer Evaluation**:
   - Test with various answer types (good, average, poor)
   - Verify keyword detection accuracy
   - Check feedback relevance and helpfulness

3. **Interview Flow**:
   - Test complete interview process
   - Verify timer functionality
   - Check navigation between questions
   - Test interview completion and summary

4. **History and Progress Tracking**:
   - Create multiple interview sessions
   - Verify correct storage and retrieval
   - Test performance comparison functionality

## Common Issues and Solutions

1. **Question Relevance**:
   - Continuously refine question generation algorithm
   - Implement user feedback mechanism
   - Expand question database for different roles

2. **Answer Evaluation Accuracy**:
   - Improve keyword detection algorithms
   - Consider implementing more advanced NLP techniques
   - Allow manual override for evaluation results

3. **Resume Parsing Integration**:
   - Ensure smooth data flow from resume parser
   - Implement fallback mechanisms for missing data
   - Allow manual input for better question targeting
