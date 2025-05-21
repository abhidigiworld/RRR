# Troubleshooting Guide for Live Demo

This guide provides solutions for common issues that might occur during your live demonstration of the RRR application. Being prepared for potential problems will help you maintain composure and professionalism during your presentation.

## Pre-Presentation Preparation

### Technical Setup Checklist
- [ ] Test the application on the presentation device at least 1 hour before
- [ ] Ensure stable internet connection (have mobile hotspot as backup)
- [ ] Check that all API keys and services are active
- [ ] Prepare screenshots of all key features as backup
- [ ] Have a local version of the application ready if possible
- [ ] Test microphone and screen sharing capabilities
- [ ] Clear browser cache and cookies before presentation
- [ ] Have multiple browsers installed (Chrome, Firefox, Edge)
- [ ] Prepare a demonstration user account with pre-populated data
- [ ] Have database access ready for potential fixes

## Authentication Issues

### Problem: Unable to Login
**Symptoms:**
- Login form submits but returns to login page
- Error message about invalid credentials
- Blank page after login attempt

**Quick Fixes:**
1. **Check Credentials**: Verify username and password are correct
2. **Clear Browser Cache**: Try clearing cache and cookies
3. **Use Incognito/Private Window**: Open a new incognito window for testing
4. **Check Backend Status**: Verify the backend server is running
5. **Alternative Account**: Use a backup demonstration account
6. **Manual JWT**: If necessary, use browser console to manually set a JWT token:
   ```javascript
   localStorage.setItem('token', 'your-backup-jwt-token');
   localStorage.setItem('user', JSON.stringify({_id: 'demo-user-id', name: 'Demo User', email: 'demo@example.com'}));
   window.location.href = '/dashboard';
   ```

### Problem: Session Expiration During Demo
**Symptoms:**
- Unexpected logout
- Session expiration notification
- API requests returning 401 Unauthorized

**Quick Fixes:**
1. **Extend Session**: Click "Extend Session" when notification appears
2. **Refresh Page**: Sometimes a simple refresh resolves token issues
3. **Quick Re-login**: Have credentials ready for quick re-login
4. **Explain Feature**: Use the opportunity to explain the session management feature
5. **Bypass for Demo**: If persistent, consider temporarily modifying the session timeout:
   ```javascript
   // In browser console
   localStorage.setItem('token-expiry-override', Date.now() + 3600000);
   ```

## Resume Builder Issues

### Problem: Resume Preview Not Updating
**Symptoms:**
- Changes in form not reflecting in preview
- Preview appears blank
- Preview formatting issues

**Quick Fixes:**
1. **Toggle Template**: Switch to a different template and back
2. **Refresh Component**: Click on a different section and back
3. **Check Console**: Look for errors in browser console
4. **Manual Update**: Try clicking "Save" to force an update
5. **Fallback to Screenshots**: Show prepared screenshots of the feature
6. **Explain the Feature**: Describe how it should work while showing screenshots

### Problem: Auto-Save Not Working
**Symptoms:**
- No auto-save confirmation message
- Changes lost when navigating away
- Console errors related to saving

**Quick Fixes:**
1. **Manual Save**: Use the manual save button
2. **Check Network**: Verify API connectivity in network tab
3. **Explain the Feature**: Describe the auto-save functionality
4. **Focus on Other Features**: Move on to demonstrate other aspects
5. **Database Verification**: If possible, verify data is being saved in database

## Smart Recognition Issues

### Problem: Resume Upload Failing
**Symptoms:**
- File upload spinner continues indefinitely
- Error message about file type or size
- No response after file selection

**Quick Fixes:**
1. **Try Different File**: Have multiple resume files ready in different formats
2. **Check File Size**: Ensure file is under size limit (usually 5MB)
3. **Direct URL Entry**: If Cloudinary upload fails, have a backup direct URL to use
4. **Manual Entry**: Demonstrate the manual skill entry feature
5. **Use Pre-uploaded Example**: Have a pre-uploaded example ready to demonstrate
6. **Explain with Screenshots**: Use screenshots to explain the feature

### Problem: Resume Parsing API Issues
**Symptoms:**
- "Failed to parse resume" error
- CORS errors in console
- Timeout on API request

**Quick Fixes:**
1. **Check API Status**: Verify API Layer service status
2. **Try Backup Parser**: If available, switch to alternate parsing service
3. **Use Cached Results**: Have pre-parsed results ready to load
4. **Manual Demonstration**: Manually enter sample data to demonstrate analysis
5. **Explain the Process**: Use the opportunity to explain how the parsing works
6. **Move to Mock Data**: Use mock data to demonstrate the analysis features

## Mock Interview Issues

### Problem: Question Generation Failing
**Symptoms:**
- No questions appear
- Error message about question generation
- Infinite loading state

