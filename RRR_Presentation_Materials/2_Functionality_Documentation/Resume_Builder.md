# Resume Builder Component

## Overview
The Resume Builder is a core component of the RRR application that allows users to create professional resumes using customizable templates. It features a user-friendly interface with real-time preview, auto-save functionality, and multiple resume version management.

## Key Features

### 1. Template Selection
- Modern and Classic template options
- Preview thumbnails for each template
- Ability to switch templates at any time

### 2. Section Management
- Standard resume sections (Personal Information, Education, Experience, Skills, Projects)
- Add, edit, or remove sections
- Drag-and-drop reordering of sections
- Custom section creation

### 3. Real-Time Preview
- Split-screen layout with form and preview
- Live updates as content is entered
- Collapsible preview panel
- Resizable width with draggable divider

### 4. Auto-Save Functionality
- Automatic saving every 30 seconds
- Visual indicator when save occurs
- Manual save option

### 5. Multiple Resume Version Management
- Create multiple resume versions
- Assign unique names to each version
- Switch between versions
- Clone existing resumes as starting points for new versions

## User Workflow

### 1. Creating a New Resume
1. User navigates to Resume Builder section
2. Selects "Create New Resume" option
3. Enters resume name
4. Selects a template (Modern or Classic)
5. System creates new resume and redirects to editor

### 2. Editing Resume Content
1. User fills out form fields for each section
2. Real-time preview updates as content is entered
3. Auto-save occurs every 30 seconds
4. User can manually save at any time

### 3. Managing Sections
1. User can add new sections using the "Add Section" button
2. Existing sections can be edited or removed
3. Sections can be reordered via drag-and-drop
4. Custom sections can be created with user-defined titles

### 4. Switching Templates
1. User selects "Change Template" option
2. Views available templates
3. Selects desired template
4. Content is preserved and reformatted to new template

### 5. Managing Multiple Versions
1. User can view all saved resumes in profile
2. Select any resume to edit
3. Create new versions by cloning existing resumes
4. Delete unwanted versions

## Technical Implementation

### Frontend Components

#### ResumeBuilder Component
- Main container component
- Manages state for the entire resume
- Handles template switching
- Coordinates auto-save functionality

#### ResumeForm Component
- Renders form fields for all sections
- Validates user input
- Manages section ordering
- Handles section addition/removal

#### ResumePreview Component
- Renders real-time preview based on current data
- Implements different template styles
- Handles print and export functionality

#### TemplateSelector Component
- Displays available templates
- Provides preview of each template
- Handles template selection

### Backend Components

#### Resume Model (MongoDB Schema)
```javascript
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
  lastUpdated: { type: Date, default: Date.now }
});
```

#### Resume API Endpoints
1. **Create Resume**: `POST /api/resumes`
2. **Get All Resumes**: `GET /api/resumes`
3. **Get Resume by ID**: `GET /api/resumes/:id`
4. **Update Resume**: `PUT /api/resumes/:id`
5. **Delete Resume**: `DELETE /api/resumes/:id`
6. **Clone Resume**: `POST /api/resumes/:id/clone`

## Data Flow

1. **Loading Data**:
   - User selects resume to edit
   - Frontend fetches resume data from backend
   - Data is loaded into ResumeBuilder component state
   - Form fields are populated with existing data

2. **Saving Data**:
   - Auto-save triggers every 30 seconds if changes detected
   - Manual save occurs when user clicks "Save" button
   - Frontend sends updated resume data to backend
   - Backend updates database record
   - Confirmation message shown to user

3. **Exporting Resume**:
   - User selects "Export" option
   - Frontend generates PDF version of resume
   - User can download or print the PDF

## Testing Scenarios

1. **Creating New Resume**:
   - Verify all fields are empty
   - Confirm template is applied correctly
   - Check that auto-save works for new resume

2. **Editing Existing Resume**:
   - Verify all saved data loads correctly
   - Confirm changes are saved properly
   - Test section reordering functionality

3. **Template Switching**:
   - Verify content is preserved when switching templates
   - Check that formatting is applied correctly
   - Test switching back and forth between templates

4. **Multiple Version Management**:
   - Create multiple resume versions
   - Switch between versions
   - Clone a version and verify all data is copied

## Common Issues and Solutions

1. **Auto-Save Not Working**:
   - Check network connectivity
   - Verify user authentication status
   - Ensure backend API is accessible

2. **Preview Not Updating**:
   - Check state management in ResumeBuilder component
   - Verify data flow between form and preview components

3. **Template Formatting Issues**:
   - Inspect CSS for the specific template
   - Check responsive design implementation
   - Verify print stylesheet configuration