**Quick Fixes:**
1. **Refresh Component**: Try navigating away and back
2. **Check Console**: Look for specific errors
3. **Use Prepared Questions**: Have a set of sample questions ready
4. **Manual Entry**: Manually type a question to demonstrate the answering interface
5. **Explain Algorithm**: Use the opportunity to explain how questions are generated
6. **Show Screenshots**: Display screenshots of the feature working correctly

### Problem: Answer Evaluation Issues
**Symptoms:**
- No feedback after submitting answer
- Generic or irrelevant feedback
- Error message during evaluation

**Quick Fixes:**
1. **Simplify Answers**: Use shorter, more straightforward answers
2. **Skip Evaluation**: Focus on question presentation rather than evaluation
3. **Demonstrate Manually**: Explain what the evaluation would show
4. **Use Pre-evaluated Examples**: Show examples of previously evaluated answers
5. **Focus on Question Quality**: Emphasize the quality and relevance of generated questions

## Database and API Issues

### Problem: Database Connection Errors
**Symptoms:**
- Console errors about MongoDB connection
- Data not loading or saving
- Application hanging when data operations attempted

**Quick Fixes:**
1. **Check MongoDB Status**: Verify MongoDB Atlas status if using cloud database
2. **Restart Backend**: If possible, quickly restart the backend server
3. **Use Local Storage**: Some features can fall back to localStorage
4. **Explain Architecture**: Use the opportunity to explain the database architecture
5. **Focus on Frontend**: Demonstrate UI features that don't require database operations

### Problem: External API Failures
**Symptoms:**
- Resume parsing not working
- CORS errors in console
- Timeout messages for API calls

**Quick Fixes:**
1. **Check API Status**: Verify the status of external services
2. **Use Mock Data**: Switch to mock data for demonstration
3. **Proxy Explanation**: Explain how the backend proxy works for external APIs
4. **Alternative Features**: Focus on features that don't depend on external APIs
5. **Technical Discussion**: Use the issue as a talking point about API integration challenges

## Presentation Environment Issues

### Problem: Browser Compatibility Issues
**Symptoms:**
- Features working differently than expected
- Layout or styling problems
- JavaScript errors specific to the browser

**Quick Fixes:**
1. **Switch Browsers**: Have Chrome, Firefox, and Edge ready
2. **Responsive Mode**: Try using responsive design mode
3. **Zoom Level**: Adjust zoom level for better visibility
4. **Developer Tools**: Use browser developer tools to diagnose issues
5. **Explain Compatibility**: Briefly mention cross-browser compatibility considerations

### Problem: Network Connectivity Issues
**Symptoms:**
- Slow loading times
- Failed API requests
- Assets not loading

**Quick Fixes:**
1. **Mobile Hotspot**: Switch to a mobile hotspot if available
2. **Reduce Network Load**: Close unnecessary applications using network
3. **Local Version**: Switch to a local version of the application if available
4. **Offline Features**: Focus on features that work offline
5. **Screenshots Backup**: Use prepared screenshots and videos

## Recovery Strategies

### Quick Reset Procedure
If multiple issues occur and you need a fresh start:
1. Clear browser cache and cookies
2. Restart the browser
3. Log in with the demonstration account
4. Navigate directly to the feature you want to showcase
5. If necessary, use browser console to set up the environment

### Presentation Pivot
If technical issues persist:
1. Acknowledge the issue professionally
2. Pivot to explaining the architecture and design decisions
3. Use prepared screenshots to illustrate features
4. Focus on your development process and challenges overcome
5. Emphasize what you learned from building the application

### Post-Issue Recovery
After resolving an issue:
1. Briefly explain what happened (if relevant)
2. Highlight how the application's error handling worked
3. Continue with your presentation from a logical point
4. Maintain composure and professional demeanor
5. Use the experience to demonstrate your troubleshooting skills

## Communication Strategies

### Addressing Technical Issues
- **Be Honest**: Acknowledge issues transparently
- **Stay Calm**: Maintain professional composure
- **Provide Context**: Briefly explain what's happening
- **Focus on Solutions**: Emphasize how you're addressing the issue
- **Learn Publicly**: Demonstrate your problem-solving process

### Keeping the Audience Engaged During Troubleshooting
- **Narrate Your Process**: Explain what you're checking and why
- **Ask Rhetorical Questions**: "What might be causing this?"
- **Connect to Real-World**: "This is exactly the kind of issue developers face daily"
- **Invite Participation**: "Has anyone encountered similar issues?"
- **Use Humor Appropriately**: A light comment can ease tension

Remember that handling unexpected issues professionally demonstrates valuable skills to the evaluation panel. Your ability to troubleshoot and communicate during challenges may be just as impressive as a flawless demonstration.
